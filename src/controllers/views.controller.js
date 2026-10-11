import { ServicesService } from '../services/services.service.js';
import { BookingsService } from '../services/bookings.service.js';

const servicesService = new ServicesService();
const bookingsService = new BookingsService();

export const renderServices = async (req, res) => {
    const servicios = await servicesService.getServices();
    res.render('services', { title: 'Servicios', services: servicios });
};

export const renderRealtimeServices = async (req, res) => {
    const servicios = await servicesService.getServices();
    res.render('services', { title: 'Servicios en tiempo real', services: servicios, realtime: true });
};

export const renderAvailability = async (req, res) => {
    const [availableServices, unavailableServices] = await Promise.all([
        servicesService.getServices({ available: 'true' }),
        servicesService.getServices({ available: 'false' })
    ]);

    res.render('availability', {
        title: 'Disponibilidad de servicios',
        availableServices,
        unavailableServices
    });
};

export const renderBookingDetail = async (req, res) => {
    const booking = await bookingsService.getBookingById(req.params.bid);

    if (!booking) {
        return res.status(404).render('error', {
            title: 'No encontrada',
            message: 'La reserva que buscás no existe.'
        });
    }
    res.render('booking-detail', { title: 'Detalle de reserva', booking });
};