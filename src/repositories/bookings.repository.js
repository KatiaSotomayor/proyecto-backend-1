import { BookingsDao } from '../dao/bookings.dao.js';

export class BookingsRepository {
    constructor(dao = new BookingsDao()) {
        this.dao = dao;
    }

    getAll() {
        return this.dao.getAll();
    }

    create(data) {
        return this.dao.create(data);
    }

    getById(id) {
        return this.dao.getById(id);
    }

    getByIdPopulated(id) {
        return this.dao.getByIdPopulated(id);
    }

    update(id, data) {
        return this.dao.update(id, data);
    }

    delete(id) {
        return this.dao.delete(id);
    }
}