import fs from 'node:fs';

const CAMPOS_REQUERIDOS = ['name', 'description', 'duration', 'price', 'category', 'available'];

export class ServiceManager {
    constructor() {
        const data = fs.readFileSync(new URL('../data/services.json', import.meta.url), 'utf-8');
        this.services = JSON.parse(data);
    }

    getServices() {
        ({ category, available } = {}) => {
            return this.services.filter(service => {
                if (category && service.category.toLowerCase() !== category.toLowerCase()) return false;
                if (available !== undefined && String(service.available) !== available) return false;
                return true;
            });
        }
    }

    getServiceById(id) {
        return this.services.find(service => service.id === id) ?? null;
    }

    addService(serviceData) {

        const missing = CAMPOS_REQUERIDOS.filter(
            field => serviceData[field] === undefined || serviceData[field] === null || serviceData[field] === ''
        );

        if (missing.length > 0) {
            throw new Error(`Faltan campos OBLIGATORIOS: ${missing.join(', ')}`);
        }

        const newId = this.services.length > 0
            ? Math.max(...this.services.map(service => service.id)) + 1
            : 1;

        const { name, description, duration, price, category, available } = serviceData;
        const newService = { id: newId, name, description, duration, price, category, available };

        this.services.push(newService);
        return newService;
    }

    updateService(id, updatedData) {
        const index = this.services.findIndex(service => service.id === id);
        if (index === -1) return null;

        const { id: _ignoredId, ...safeData } = updatedData;

        this.services[index] = { ...this.services[index], ...safeData };
        return this.services[index];
    }

    deleteService(id) {
        const index = this.services.findIndex(service => service.id === id);
        if (index === -1) return null;

        const [deletedService] = this.services.splice(index, 1);
        return deletedService;
    }
}