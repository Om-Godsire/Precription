import mongoose, { Schema } from 'mongoose';

const PrescribedMedicineSchema = new Schema({
    medicine_id: { type: Schema.Types.ObjectId, ref: 'Medicine', required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration_days: Number,
    instructions: String,
});

const PrescriptionSchema = new Schema({
    patient_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    doctor_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    issue_date: { type: Date, default: Date.now },
    valid_until: Date,
    diagnosis_notes: String,
    verification_code: { type: String, required: true, unique: true },
    digital_signature: String,
    file_path: String,
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    medicines: [PrescribedMedicineSchema],
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

PrescriptionSchema.index({ patient_id: 1 });
PrescriptionSchema.index({ doctor_id: 1 });
// PrescriptionSchema.index({ verification_code: 1 }); // Already unique via field definition

export const Prescription = mongoose.model('Prescription', PrescriptionSchema);
