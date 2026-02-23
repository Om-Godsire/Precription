import mongoose, { Schema } from 'mongoose';

const PatientSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    blood_group: String,
    allergies: String,
    chronic_conditions: String,
    emergency_notes: String,
    emergency_contact_name: String,
    emergency_contact_phone: String,
    emergency_token: { type: String, unique: true, sparse: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

// PatientSchema.index({ user_id: 1 }); // Already unique via field definition
PatientSchema.index({ emergency_token: 1 });

export const Patient = mongoose.model('Patient', PatientSchema);
