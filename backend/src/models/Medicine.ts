import mongoose, { Schema } from 'mongoose';

const MedicineSchema = new Schema({
    generic_name: { type: String, required: true },
    brand_name: String,
    strength: String,
    form: String,
    description: String,
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

// MedicineSchema.index({ generic_name: 'text', brand_name: 'text' });

export const Medicine = mongoose.model('Medicine', MedicineSchema);
