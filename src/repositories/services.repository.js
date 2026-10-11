import { ServicesDao } from '../dao/services.dao.js';

export class ServicesRepository {
    constructor(dao = new ServicesDao()) {
        this.dao = dao;
    }

    getAll(filter, options) {
        return this.dao.getAll(filter, options);
    }

    getById(id) {
        return this.dao.getById(id);
    }

    create(data) {
        return this.dao.create(data);
    }

    update(id, data) {
        return this.dao.update(id, data);
    }

    delete(id) {
        return this.dao.delete(id);
    }

    count(filter) {
        return this.dao.count(filter);
    }
}