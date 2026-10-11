import dotenv from 'dotenv';

dotenv.config();

const requiredVars = ['PORT', 'MONGO_URI'];

for (const key of requiredVars) {
    if (!process.env[key]) {
        throw new Error(`Falta la variable de entorno OBLIGATORIA: ${key}`);
    }
}

export const envConfig = {
    port: Number(process.env.PORT),
    appName: process.env.APP_NAME ?? 'Proyecto Final Backend',
    appEnv: process.env.APP_ENV ?? 'development',
    mongoUri: process.env.MONGO_URI
};