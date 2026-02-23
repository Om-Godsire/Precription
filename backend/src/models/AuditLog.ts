import mongoose, { Schema } from 'mongoose';

const AuditLogSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    entity_type: String,
    entity_id: String,
    details: String,
    ip_address: String,
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

AuditLogSchema.index({ user_id: 1 });

export const AuditLog = mongoose.model('AuditLog', AuditLogSchema);
