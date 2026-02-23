import mongoose, { Schema } from 'mongoose';

const SideEffectSchema = new Schema({
    prescribed_medicine_id: { type: Schema.Types.ObjectId, required: true },
    patient_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    prescription_id: { type: Schema.Types.ObjectId, ref: 'Prescription', required: true },
    description: { type: String, required: true },
    severity: { type: String, enum: ['mild', 'moderate', 'severe'], default: 'mild' },
    reported_date: { type: Date, default: Date.now },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

SideEffectSchema.index({ patient_id: 1 });

export const SideEffect = mongoose.model('SideEffect', SideEffectSchema);
