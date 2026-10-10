import { Router } from 'express';
import { BookingManager } from '../managers/BookingManager.js';

const router = Router();
const bookingManager = new BookingManager();

/*traduce error*/
const Error = (res, error) => {
    const status = error.status ?? 500;
    res.status(status).json({
        status: 'error',
        message: status === 500 ? 'ERROR interno del servidor' : error.message
    });
};

/*metodo POST api booking*/
router.post('/', async (req, res) => {
    try {
        const booking = await bookingManager.createBooking(req.body ?? {});
        res.status(201).json({ status: 'success', payload: booking });
    } catch (error) {
        Error(res, error);
    }
});

/*metodo GET*/
router.get('/:bid', async (req, res) => {
    const booking = await bookingManager.getBookingById(Number(req.params.bid));

    if (!booking) {
        return res.status(404).json({ status: 'error', message: 'Reserva no encontrada' });
    }
    res.status(200).json({ status: 'success', payload: booking });
});

/*metodo POST*/
router.post('/:bid/services/:sid', async (req, res) => {
    try {
        const booking = await bookingManager.addServiceToBooking(
            Number(req.params.bid),
            Number(req.params.sid)
        );
        res.status(200).json({ status: 'success', payload: booking });
    } catch (error) {
        Error(res, error);
    }
});

export default router;