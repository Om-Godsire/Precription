import mongoose from 'mongoose';
import { config } from './index';

export const connectDB = async (): Promise<void> => {
    try {
        // Fix DNS for MongoDB Atlas SRV resolution (local DNS often fails SRV lookups)
        const dns = require('dns');
        dns.setServers(['8.8.8.8', '8.8.4.4']);

        await mongoose.connect(config.mongodbUri, {
            serverSelectionTimeoutMS: 15000,
            autoIndex: false, // Prevent index building on startup to avoid Node v24 crashes
            family: 4, // Force IPv4 to avoid Node v24 DNS/IPv6 resolution issues
        });
        console.log('✅ Connected to MongoDB Atlas');
    } catch (error: any) {
        console.error('❌ MongoDB connection error details:');
        console.error('   Message:', error.message);
        console.error('   Code:', error.code);
        console.error('   Reason:', JSON.stringify(error.reason, null, 2));
        process.exit(1);
    }
};

export default mongoose;
