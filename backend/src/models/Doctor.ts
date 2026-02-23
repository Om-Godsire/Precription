import mongoose, { Schema } from 'mongoose';

const DoctorSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    specialization: String,
    clinic_name: String,
    license_number: { type: String, required: true },
    is_verified: { type: Boolean, default: false },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

// DoctorSchema.index({ user_id: 1 }); // Already unique via field definition

export const Doctor = mongoose.model('Doctor', DoctorSchema);
