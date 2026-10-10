import fs from 'node:fs/promises';

const ARCHIVO_RUTA = new URL('../data/services.json', import.meta.url);
const CAMPOS_REQUERIDOS = ['name', 'description', 'duration', 'price', 'category', 'available'];

export class ServiceManager {

    /*lee el archivo y lo conviere en array, si no existe, arranca con []*/
    async readFile() {
        try {
            const data = await fs.readFile(ARCHIVO_RUTA, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') return [];
            throw error;
        }
    }

    /*para guardar array*/
    async saveFile(services) {
        await fs.writeFile(ARCHIVO_RUTA, JSON.stringify(services, null, 2));
    }

    async getServices({ category, available } = {}) {
        const services = await this.readFile();

        return services.filter(service => {
            if (category && service.category.toLowerCase() !== category.toLowerCase()) return false;
            if (available !== undefined && String(service.available) !== available) return false;
            return true;
        });
    }

    async getServiceById(id) {
        const services = await this.readFile();
        return services.find(service => service.id === id) ?? null;
    }

    async addService(serviceData) {
        const missing = CAMPOS_REQUERIDOS.filter(
            field => serviceData[field] === undefined || serviceData[field] === null || serviceData[field] === ''
        );

        if (missing.length > 0) {
            throw new Error(`Faltan campos obligatorios: ${missing.join(', ')}`);
        }

        const services = await this.readFile();
        const newId = services.length > 0
            ? Math.max(...services.map(service => service.id)) + 1
            : 1;

        const { name, description, duration, price, category, available } = serviceData;
        const newService = { id: newId, name, description, duration, price, category, available };

        services.push(newService);
        await this.saveFile(services);
        return newService;
    }

    async updateService(id, updatedData) {
        const services = await this.readFile();
        const index = services.findIndex(service => service.id === id);
        if (index === -1) return null;

        const { id: _ignoredId, ...safeData } = updatedData;

        services[index] = { ...services[index], ...safeData };
        await this.saveFile(services);
        return services[index];
    }

    async deleteService(id) {
        const services = await this.readFile();
        const index = services.findIndex(service => service.id === id);
        if (index === -1) return null;

        const [deletedService] = services.splice(index, 1);
        await this.saveFile(services);
        return deletedService;
    }
}