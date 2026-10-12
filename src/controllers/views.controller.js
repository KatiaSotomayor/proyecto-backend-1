import { ServicesService } from '../services/services.service.js';
import { BookingsService } from '../services/bookings.service.js';

const servicesService = new ServicesService();
const bookingsService = new BookingsService();

const formatDate = date => new Date(date).toLocaleDateString('es-AR', { timeZone: 'UTC' });


const buildOptions = (options, selected) =>
    options.map(([value, label]) => ({ value, label, selected: value === String(selected ?? '') }));

export const renderServices = async (req, res) => {
    const query = req.validatedQuery;
    const result = await servicesService.getPaginatedServices(query);

    const pageLink = page => `/services?${new URLSearchParams({ ...query, limit: result.limit, page })}`;

    res.render('services', {
        title: 'Estudios, karaoke y escenarios',
        ...result,
        services: result.payload,
        prevLink: result.hasPrevPage ? pageLink(result.prevPage) : null,
        nextLink: result.hasNextPage ? pageLink(result.nextPage) : null,
        category: query.category ?? '',
        availableOptions: buildOptions(
            [['', 'Todos'], ['true', 'Disponibles'], ['false', 'No disponibles']],
            query.available
        ),
        sortOptions: buildOptions(
            [['', 'Sin orden'], ['price', 'Precio'], ['duration', 'Duración'], ['name', 'Nombre']],
            query.sortBy
        ),
        orderOptions: buildOptions(
            [['asc', 'Ascendente'], ['desc', 'Descendente']],
            query.order ?? 'asc'
        ),
        limitOptions: buildOptions([['5', '5'], ['10', '10'], ['20', '20']], result.limit)
    });
};

export const renderRealtimeServices = async (req, res) => {
    const services = await servicesService.getServices();

    res.render('realtime-services', {
        title: 'Servicios en vivo',
        services
    });
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

export const renderBookings = async (req, res) => {
    const bookings = await bookingsService.getBookings();

    res.render('bookings', {
        title: 'Reservas',
        bookings: bookings.map(booking => ({ ...booking, fecha: formatDate(booking.date) }))
    });
};

export const renderBookingDetail = async (req, res) => {
    const booking = await bookingsService.getBookingById(req.params.bid);

    if (!booking) {
        return res.status(404).render('error', {
            title: 'Reserva no encontrada',
            message: 'La reserva que buscás no existe.'
        });
    }

    const availableServices = await servicesService.getServices({ available: 'true' });

    res.render('booking-detail', {
        title: 'Detalle de reserva',
        booking: { ...booking, fecha: formatDate(booking.date) },
        availableServices
    });
};
