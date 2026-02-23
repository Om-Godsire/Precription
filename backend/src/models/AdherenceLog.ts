import mongoose, { Schema } from 'mongoose';

const AdherenceLogSchema = new Schema({
    prescribed_medicine_id: { type: Schema.Types.ObjectId, required: true },
    patient_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    prescription_id: { type: Schema.Types.ObjectId, ref: 'Prescription', required: true },
    scheduled_time: { type: Date, required: true },
    taken_time: Date,
    status: { type: String, enum: ['taken', 'missed', 'skipped'], required: true },
    notes: String,
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

AdherenceLogSchema.index({ patient_id: 1 });
AdherenceLogSchema.index({ prescribed_medicine_id: 1 });

export const AdherenceLog = mongoose.model('AdherenceLog', AdherenceLogSchema);
