import { Router } from 'express';
import { ServiceManager } from '../managers/ServiceManager.js';

const router = Router();
const serviceManager = new ServiceManager();

/*router GET*/
router.get('/', (req, res) => {
    const { category, available } = req.query;
    const services = serviceManager.getServices({ category, available });
    res.status(200).json({ status: 'success', payload: services });
});

/*router GET por SID*/
router.get('/:sid', (req, res) => {
    const servicio = serviceManager.getServiceById(Number(req.params.sid));

    if (!servicio) {
        return res.status(404).json({ status: 'error', mensaje: 'Servicio no encontrado' });
    }
    res.status(200).json({ status: 'success', payload: servicio });
});

/*metodo POST*/
router.post('/', (req, res) => {

    try {
        const nuevoServicio = serviceManager.addService(req.body ?? {});
        res.status(201).json({ status: 'success', payload: nuevoServicio });
    } catch (error) {
        res.status(400).json({ status: 'error', mensaje: error.message });
    }
});

/*metodo PUT*/
router.put('/:sid', (req, res) => {
    const actualizado = serviceManager.updateService(Number(req.params.sid), req.body ?? {});

    if (!actualizado) {
        return res.status(404).json({ status: 'error', mensaje: 'Servicio no encontrado' });
    }
    res.status(200).json({ status: 'success', payload: updated });
});


/*metodo dDELETE*/
router.delete('/:sid', (req, res) => {
    const borrado = serviceManager.deleteService(Number(req.params.sid));

    if (!borrado) {
        return res.status(404).json({ status: 'error', mensaje: 'Servicio no encontrado' });
    }
    res.status(200).json({ status: 'success', payload: deleted });
});

export default router;