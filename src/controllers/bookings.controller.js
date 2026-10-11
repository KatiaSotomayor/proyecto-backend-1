import { BookingsService } from '../services/bookings.service.js';

const bookingsService = new BookingsService();

const sendError = (res, error) => {
    const status = error.status ?? (error.name === 'ValidationError' ? 400 : 500);
    res.status(status).json({
        status: 'error',
        message: status === 500 ? 'Error interno del servidor' : error.message
    });
};

export const createBooking = async (req, res) => {
    try {
        const booking = await bookingsService.createBooking(req.body ?? {});
        res.status(201).json({ status: 'success', payload: booking });
    } catch (error) {
        sendError(res, error);
    }
};

export const getBookings = async (req, res) => {
    const bookings = await bookingsService.getBookings();
    res.status(200).json({ status: 'success', payload: bookings });
};

export const getBookingById = async (req, res) => {
    const booking = await bookingsService.getBookingById(req.params.bid);

    if (!booking) {
        return res.status(404).json({ status: 'error', message: 'Reserva no encontrada' });
    }
    res.status(200).json({ status: 'success', payload: booking });
};

export const addServiceToBooking = async (req, res) => {
    try {
        const { quantity } = req.body ?? {};
        const booking = await bookingsService.addServiceToBooking(req.params.bid, req.params.sid, quantity);
        res.status(200).json({ status: 'success', payload: booking });
    } catch (error) {
        sendError(res, error);
    }
};

export const updateServiceQuantity = async (req, res) => {
    try {
        const booking = await bookingsService.updateServiceQuantity(
            req.params.bid,
            req.params.sid,
            req.body.quantity
        );
        res.status(200).json({ status: 'success', payload: booking });
    } catch (error) {
        sendError(res, error);
    }
};

export const removeServiceFromBooking = async (req, res) => {
    try {
        const booking = await bookingsService.removeServiceFromBooking(req.params.bid, req.params.sid);
        res.status(200).json({ status: 'success', payload: booking });
    } catch (error) {
        sendError(res, error);
    }
};

export const clearBookingServices = async (req, res) => {
    try {
        const booking = await bookingsService.clearBookingServices(req.params.bid);
        res.status(200).json({ status: 'success', payload: booking });
    } catch (error) {
        sendError(res, error);
    }
};

export const deleteBooking = async (req, res) => {
    try {
        const borrado = await bookingsService.deleteBooking(req.params.bid);
        res.status(200).json({ status: 'success', payload: borrado });
    } catch (error) {
        sendError(res, error);
    }
};