import { Request, Response } from 'express';
import { AdherenceLog, Prescription, SideEffect, Medicine } from '../models';

export const logAdherence = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { prescribed_medicine_id, scheduled_time, status, taken_time, notes } = req.body;

        // Find the prescription containing this medicine
        const prescription = await Prescription.findOne({
            patient_id: userId,
            'medicines._id': prescribed_medicine_id,
        });
        if (!prescription) return res.status(404).json({ error: 'Prescribed medicine not found' });

        const log = await AdherenceLog.create({
            prescribed_medicine_id,
            patient_id: userId,
            prescription_id: prescription._id,
            scheduled_time: new Date(scheduled_time),
            taken_time: taken_time ? new Date(taken_time) : undefined,
            status,
            notes,
        });

        res.status(201).json({ ...log.toObject(), _id: log._id.toString() });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getLogs = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const days = parseInt(req.query.days as string) || 30;
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const logs = await AdherenceLog.find({
            patient_id: userId,
            created_at: { $gte: since },
        }).sort({ created_at: -1 });

        // Enrich with medicine info
        const result = [];
        for (const log of logs) {
            const prescription = await Prescription.findById(log.prescription_id);
            const med = prescription?.medicines.find((m: any) => m._id?.toString() === log.prescribed_medicine_id);
            const medicine = med ? await Medicine.findById(med.medicine_id) : null;

            result.push({
                ...log.toObject(),
                generic_name: medicine?.generic_name || 'Unknown',
                brand_name: medicine?.brand_name,
                dosage: med?.dosage,
            });
        }

        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const logSideEffect = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { prescribed_medicine_id, description, severity } = req.body;

        const prescription = await Prescription.findOne({
            patient_id: userId,
            'medicines._id': prescribed_medicine_id,
        });
        if (!prescription) return res.status(404).json({ error: 'Prescribed medicine not found' });

        const sideEffect = await SideEffect.create({
            prescribed_medicine_id,
            patient_id: userId,
            prescription_id: prescription._id,
            description,
            severity,
        });

        res.status(201).json({ ...sideEffect.toObject(), _id: sideEffect._id.toString() });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getSideEffects = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const effects = await SideEffect.find({ patient_id: userId }).sort({ created_at: -1 });
        res.json(effects);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
