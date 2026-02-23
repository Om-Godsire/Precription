import { Request, Response } from 'express';
import { Patient, User, Prescription, AdherenceLog } from '../models';
import { generateEmergencyToken } from '../utils/jwt';

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const user = await User.findById(userId).select('-password_hash -refresh_token');
        const patient = await Patient.findOne({ user_id: userId });
        if (!user || !patient) return res.status(404).json({ error: 'Profile not found' });

        res.json({ ...patient.toObject(), name: user.name, email: user.email, phone: user.phone });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { blood_group, allergies, chronic_conditions, emergency_contact_name, emergency_contact_phone, emergency_notes } = req.body;

        await Patient.updateOne({ user_id: userId }, {
            blood_group, allergies, chronic_conditions,
            emergency_contact_name, emergency_contact_phone, emergency_notes,
        });

        res.json({ message: 'Profile updated' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getMedications = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const prescriptions = await Prescription.find({ patient_id: userId, status: 'active' });

        const meds: any[] = [];
        for (const rx of prescriptions) {
            for (const med of rx.medicines) {
                const medicine = await (await import('../models/Medicine')).Medicine.findById(med.medicine_id);
                if (medicine) {
                    meds.push({
                        id: (med as any)._id.toString(),
                        generic_name: medicine.generic_name,
                        brand_name: medicine.brand_name,
                        strength: medicine.strength,
                        form: medicine.form,
                        dosage: med.dosage,
                        frequency: med.frequency,
                        duration_days: med.duration_days,
                        instructions: med.instructions,
                        prescription_id: rx._id.toString(),
                    });
                }
            }
        }

        res.json(meds);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getAdherenceScore = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const logs = await AdherenceLog.find({ patient_id: userId, created_at: { $gte: thirtyDaysAgo } });
        const total = logs.length;
        const taken = logs.filter(l => l.status === 'taken').length;
        const score = total > 0 ? Math.round((taken / total) * 100) : 100;

        res.json({ score, total, taken, missed: logs.filter(l => l.status === 'missed').length });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getDashboard = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        const activePrescriptions = await Prescription.find({ patient_id: userId, status: 'active' });
        let activeMeds = 0;
        activePrescriptions.forEach(rx => { activeMeds += rx.medicines.length; });

        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const logs = await AdherenceLog.find({ patient_id: userId, created_at: { $gte: thirtyDaysAgo } });
        const total = logs.length;
        const taken = logs.filter(l => l.status === 'taken').length;
        const missed = logs.filter(l => l.status === 'missed').length;
        const adherence_score = total > 0 ? Math.round((taken / total) * 100) : 100;

        const recentRx = await Prescription.find({ patient_id: userId })
            .sort({ created_at: -1 }).limit(5);

        const recent_prescriptions = [];
        for (const rx of recentRx) {
            const doctor = await User.findById(rx.doctor_id);
            recent_prescriptions.push({
                id: rx._id.toString(), issue_date: rx.issue_date, status: rx.status,
                doctor_name: doctor?.name || 'Unknown',
            });
        }

        res.json({
            active_medications: activeMeds,
            adherence_score,
            missed_doses: missed,
            upcoming_refills: 0,
            recent_prescriptions,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getPrescriptions = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const prescriptions = await Prescription.find({ patient_id: userId }).sort({ created_at: -1 });

        const result = [];
        for (const rx of prescriptions) {
            const doctor = await User.findById(rx.doctor_id);
            result.push({ ...rx.toObject(), _id: rx._id.toString(), doctor_name: doctor?.name || 'Unknown' });
        }

        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const regenerateEmergencyToken = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const newToken = generateEmergencyToken();
        await Patient.updateOne({ user_id: userId }, { emergency_token: newToken });
        res.json({ emergency_token: newToken });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
