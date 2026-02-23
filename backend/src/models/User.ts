import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: String,
    password_hash: { type: String, required: true },
    role: { type: String, enum: ['patient', 'doctor', 'pharmacy', 'caregiver'], required: true },
    refresh_token: String,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// UserSchema.index({ email: 1 }); // Already unique via field definition
UserSchema.index({ role: 1 });

export const User = mongoose.model('User', UserSchema);
