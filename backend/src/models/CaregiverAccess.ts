import mongoose, { Schema } from 'mongoose';

const CaregiverAccessSchema = new Schema({
    patient_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    caregiver_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    permission_level: { type: String, enum: ['view', 'manage'], default: 'view' },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

CaregiverAccessSchema.index({ caregiver_id: 1 });
CaregiverAccessSchema.index({ patient_id: 1, caregiver_id: 1 }, { unique: true });

export const CaregiverAccess = mongoose.model('CaregiverAccess', CaregiverAccessSchema);
