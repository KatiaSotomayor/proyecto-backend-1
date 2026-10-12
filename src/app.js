import express from 'express';
import { engine } from 'express-handlebars';
import servicesRouter from './routes/services.router.js';
import bookingsRouter from './routes/bookings.router.js';
import viewsRouter from './routes/views.router.js';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.middleware.js';

const app = express();

app.use(express.json());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(express.static('./src/public'));

app.get('/', (req, res) => {
    res.redirect('/services');
});

/*api rest*/
app.use('/api/services', servicesRouter);
app.use('/api/bookings', bookingsRouter);

app.use('/', viewsRouter);
app.use('/views', viewsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
