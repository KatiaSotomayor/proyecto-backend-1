import { BookingsRepository } from '../repositories/bookings.repository.js';
import { ServicesService } from './services.service.js';

const createError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

export class BookingsService {
    constructor(repository = new BookingsRepository(), servicesService = new ServicesService()) {
        this.repository = repository;
        this.servicesService = servicesService;
    }

    async createBooking(bookingData) {
        return this.repository.create({ ...bookingData, services: [] });
    }

    async getBookings() {
        return this.repository.getAll();
    }

    /*devuelve reserva*/
    async getBookingById(id) {
        return this.repository.getByIdPopulated(id);
    }

    async addServiceToBooking(bookingId, serviceId, quantity = 1) {
        const booking = await this.repository.getById(bookingId);
        if (!booking) throw createError(404, 'Reserva no encontrada');

        const servicio = await this.servicesService.getServiceById(serviceId);
        if (!servicio) throw createError(404, 'Servicio no encontrado');

        const alreadyAdded = booking.services.some(item => String(item.service) === serviceId);

        const updatedServices = alreadyAdded
            ? booking.services.map(item =>
                String(item.service) === serviceId ? { ...item, quantity: item.quantity + quantity } : item
              )
            : [...booking.services, { service: servicio._id, quantity }];

        await this.repository.update(bookingId, { services: updatedServices });
        return this.repository.getByIdPopulated(bookingId);
    }

    async updateServiceQuantity(bookingId, serviceId, quantity) {
        const booking = await this.repository.getById(bookingId);
        if (!booking) throw createError(404, 'Reserva no encontrada');

        const isInBooking = booking.services.some(item => String(item.service) === serviceId);
        if (!isInBooking) throw createError(404, 'El servicio no está asociado a esta reserva');

        const updatedServices = booking.services.map(item =>
            String(item.service) === serviceId ? { ...item, quantity } : item
        );

        await this.repository.update(bookingId, { services: updatedServices });
        return this.repository.getByIdPopulated(bookingId);
    }

    async removeServiceFromBooking(bookingId, serviceId) {
        const booking = await this.repository.getById(bookingId);
        if (!booking) throw createError(404, 'Reserva no encontrada');

        const remainingServices = booking.services.filter(item => String(item.service) !== serviceId);

        if (remainingServices.length === booking.services.length) {
            throw createError(404, 'El servicio no está asociado a esta reserva');
        }

        await this.repository.update(bookingId, { services: remainingServices });
        return this.repository.getByIdPopulated(bookingId);
    }

    /*vacia los servicios d la reserva sin eliminarla*/
    async clearBookingServices(bookingId) {
        const booking = await this.repository.getById(bookingId);
        if (!booking) throw createError(404, 'Reserva no encontrada');

        await this.repository.update(bookingId, { services: [] });
        return this.repository.getByIdPopulated(bookingId);
    }

    async deleteBooking(bookingId) {
        const borrado = await this.repository.delete(bookingId);
        if (!borrado) throw createError(404, 'Reserva no encontrada');
        return borrado;
    }
}