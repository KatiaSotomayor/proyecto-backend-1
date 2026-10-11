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

        return this.repository.update(bookingId, { services: updatedServices });
    }
}