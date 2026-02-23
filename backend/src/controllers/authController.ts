import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, Patient, Doctor, Pharmacy } from '../models';
import { generateToken, generateRefreshToken, generateEmergencyToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, password, role, ...profileData } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: 'Email already registered' });

        const password_hash = await bcrypt.hash(password, 12);
        const user = await User.create({ name, email, phone, password_hash, role });

        // Create role-specific profile
        if (role === 'patient') {
            await Patient.create({
                user_id: user._id,
                blood_group: profileData.blood_group,
                allergies: profileData.allergies,
                chronic_conditions: profileData.chronic_conditions,
                emergency_contact_name: profileData.emergency_contact_name,
                emergency_contact_phone: profileData.emergency_contact_phone,
                emergency_token: generateEmergencyToken(),
            });
        } else if (role === 'doctor') {
            await Doctor.create({
                user_id: user._id,
                specialization: profileData.specialization,
                clinic_name: profileData.clinic_name,
                license_number: profileData.license_number || 'PENDING',
            });
        } else if (role === 'pharmacy') {
            await Pharmacy.create({
                user_id: user._id,
                pharmacy_name: profileData.pharmacy_name,
                address: profileData.address,
                phone: phone,
                license_number: profileData.license_number,
            });
        }
        // Caregiver needs no separate profile table

        const token = generateToken({ id: user._id.toString(), email: user.email, role: user.role });
        const refreshToken = generateRefreshToken({ id: user._id.toString() });
        await User.updateOne({ _id: user._id }, { refresh_token: refreshToken });

        res.status(201).json({
            token, refreshToken,
            user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Registration failed' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = generateToken({ id: user._id.toString(), email: user.email, role: user.role });
        const refreshToken = generateRefreshToken({ id: user._id.toString() });
        await User.updateOne({ _id: user._id }, { refresh_token: refreshToken });

        res.json({
            token, refreshToken,
            user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Login failed' });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken: rt } = req.body;
        if (!rt) return res.status(400).json({ error: 'Refresh token required' });

        const user = await User.findOne({ refresh_token: rt });
        if (!user) return res.status(401).json({ error: 'Invalid refresh token' });

        const token = generateToken({ id: user._id.toString(), email: user.email, role: user.role });
        const newRefreshToken = generateRefreshToken({ id: user._id.toString() });
        await User.updateOne({ _id: user._id }, { refresh_token: newRefreshToken });

        res.json({ token, refreshToken: newRefreshToken });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Token refresh failed' });
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const user = await User.findById(userId).select('-password_hash -refresh_token');
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({ user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role } });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
