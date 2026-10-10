import { ServiceManager } from '../managers/ServiceManager.js';

const serviceManager = new ServiceManager();

export const getServices = async (req, res) => {
    const { category, available } = req.query;
    const services = await serviceManager.getServices({ category, available });
    res.status(200).json({ status: 'success', payload: services });
};

export const getServiceById = async (req, res) => {
    const servicio = await serviceManager.getServiceById(Number(req.params.sid));

    if (!servicio) {
        return res.status(404).json({ status: 'error', message: 'Servicio no encontrado' });
    }
    res.status(200).json({ status: 'success', payload: servicio });
};

export const createService = async (req, res) => {
    try {
        const nuevoServicio = await serviceManager.addService(req.body ?? {});
        res.status(201).json({ status: 'success', payload: nuevoServicio });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

export const updateService = async (req, res) => {
    const actualizado = await serviceManager.updateService(Number(req.params.sid), req.body ?? {});

    if (!actualizado) {
        return res.status(404).json({ status: 'error', message: 'Servicio no encontrado' });
    }
    res.status(200).json({ status: 'success', payload: actualizado });
};

export const deleteService = async (req, res) => {
    const borrado = await serviceManager.deleteService(Number(req.params.sid));

    if (!borrado) {
        return res.status(404).json({ status: 'error', message: 'Servicio no encontrado' });
    }
    res.status(200).json({ status: 'success', payload: borrado });
};