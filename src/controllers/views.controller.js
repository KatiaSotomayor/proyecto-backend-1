import { ServicesService } from '../services/services.service.js';

const servicesService = new ServicesService();

export const renderServices = async (req, res) => {
    const services = await servicesService.getServices();
    res.render('services', { title: 'Servicios', services });
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