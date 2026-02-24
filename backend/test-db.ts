import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const mongodbUri = process.env.MONGODB_URI;

const testConnection = async () => {
    try {
        console.log('🔌 Testing MongoDB connection to:', mongodbUri?.replace(/\/\/.*@/, '//<credentials>@'));

        // DNS workaround
        const dns = require('dns');
        dns.setServers(['8.8.8.8', '8.8.4.4']);
        console.log('✅ Local DNS servers set to Google Public DNS');

        await mongoose.connect(mongodbUri!, {
            serverSelectionTimeoutMS: 10000,
            family: 4
        });
        console.log('✅ Successfully connected to MongoDB!');
        await mongoose.connection.close();
        process.exit(0);
    } catch (error: any) {
        console.error('❌ Connection Failed');
        console.error('Message:', error.message);
        console.error('Code:', error.code);
        if (error.reason) {
            console.error('Reason Servers:', Array.from(error.reason.servers.keys()));
            for (const [server, desc] of error.reason.servers) {
                console.error(`Server: ${server}`);
                console.error(`  Error: ${(desc as any).error?.message || 'None'}`);
            }
        }
        process.exit(1);
    }
};

testConnection();
