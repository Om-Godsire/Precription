import { Request, Response } from 'express';
import { User, Patient, CaregiverAccess, Prescription, AdherenceLog } from '../models';

export const linkPatient = async (req: Request, res: Response) => {
    try {
        const caregiverId = (req as any).user.id;
        const { patient_email, permission_level } = req.body;

        const patientUser = await User.findOne({ email: patient_email, role: 'patient' });
        if (!patientUser) return res.status(404).json({ error: 'Patient not found with this email' });

        const existing = await CaregiverAccess.findOne({ patient_id: patientUser._id, caregiver_id: caregiverId });
        if (existing) return res.status(400).json({ error: 'Already linked to this patient' });

        await CaregiverAccess.create({
            patient_id: patientUser._id,
            caregiver_id: caregiverId,
            permission_level: permission_level || 'view',
        });

        res.status(201).json({ message: 'Successfully linked to patient' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getLinkedPatients = async (req: Request, res: Response) => {
    try {
        const caregiverId = (req as any).user.id;
        const links = await CaregiverAccess.find({ caregiver_id: caregiverId });

        const patients = [];
        for (const link of links) {
            const user = await User.findById(link.patient_id);
            const patient = await Patient.findOne({ user_id: link.patient_id });

            // Calculate adherence
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const logs = await AdherenceLog.find({ patient_id: link.patient_id, created_at: { $gte: thirtyDaysAgo } });
            const total = logs.length;
            const taken = logs.filter(l => l.status === 'taken').length;

            patients.push({
                patient_id: link.patient_id.toString(),
                name: user?.name,
                email: user?.email,
                blood_group: patient?.blood_group,
                permission_level: link.permission_level,
                adherence_score: total > 0 ? Math.round((taken / total) * 100) : 100,
            });
        }

        res.json(patients);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getPatientDashboard = async (req: Request, res: Response) => {
    try {
        const caregiverId = (req as any).user.id;
        const { patientId } = req.params;

        const access = await CaregiverAccess.findOne({ patient_id: patientId, caregiver_id: caregiverId });
        if (!access) return res.status(403).json({ error: 'Not authorized to view this patient' });

        const user = await User.findById(patientId);
        const patient = await Patient.findOne({ user_id: patientId });
        const prescriptions = await Prescription.find({ patient_id: patientId, status: 'active' });

        let activeMeds = 0;
        prescriptions.forEach(rx => { activeMeds += rx.medicines.length; });

        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const logs = await AdherenceLog.find({ patient_id: patientId, created_at: { $gte: thirtyDaysAgo } });
        const total = logs.length;
        const taken = logs.filter(l => l.status === 'taken').length;
        const missed = logs.filter(l => l.status === 'missed').length;

        res.json({
            patient: { name: user?.name, blood_group: patient?.blood_group, allergies: patient?.allergies },
            active_medications: activeMeds,
            adherence_score: total > 0 ? Math.round((taken / total) * 100) : 100,
            missed_doses: missed,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getDashboard = async (req: Request, res: Response) => {
    try {
        const caregiverId = (req as any).user.id;
        const links = await CaregiverAccess.find({ caregiver_id: caregiverId });

        const patients = [];
        const alerts: any[] = [];

        for (const link of links) {
            const user = await User.findById(link.patient_id);
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const logs = await AdherenceLog.find({ patient_id: link.patient_id, created_at: { $gte: thirtyDaysAgo } });
            const total = logs.length;
            const taken = logs.filter(l => l.status === 'taken').length;
            const missed = logs.filter(l => l.status === 'missed').length;
            const score = total > 0 ? Math.round((taken / total) * 100) : 100;

            patients.push({
                patient_id: link.patient_id.toString(),
                name: user?.name,
                permission_level: link.permission_level,
                adherence_score: score,
            });

            if (missed > 0) {
                alerts.push({
                    patient_id: link.patient_id.toString(),
                    name: user?.name,
                    missed_doses: missed,
                    adherence_score: score,
                });
            }
        }

        res.json({ total_patients: links.length, patients, alerts });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
