require('./dns-fix');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB } = require('./dist/config/database');
const { config } = require('./dist/config');

const app = express();
const mongoose = require('mongoose');
mongoose.set('bufferCommands', false);
mongoose.set('autoIndex', false);

app.use(helmet());
app.use(cors());
app.use(express.json());

const mountRoutes = () => {
    const mount = (path, name) => {
        try {
            console.log(`🛣️  Mounting ${name}...`);
            app.use(path, require(`./dist/routes/${name}`).default || require(`./dist/routes/${name}`));
            console.log(`✅ ${name} OK`);
        } catch (e) {
            console.error(`❌ ${name} ERROR:`, e.message);
        }
    };
    mount('/api/v1/auth', 'authRoutes');
    mount('/api/v1/patient', 'patientRoutes');
    // mount('/api/v1/doctor', 'doctorRoutes'); 
    // mount('/api/v1/medicines', 'medicineRoutes');
    // mount('/api/v1/adherence', 'adherenceRoutes');
    // mount('/api/v1/pharmacy', 'pharmacyRoutes');
    // mount('/api/v1/caregiver', 'caregiverRoutes');
    // mount('/api/v1/emergency', 'emergencyRoutes');
    // mount('/api/v1/prescriptions', 'prescriptionRoutes');
};

app.get('/api/health', (req, res) => res.json({ status: 'ok', node: process.version }));

const start = async () => {
    try {
        console.log('🔌 Connecting to MongoDB Atlas...');
        await connectDB();

        console.log('🏗️  Registering Routes...');
        mountRoutes();

        app.listen(config.port, () => {
            console.log('\n🚀  MedVault Backend is now RUNNING! 🏥');
            console.log(`🔗  Health: http://localhost:${config.port}/api/health`);
            console.log(`📦  Local Storage: ${config.uploadDir}\n`);
        });
    } catch (e) {
        console.error('❌ CRITICAL STARTUP FAILURE:', e);
        process.exit(1);
    }
};

start();
