import mongoose, { Schema } from 'mongoose';

const RefillSchema = new Schema({
    prescribed_medicine_id: { type: Schema.Types.ObjectId, required: true },
    prescription_id: { type: Schema.Types.ObjectId, ref: 'Prescription', required: true },
    pharmacy_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    patient_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    refill_date: { type: Date, default: Date.now },
    quantity: Number,
    notes: String,
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

RefillSchema.index({ pharmacy_id: 1 });
RefillSchema.index({ prescription_id: 1 });

export const Refill = mongoose.model('Refill', RefillSchema);
