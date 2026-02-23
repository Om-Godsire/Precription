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
        });
        console.log('✅ Connected to MongoDB Atlas');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

export default mongoose;
