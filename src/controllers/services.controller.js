import { ServicesService } from '../services/services.service.js';

const servicesService = new ServicesService();

const emitServicesUpdated = async req => {
    const io = req.app.get('io');
    if (!io) return;

    const servicios = await servicesService.getServices();
    io.emit('servicesUpdated', servicios);
};

export const getServices = async (req, res) => {
    const result = await servicesService.getPaginatedServices(req.validatedQuery);
    res.status(200).json({ status: 'success', ...result });
};

export const getServiceById = async (req, res) => {
    const servicio = await servicesService.getServiceById(req.params.sid);

    if (!servicio) {
        return res.status(404).json({ status: 'error', message: 'Servicio no encontrado' });
    }
    res.status(200).json({ status: 'success', payload: servicio });
};

export const createService = async (req, res) => {
    try {
        const newService = await servicesService.createService(req.body ?? {});
        await emitServicesUpdated(req);
        res.status(201).json({ status: 'success', payload: newService });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

export const updateService = async (req, res) => {
    const actualizado = await servicesService.updateService(req.params.sid, req.body ?? {});

    if (!actualizado) {
        return res.status(404).json({ status: 'error', message: 'Servicio no encontrado' });
    }
    await emitServicesUpdated(req);
    res.status(200).json({ status: 'success', payload: actualizado });
};

export const deleteService = async (req, res) => {
    const borrado = await servicesService.deleteService(req.params.sid);

    if (!borrado) {
        return res.status(404).json({ status: 'error', message: 'Servicio no encontrado' });
    }
    await emitServicesUpdated(req);
    res.status(200).json({ status: 'success', payload: borrado });
};