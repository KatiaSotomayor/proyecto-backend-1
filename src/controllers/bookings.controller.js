import { BookingManager } from '../managers/BookingManager.js';

const bookingManager = new BookingManager();

const sendError = (res, error) => {
    const status = error.status ?? 500;
    res.status(status).json({
        status: 'error',
        message: status === 500 ? 'Error interno del servidor' : error.message
    });
};

export const createBooking = async (req, res) => {
    try {
        const booking = await bookingManager.createBooking(req.body ?? {});
        res.status(201).json({ status: 'success', payload: booking });
    } catch (error) {
        sendError(res, error);
    }
};

export const getBookingById = async (req, res) => {
    const booking = await bookingManager.getBookingById(Number(req.params.bid));

    if (!booking) {
        return res.status(404).json({ status: 'error', message: 'Reserva no encontrada' });
    }
    res.status(200).json({ status: 'success', payload: booking });
};

export const addServiceToBooking = async (req, res) => {
    try {
        const booking = await bookingManager.addServiceToBooking(
            Number(req.params.bid),
            Number(req.params.sid)
        );
        res.status(200).json({ status: 'success', payload: booking });
    } catch (error) {
        sendError(res, error);
    }
};