require('./dns-fix');
const express = require('express');
const { connectDB } = require('./dist/config/database');
const app = express();
app.get('/health', (req, res) => res.json({ status: 'ok' }));
const start = async () => {
    try {
        console.log('🔌 Connecting...');
        await connectDB();
        const server = app.listen(5005, () => {
            console.log('✅ Mini server UP on 5005');
            process.exit(0); // Exit on success to confirm it reached here
        });
    } catch (e) {
        console.error('❌ Mini server FAILED:', e);
        process.exit(1);
    }
};
start();
