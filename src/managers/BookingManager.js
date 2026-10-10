import fs from 'node:fs/promises';
import { ServiceManager } from './ServiceManager.js';

const ARCHIVO_RUTA = new URL('../data/bookings.json', import.meta.url);
const CAMPOS_REQUERIDOS = ['clientName', 'clientEmail', 'date', 'time'];
const VALIDAR_ESTADO = ['pending', 'confirmed', 'cancelled'];

/*error con HTTP code, responde status*/
const crearError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

export class BookingManager {
    /*validar que exista servicio*/
    constructor(serviceManager = new ServiceManager()) {
        this.serviceManager = serviceManager;
    }

    async readFile() {
        try {
            const data = await fs.readFile(ARCHIVO_RUTA, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') return [];
            throw error;
        }
    }

    async saveFile(bookings) {
        await fs.writeFile(ARCHIVO_RUTA, JSON.stringify(bookings, null, 2));
    }

    async createBooking(bookingData) {
        const missing = CAMPOS_REQUERIDOS.filter(
            field => bookingData[field] === undefined || bookingData[field] === null || bookingData[field] === ''
        );

        if (missing.length > 0) {
            throw crearError(400, `Faltan campos OBLIGATORIOS: ${missing.join(', ')}`);
        }

        const { clientName, clientEmail, date, time, status = 'pending' } = bookingData;

        if (!VALIDAR_ESTADO.includes(status)) {
            throw crearError(400, `Status inválido. Valores permitidos: ${VALIDAR_ESTADO.join(', ')}`);
        }

        const bookings = await this.readFile();

        const newId = bookings.length > 0
            ? Math.max(...bookings.map(booking => booking.id)) + 1
            : 1;


        const newBooking = { id: newId, clientName, clientEmail, date, time, status, services: [] };

        bookings.push(newBooking);
        await this.saveFile(bookings);
        return newBooking;
    }

    async getBookingById(id) {
        const bookings = await this.readFile();
        return bookings.find(booking => booking.id === id) ?? null;
    }

    async addServiceToBooking(bookingId, serviceId) {
        const bookings = await this.readFile();

        const booking = bookings.find(item => item.id === bookingId);
        if (!booking) throw crearError(404, 'Reserva no encontrada');

        const servicio = await this.serviceManager.getServiceById(serviceId);
        if (!servicio) throw crearError(404, 'Servicio no encontrado');

        /*ID del servicio guardado*/
        const existe = booking.services.find(item => item.service === serviceId);

        if (existe) {
            existe.quantity += 1;
        } else {
            booking.services.push({ service: serviceId, quantity: 1 });
        }

        await this.saveFile(bookings);
        return booking;
    }
}