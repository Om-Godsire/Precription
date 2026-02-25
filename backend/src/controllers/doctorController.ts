import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Doctor, User, Patient, Prescription, Medicine } from '../models';
import { v4 as uuidv4 } from 'uuid';
import { generateVerificationCode, generateEmergencyToken } from '../utils/jwt';

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const user = await User.findById(userId).select('-password_hash -refresh_token');
        const doctor = await Doctor.findOne({ user_id: userId });
        if (!user || !doctor) return res.status(404).json({ error: 'Profile not found' });

        res.json({ ...doctor.toObject(), name: user.name, email: user.email, phone: user.phone });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { specialization, clinic_name } = req.body;
        await Doctor.updateOne({ user_id: userId }, { specialization, clinic_name });
        res.json({ message: 'Profile updated' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createPrescription = async (req: Request, res: Response) => {
    try {
        const doctorUserId = (req as any).user.id;
        const { patient_id, diagnosis_notes, valid_until, medicines } = req.body;

        const patient = await Patient.findOne({ user_id: patient_id });
        if (!patient) return res.status(404).json({ error: 'Patient not found' });

        const verification_code = generateVerificationCode();

        const prescription = await Prescription.create({
            patient_id,
            doctor_id: doctorUserId,
            diagnosis_notes,
            valid_until: valid_until ? new Date(valid_until) : undefined,
            verification_code,
            digital_signature: uuidv4(),
            medicines: medicines.map((m: any) => ({
                medicine_id: m.medicine_id,
                dosage: m.dosage,
                frequency: m.frequency,
                duration_days: m.duration_days,
                instructions: m.instructions,
            })),
        });

        res.status(201).json({
            id: prescription._id.toString(),
            verification_code,
            message: 'Prescription created successfully',
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getPrescriptions = async (req: Request, res: Response) => {
    try {
        const doctorUserId = (req as any).user.id;
        const prescriptions = await Prescription.find({ doctor_id: doctorUserId }).sort({ created_at: -1 });

        const result = [];
        for (const rx of prescriptions) {
            const patient = await User.findById(rx.patient_id);
            result.push({
                ...rx.toObject(),
                patient_name: patient?.name || 'Unknown',
            });
        }

        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const searchPatients = async (req: Request, res: Response) => {
    try {
        const { q } = req.query;

        const query: any = { role: 'patient' };
        if (q && (q as string).trim()) {
            query.$or = [
                { name: { $regex: q as string, $options: 'i' } },
                { email: { $regex: q as string, $options: 'i' } },
            ];
        }

        const users = await User.find(query)
            .select('-password_hash -refresh_token')
            .sort({ created_at: -1 })
            .limit(50);

        const result = [];
        for (const u of users) {
            const patient = await Patient.findOne({ user_id: u._id });
            result.push({
                id: u._id.toString(), name: u.name, email: u.email,
                blood_group: patient?.blood_group,
            });
        }

        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const addPatient = async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

        // Check if user already exists
        const existing = await User.findOne({ email });
        if (existing) {
            if (existing.role === 'patient') {
                return res.json({ message: 'Patient already exists', patient: { id: existing._id.toString(), name: existing.name, email: existing.email } });
            }
            return res.status(400).json({ error: 'This email is registered with a different role' });
        }

        // Create user with a default password (patient can change later)
        const defaultPassword = 'MedVault@123';
        const password_hash = await bcrypt.hash(defaultPassword, 12);
        const user = await User.create({ name, email, password_hash, role: 'patient' });

        // Create patient profile
        await Patient.create({
            user_id: user._id,
            emergency_token: generateEmergencyToken(),
        });

        res.status(201).json({
            message: 'Patient added successfully',
            patient: { id: user._id.toString(), name: user.name, email: user.email },
            default_password: defaultPassword,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getPatientHistory = async (req: Request, res: Response) => {
    try {
        const { patientId } = req.params;
        const prescriptions = await Prescription.find({
            patient_id: patientId, doctor_id: (req as any).user.id,
        }).sort({ created_at: -1 });

        res.json(prescriptions);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getDashboard = async (req: Request, res: Response) => {
    try {
        const doctorUserId = (req as any).user.id;

        const prescriptions = await Prescription.find({ doctor_id: doctorUserId });
        const patientIds = [...new Set(prescriptions.map(p => p.patient_id))];
        const activePrescriptions = prescriptions.filter(p => p.status === 'active');

        const recentRx = await Prescription.find({ doctor_id: doctorUserId })
            .sort({ created_at: -1 }).limit(10);

        const recent_prescriptions = [];
        for (const rx of recentRx) {
            const patient = await User.findById(rx.patient_id);
            recent_prescriptions.push({
                id: rx._id.toString(), issue_date: rx.issue_date, status: rx.status,
                verification_code: rx.verification_code,
                patient_name: patient?.name || 'Unknown',
            });
        }

        res.json({
            total_patients: patientIds.length,
            total_prescriptions: prescriptions.length,
            active_prescriptions: activePrescriptions.length,
            recent_prescriptions,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
