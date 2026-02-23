import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import dns from 'dns';

// Fix DNS for MongoDB Atlas SRV resolution
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Monkey-patch diagnostics_channel to prevent Node 24 TracingChannel crash
try {
    const dc = require('diagnostics_channel');
    if (dc.TracingChannel) {
        dc.TracingChannel.prototype.traceSync = function (fn: any, c: any, r: any, t: any, a: any) {
            return fn.apply(t, a);
        };
    }
} catch (e) { }
import { config } from './config';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';

// Route imports
import authRoutes from './routes/authRoutes';
import patientRoutes from './routes/patientRoutes';
import doctorRoutes from './routes/doctorRoutes';
import medicineRoutes from './routes/medicineRoutes';
import adherenceRoutes from './routes/adherenceRoutes';
import pharmacyRoutes from './routes/pharmacyRoutes';
import caregiverRoutes from './routes/caregiverRoutes';
import emergencyRoutes from './routes/emergencyRoutes';
import prescriptionRoutes from './routes/prescriptionRoutes';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

// uploads directory
const uploadsDir = path.resolve(config.uploadDir);
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/patient', patientRoutes);
app.use('/api/v1/doctor', doctorRoutes);
app.use('/api/v1/medicines', medicineRoutes);
app.use('/api/v1/adherence', adherenceRoutes);
app.use('/api/v1/pharmacy', pharmacyRoutes);
app.use('/api/v1/caregiver', caregiverRoutes);
app.use('/api/v1/emergency', emergencyRoutes);
app.use('/api/v1/prescriptions', prescriptionRoutes);

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
    try {
        console.log('🔌 Connecting to MongoDB Atlas...');
        await connectDB();

        app.listen(config.port, () => {
            console.log(`
╔══════════════════════════════════════════════╗
║           🏥  MedVault API Server            ║
║══════════════════════════════════════════════║
║     Port: ${config.port}                              ║
║     Environment: ${config.nodeEnv}                 ║
║     Database: MongoDB Atlas                  ║
║     API Base: http://localhost:${config.port}/api/v1  ║
╚══════════════════════════════════════════════╝
      `);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
