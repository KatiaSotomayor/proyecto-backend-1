import fs from 'node:fs/promises';

const ARCHIVO_RUTA = new URL('../data/services.json', import.meta.url);

export class ServicesDao {
    async #readFile() {
        try {
            const data = await fs.readFile(ARCHIVO_RUTA, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') return [];
            throw error;
        }
    }

    async #saveFile(services) {
        await fs.writeFile(ARCHIVO_RUTA, JSON.stringify(services, null, 2));
    }

    async getAll() {
        return this.#readFile();
    }

    async getById(id) {
        const servicios = await this.#readFile();
        return servicios.find(service => service.id === id) ?? null;
    }

    async create(data) {
        const servicios = await this.#readFile();

        const newId = servicios.length > 0
            ? Math.max(...servicios.map(service => service.id)) + 1
            : 1;

        const newService = { ...data, id: newId };

        servicios.push(newService);
        await this.#saveFile(servicios);
        return newService;
    }

    async update(id, data) {
        const servicios = await this.#readFile();
        const index = servicios.findIndex(service => service.id === id);
        if (index === -1) return null;

        servicios[index] = { ...servicios[index], ...data };
        await this.#saveFile(servicios);
        return servicios[index];
    }

    async delete(id) {
        const servicios = await this.#readFile();
        const index = servicios.findIndex(service => service.id === id);
        if (index === -1) return null;

        const [servicioBorrado] = servicios.splice(index, 1);
        await this.#saveFile(servicios);
        return servicioBorrado;
    }
}