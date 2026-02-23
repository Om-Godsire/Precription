require('./dns-fix');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./dist/config/database');
const app = express();

console.log('Applying middleware...');
app.use(helmet());
app.use(cors());
app.use(express.json());
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

console.log('Connecting to DB...');
const start = async () => {
    try {
        await connectDB();
        console.log('✅ Mini-full UP');
        process.exit(0);
    } catch (e) {
        console.error('FAILED:', e);
        process.exit(1);
    }
};
start();
