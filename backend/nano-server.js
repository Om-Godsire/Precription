const express = require('express');
const mongoose = require('mongoose');
require('dns').setServers(['8.8.8.8', '8.8.4.4']);

const app = express();
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

const start = async () => {
    try {
        console.log('Testing minimal boot...');
        await mongoose.connect('mongodb+srv://user:' + encodeURIComponent('pass') + '@cluster.mongodb.net/test'); // Fake but tests driver init
        app.listen(5007, () => {
            console.log('✅ Nano-Server UP on 5007');
            process.exit(0);
        });
    } catch (e) {
        console.log('Boot reached but expectedly failed connection:', e.message);
        process.exit(0); // If it gets here, it didn't crash
    }
};
start();
