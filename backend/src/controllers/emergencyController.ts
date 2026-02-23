import { Request, Response } from 'express';
import { Patient, User, Prescription, Medicine } from '../models';
import QRCode from 'qrcode';
import { config } from '../config';

export const getEmergencyProfile = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const patient = await Patient.findOne({ emergency_token: token });
        if (!patient) return res.status(404).json({ error: 'Emergency profile not found' });

        const user = await User.findById(patient.user_id);

        // Get active medications
        const prescriptions = await Prescription.find({ patient_id: patient.user_id, status: 'active' });
        const medications = [];
        for (const rx of prescriptions) {
            for (const med of rx.medicines) {
                const medicine = await Medicine.findById(med.medicine_id);
                if (medicine) {
                    medications.push({
                        name: medicine.generic_name,
                        brand: medicine.brand_name,
                        dosage: med.dosage,
                        frequency: med.frequency,
                    });
                }
            }
        }

        res.json({
            name: user?.name,
            blood_group: patient.blood_group,
            allergies: patient.allergies,
            chronic_conditions: patient.chronic_conditions,
            emergency_notes: patient.emergency_notes,
            emergency_contact_name: patient.emergency_contact_name,
            emergency_contact_phone: patient.emergency_contact_phone,
            medications,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const generateEmergencyQR = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const patient = await Patient.findOne({ user_id: userId });
        if (!patient) return res.status(404).json({ error: 'Patient profile not found' });

        const baseUrl = `http://localhost:${config.port}`;
        const emergencyUrl = `${baseUrl}/api/v1/emergency/${patient.emergency_token}`;
        const qr_code = await QRCode.toDataURL(emergencyUrl);

        res.json({ qr_code, emergency_url: emergencyUrl });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getPrescriptionDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const prescription = await Prescription.findById(id);
        if (!prescription) return res.status(404).json({ error: 'Prescription not found' });

        const patient = await User.findById(prescription.patient_id);
        const doctor = await User.findById(prescription.doctor_id);

        const medicines = [];
        for (const med of prescription.medicines) {
            const medicine = await Medicine.findById(med.medicine_id);
            medicines.push({
                ...med,
                generic_name: medicine?.generic_name,
                brand_name: medicine?.brand_name,
                strength: medicine?.strength,
            });
        }

        res.json({
            ...prescription.toObject(),
            _id: prescription._id.toString(),
            patient_id: prescription.patient_id.toString(),
            doctor_id: prescription.doctor_id.toString(),
            patient_name: patient?.name,
            doctor_name: doctor?.name,
            medicines,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
