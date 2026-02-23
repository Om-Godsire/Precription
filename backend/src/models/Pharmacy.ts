import mongoose, { Schema } from 'mongoose';

const PharmacySchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    pharmacy_name: String,
    address: String,
    phone: String,
    license_number: String,
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

// PharmacySchema.index({ user_id: 1 }); // Already unique via field definition

export const Pharmacy = mongoose.model('Pharmacy', PharmacySchema);
