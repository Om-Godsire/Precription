import jwt from 'jsonwebtoken';
import { config } from '../config';

export const generateToken = (payload: { id: string; email: string; role: string }): string => {
    return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn as string });
};

export const generateRefreshToken = (payload: { id: string }): string => {
    return jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn as string });
};

export const verifyRefreshToken = (token: string): { id: string } => {
    return jwt.verify(token, config.jwt.refreshSecret) as { id: string };
};

export const generateVerificationCode = (): string => {
    return 'RX-' + Math.random().toString(36).substring(2, 10).toUpperCase();
};

export const generateEmergencyToken = (): string => {
    return 'EM-' + Math.random().toString(36).substring(2, 14).toUpperCase();
};
