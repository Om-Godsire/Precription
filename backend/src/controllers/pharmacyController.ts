import { Request, Response } from 'express';
import { Prescription, Pharmacy, User, Medicine, Refill } from '../models';

export const verifyPrescription = async (req: Request, res: Response) => {
    try {
        const { code } = req.params;
        const prescription = await Prescription.findOne({ verification_code: code });
        if (!prescription) return res.status(404).json({ error: 'Prescription not found' });

        const patient = await User.findById(prescription.patient_id);
        const doctor = await User.findById(prescription.doctor_id);

        const medicines = [];
        for (const med of prescription.medicines) {
            const medicine = await Medicine.findById(med.medicine_id);
            medicines.push({
                id: med._id,
                generic_name: medicine?.generic_name,
                brand_name: medicine?.brand_name,
                strength: medicine?.strength,
                dosage: med.dosage,
                frequency: med.frequency,
                duration_days: med.duration_days,
            });
        }

        res.json({
            prescription: {
                id: prescription._id,
                issue_date: prescription.issue_date,
                valid_until: prescription.valid_until,
                status: prescription.status,
                diagnosis_notes: prescription.diagnosis_notes,
                patient_name: patient?.name,
                doctor_name: doctor?.name,
            },
            medicines,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const logRefill = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const pharmacy = await Pharmacy.findOne({ user_id: userId });
        if (!pharmacy) return res.status(404).json({ error: 'Pharmacy profile not found' });

        const { prescribed_medicine_id, prescription_id, quantity, notes } = req.body;

        const prescription = await Prescription.findById(prescription_id);
        if (!prescription) return res.status(404).json({ error: 'Prescription not found' });

        const refill = await Refill.create({
            prescribed_medicine_id,
            prescription_id,
            pharmacy_id: userId,
            patient_id: prescription.patient_id,
            quantity,
            notes,
        });

        res.status(201).json({ ...refill.toObject(), _id: refill._id.toString() });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getRefills = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const refills = await Refill.find({ pharmacy_id: userId }).sort({ created_at: -1 });

        const result = [];
        for (const r of refills) {
            const prescription = await Prescription.findById(r.prescription_id);
            const patient = await User.findById(r.patient_id);
            const med = prescription?.medicines.find((m: any) => m._id?.toString() === r.prescribed_medicine_id);
            const medicine = med ? await Medicine.findById(med.medicine_id) : null;

            result.push({
                ...r.toObject(),
                patient_name: patient?.name,
                generic_name: medicine?.generic_name,
                brand_name: medicine?.brand_name,
            });
        }

        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getDashboard = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        const total_refills = await Refill.countDocuments({ pharmacy_id: userId });

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const today_refills = await Refill.countDocuments({
            pharmacy_id: userId,
            refill_date: { $gte: todayStart },
        });

        const recent_refills = await Refill.find({ pharmacy_id: userId })
            .sort({ created_at: -1 }).limit(10);

        const enrichedRefills = [];
        for (const r of recent_refills) {
            const patient = await User.findById(r.patient_id);
            const prescription = await Prescription.findById(r.prescription_id);
            const med = prescription?.medicines.find((m: any) => m._id?.toString() === r.prescribed_medicine_id);
            const medicine = med ? await Medicine.findById(med.medicine_id) : null;

            enrichedRefills.push({
                ...r.toObject(),
                patient_name: patient?.name,
                generic_name: medicine?.generic_name,
                brand_name: medicine?.brand_name,
            });
        }

        res.json({ total_refills, today_refills, recent_refills: enrichedRefills });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
