require('./dns-fix');
const express = require('express');
const { connectDB } = require('./dist/config/database');
const app = express();

console.log('Loading models...');
const models = require('./dist/models');
console.log('Models loaded.');

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const start = async () => {
    try {
        console.log('Connecting to DB...');
        await connectDB();
        console.log('Connected.');
        app.listen(5006, () => {
            console.log('✅ Mini-Models UP on 5006');
            process.exit(0);
        });
    } catch (e) {
        console.error('FAILED:', e);
        process.exit(1);
    }
};
start();
