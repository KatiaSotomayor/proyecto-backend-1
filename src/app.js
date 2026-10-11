import express from 'express';
import { engine } from 'express-handlebars';
import servicesRouter from './routes/services.router.js';
import bookingsRouter from './routes/bookings.router.js';
import viewsRouter from './routes/views.router.js';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.middleware.js';

const app = express();

app.use(express.json());

app.engine('handlebars', engine({
    helpers: {
        formatPrice: value =>
            new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(value) || 0),
        formatDate: value =>
            new Date(value).toLocaleDateString('es-AR', { timeZone: 'UTC' })
    }
}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(express.static('./src/public'));

app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

app.use('/api/services', servicesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/', viewsRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;