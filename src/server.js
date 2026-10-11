import { createServer } from 'node:http';
import { Server } from 'socket.io';
import app from './app.js';
import { envConfig } from './config/env.config.js';
import { connectDB } from './config/database.config.js';

const startServer = async () => {
    await connectDB();

    const httpServer = createServer(app);
    const io = new Server(httpServer);

    app.set('io', io);

    io.on('connection', socket => {
        console.log(`Cliente conectado: ${socket.id}`);

        socket.on('disconnect', () => {
            console.log(`Cliente desconectado: ${socket.id}`);
        });
    });

    httpServer.listen(envConfig.port, () => {
        console.log(`${envConfig.appName} escuchando en el puerto ${envConfig.port} (${envConfig.appEnv})`);
    });
};

startServer();