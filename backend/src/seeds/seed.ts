import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User, Patient, Doctor, Pharmacy, Medicine, Prescription } from '../models';
import { generateEmergencyToken, generateVerificationCode } from '../utils/jwt';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medvault';

async function seed() {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected. Seeding data...');

    // Clear existing data
    await Promise.all([
        User.deleteMany({}), Patient.deleteMany({}), Doctor.deleteMany({}),
        Pharmacy.deleteMany({}), Medicine.deleteMany({}), Prescription.deleteMany({}),
    ]);

    const passwordHash = await bcrypt.hash('Password123!', 12);

    // Create users
    const patientUser = await User.create({
        name: 'Rahul Sharma', email: 'patient@medvault.com', phone: '9876543210',
        password_hash: passwordHash, role: 'patient',
    });

    const doctorUser = await User.create({
        name: 'Dr. Priya Patel', email: 'doctor@medvault.com', phone: '9876543211',
        password_hash: passwordHash, role: 'doctor',
    });

    const pharmacyUser = await User.create({
        name: 'MedPlus Pharmacy', email: 'pharmacy@medvault.com', phone: '9876543212',
        password_hash: passwordHash, role: 'pharmacy',
    });

    const caregiverUser = await User.create({
        name: 'Anita Desai', email: 'caregiver@medvault.com', phone: '9876543213',
        password_hash: passwordHash, role: 'caregiver',
    });

    // Create profiles
    await Patient.create({
        user_id: patientUser._id,
        blood_group: 'B+',
        allergies: 'Penicillin, Sulfa drugs',
        chronic_conditions: 'Type 2 Diabetes, Hypertension',
        emergency_contact_name: 'Meera Sharma',
        emergency_contact_phone: '9876543299',
        emergency_token: generateEmergencyToken(),
    });

    await Doctor.create({
        user_id: doctorUser._id,
        specialization: 'General Medicine',
        clinic_name: 'City Care Clinic',
        license_number: 'MH-MED-2020-12345',
        is_verified: true,
    });

    await Pharmacy.create({
        user_id: pharmacyUser._id,
        pharmacy_name: 'MedPlus Pharmacy',
        address: '123 MG Road, Pune, Maharashtra',
        phone: '9876543212',
        license_number: 'PH-MH-2021-56789',
    });

    // Create medicines
    const meds = await Medicine.insertMany([
        { generic_name: 'Metformin', brand_name: 'Glucophage', strength: '500mg', form: 'tablet', description: 'Oral diabetes medicine' },
        { generic_name: 'Amlodipine', brand_name: 'Norvasc', strength: '5mg', form: 'tablet', description: 'Calcium channel blocker for hypertension' },
        { generic_name: 'Atorvastatin', brand_name: 'Lipitor', strength: '10mg', form: 'tablet', description: 'Statin for cholesterol' },
        { generic_name: 'Pantoprazole', brand_name: 'Pantocid', strength: '40mg', form: 'tablet', description: 'Proton pump inhibitor' },
        { generic_name: 'Cetirizine', brand_name: 'Zyrtec', strength: '10mg', form: 'tablet', description: 'Antihistamine' },
        { generic_name: 'Amoxicillin', brand_name: 'Amoxil', strength: '500mg', form: 'capsule', description: 'Antibiotic' },
        { generic_name: 'Paracetamol', brand_name: 'Crocin', strength: '500mg', form: 'tablet', description: 'Analgesic and antipyretic' },
        { generic_name: 'Omeprazole', brand_name: 'Prilosec', strength: '20mg', form: 'capsule', description: 'Proton pump inhibitor' },
    ]);

    // Create a prescription
    await Prescription.create({
        patient_id: patientUser._id,
        doctor_id: doctorUser._id,
        diagnosis_notes: 'Type 2 Diabetes with Hypertension. Regular monitoring advised.',
        valid_until: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        verification_code: generateVerificationCode(),
        digital_signature: 'sig_' + Date.now(),
        status: 'active',
        medicines: [
            { medicine_id: meds[0]._id, dosage: '500mg', frequency: 'Twice daily', duration_days: 90, instructions: 'Take with meals' },
            { medicine_id: meds[1]._id, dosage: '5mg', frequency: 'Once daily', duration_days: 90, instructions: 'Take in the morning' },
            { medicine_id: meds[2]._id, dosage: '10mg', frequency: 'Once daily at night', duration_days: 90, instructions: 'Take after dinner' },
        ],
    });

    console.log('');
    console.log('✅ Database seeded successfully!');
    console.log('');
    console.log('Demo Accounts (password: Password123!):');
    console.log('  Patient:   patient@medvault.com');
    console.log('  Doctor:    doctor@medvault.com');
    console.log('  Pharmacy:  pharmacy@medvault.com');
    console.log('  Caregiver: caregiver@medvault.com');
    console.log('');

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seed error:', err);
    process.exit(1);
});
