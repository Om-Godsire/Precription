import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: parseInt(process.env.PORT || '5000'),
    nodeEnv: process.env.NODE_ENV || 'development',
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/medvault',
    jwt: {
        secret: process.env.JWT_SECRET || 'default_jwt_secret',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
        expiresIn: '24h',
        refreshExpiresIn: '7d',
    },
    uploadDir: process.env.UPLOAD_DIR || './uploads',
};
