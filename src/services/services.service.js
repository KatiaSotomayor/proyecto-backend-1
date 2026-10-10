import { ServicesRepository } from '../repositories/services.repository.js';

const CAMPOS_REQUERIDOS = ['name', 'description', 'duration', 'price', 'category', 'available'];

export class ServicesService {
    constructor(repository = new ServicesRepository()) {
        this.repository = repository;
    }

    async getServices({ category, available } = {}) {
        const servicios = await this.repository.getAll();

        return servicios.filter(service => {
            if (category && service.category.toLowerCase() !== category.toLowerCase()) return false;
            if (available !== undefined && String(service.available) !== available) return false;
            return true;
        });
    }

    async getServiceById(id) {
        return this.repository.getById(id);
    }

    async createService(serviceData) {
        const missing = CAMPOS_REQUERIDOS.filter(
            field => serviceData[field] === undefined || serviceData[field] === null || serviceData[field] === ''
        );

        if (missing.length > 0) {
            throw new Error(`Faltan campos OBLIGATORIOS: ${missing.join(', ')}`);
        }

        const { name, description, duration, price, category, available } = serviceData;
        return this.repository.create({ name, description, duration, price, category, available });
    }

    async updateService(id, updatedData) {
        const { id: _ignoredId, _id: _ignoredMongoId, ...safeData } = updatedData;
        return this.repository.update(id, safeData);
    }

    async deleteService(id) {
        return this.repository.delete(id);
    }
}