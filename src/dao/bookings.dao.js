import fs from 'node:fs/promises';

const CAMPOS_REQUERIDOS = new URL('../data/bookings.json', import.meta.url);

export class BookingsDao {
    async #readFile() {
        try {
            const data = await fs.readFile(CAMPOS_REQUERIDOS, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') return [];
            throw error;
        }
    }

    async #saveFile(bookings) {
        await fs.writeFile(CAMPOS_REQUERIDOS, JSON.stringify(bookings, null, 2));
    }

    async create(data) {
        const bookings = await this.#readFile();

        const newId = bookings.length > 0
            ? Math.max(...bookings.map(booking => booking.id)) + 1
            : 1;

        const newBooking = { ...data, id: newId };

        bookings.push(newBooking);
        await this.#saveFile(bookings);
        return newBooking;
    }

    async getById(id) {
        const bookings = await this.#readFile();
        return bookings.find(booking => booking.id === id) ?? null;
    }

    async update(id, data) {
        const bookings = await this.#readFile();
        const index = bookings.findIndex(booking => booking.id === id);
        if (index === -1) return null;

        bookings[index] = { ...bookings[index], ...data };
        await this.#saveFile(bookings);
        return bookings[index];
    }
}