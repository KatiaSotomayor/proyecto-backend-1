import { BookingsRepository } from '../repositories/bookings.repository.js';
import { ServicesService } from './services.service.js';

const CAMPOS_REQUERIDOS = ['clientName', 'clientEmail', 'date', 'time'];
const VALIDAR_ESTADO = ['pending', 'confirmed', 'cancelled'];

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
        const missing = CAMPOS_REQUERIDOS.filter(
            field => bookingData[field] === undefined || bookingData[field] === null || bookingData[field] === ''
        );

        if (missing.length > 0) {
            throw createError(400, `Faltan campos OBLIGATORIOS: ${missing.join(', ')}`);
        }

        const { clientName, clientEmail, date, time, status = 'pending' } = bookingData;

        if (!VALIDAR_ESTADO.includes(status)) {
            throw createError(400, `Status inválido. Valores permitidos: ${VALIDAR_ESTADO.join(', ')}`);
        }

        return this.repository.create({ clientName, clientEmail, date, time, status, services: [] });
    }

    async getBookingById(id) {
        return this.repository.getById(id);
    }

    async addServiceToBooking(bookingId, serviceId) {
        const booking = await this.repository.getById(bookingId);
        if (!booking) throw createError(404, 'Reserva no encontrada');

        const servicio = await this.servicesService.getServiceById(serviceId);
        if (!servicio) throw createError(404, 'Servicio no encontrado');

        const alreadyAdded = booking.services.some(item => item.service === serviceId);

        const updatedServices = alreadyAdded
            ? booking.services.map(item =>
                item.service === serviceId ? { ...item, quantity: item.quantity + 1 } : item
              )
            : [...booking.services, { service: serviceId, quantity: 1 }];

        return this.repository.update(bookingId, { services: updatedServices });
    }
}