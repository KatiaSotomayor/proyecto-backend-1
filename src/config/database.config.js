import mongoose from 'mongoose';
import { envConfig } from './env.config.js';

export const connectDB = async () => {
    try {
        await mongoose.connect(envConfig.mongoUri);
        console.log('Conectado a la base de datos MongoDB');
    } catch (error) {
        console.error('No se pudo conectar a MongoDB. Error: ', error.message);
        process.exit(1);
    }
};