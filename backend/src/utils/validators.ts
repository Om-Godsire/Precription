import { z } from 'zod';

// MongoDB ObjectId regex: 24 hex characters
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const objectIdSchema = z.string().regex(objectIdRegex, 'Invalid ID format');

export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        phone: z.string().min(10, 'Phone must be at least 10 digits').optional(),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        role: z.enum(['patient', 'doctor', 'pharmacy', 'caregiver']),
        // Patient-specific
        blood_group: z.string().optional(),
        allergies: z.string().optional(),
        chronic_conditions: z.string().optional(),
        emergency_contact_name: z.string().optional(),
        emergency_contact_phone: z.string().optional(),
        // Doctor-specific
        specialization: z.string().optional(),
        clinic_name: z.string().optional(),
        license_number: z.string().optional(),
        // Pharmacy-specific
        pharmacy_name: z.string().optional(),
        address: z.string().optional(),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required'),
    }),
});

export const prescriptionSchema = z.object({
    body: z.object({
        patient_id: objectIdSchema,
        diagnosis_notes: z.string().optional(),
        valid_until: z.string().optional(),
        medicines: z.array(z.object({
            medicine_id: objectIdSchema,
            dosage: z.string().min(1, 'Dosage is required'),
            frequency: z.string().min(1, 'Frequency is required'),
            duration_days: z.number().int().positive().optional(),
            instructions: z.string().optional(),
        })).min(1, 'At least one medicine is required'),
    }),
});

export const adherenceSchema = z.object({
    body: z.object({
        prescribed_medicine_id: objectIdSchema,
        scheduled_time: z.string(),
        status: z.enum(['taken', 'missed', 'skipped']),
        taken_time: z.string().optional(),
        notes: z.string().optional(),
    }),
});

export const sideEffectSchema = z.object({
    body: z.object({
        prescribed_medicine_id: objectIdSchema,
        description: z.string().min(1, 'Description is required'),
        severity: z.enum(['mild', 'moderate', 'severe']),
    }),
});

export const refillSchema = z.object({
    body: z.object({
        prescribed_medicine_id: objectIdSchema,
        prescription_id: objectIdSchema,
        quantity: z.number().int().positive().optional(),
        notes: z.string().optional(),
    }),
});

export const medicineSchema = z.object({
    body: z.object({
        generic_name: z.string().min(1, 'Generic name is required'),
        brand_name: z.string().optional(),
        strength: z.string().optional(),
        form: z.string().optional(),
        description: z.string().optional(),
    }),
});

export const caregiverLinkSchema = z.object({
    body: z.object({
        patient_email: z.string().email('Invalid patient email'),
        permission_level: z.enum(['view', 'manage']).optional(),
    }),
});
