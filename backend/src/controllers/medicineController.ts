import { Request, Response } from 'express';
import { Medicine } from '../models';

export const searchMedicines = async (req: Request, res: Response) => {
    try {
        const { search } = req.query;
        let medicines;

        if (search) {
            medicines = await Medicine.find({
                $or: [
                    { generic_name: { $regex: search as string, $options: 'i' } },
                    { brand_name: { $regex: search as string, $options: 'i' } },
                ],
            }).limit(20);
        } else {
            medicines = await Medicine.find().limit(50);
        }

        res.json(medicines);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getMedicine = async (req: Request, res: Response) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) return res.status(404).json({ error: 'Medicine not found' });
        res.json(medicine);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createMedicine = async (req: Request, res: Response) => {
    try {
        const { generic_name, brand_name, strength, form, description } = req.body;
        const medicine = await Medicine.create({ generic_name, brand_name, strength, form, description });
        res.status(201).json(medicine);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
