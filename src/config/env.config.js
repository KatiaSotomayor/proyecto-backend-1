import dotenv from 'dotenv';

dotenv.config();

const variablesRequeridas = ['PORT', 'NODE_ENV', 'MONGO_URI'];

for (const key of variablesRequeridas) {
    if (!process.env[key]) {
        throw new Error(`Falta una variable de entorno OBLIGATORIA: ${key}`);
    }
}

export const envConfig = {
    port: Number(process.env.PORT),
    nodeEnv: process.env.NODE_ENV,
    mongoUri: process.env.MONGO_URI,
};