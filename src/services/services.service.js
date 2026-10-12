import { ServicesRepository } from '../repositories/services.repository.js';

const buildFilter = ({ category, available } = {}) => {
    const filtro = {};
    if (category) filtro.category = category;
    if (available !== undefined) filtro.available = available === 'true';
    return filtro;
};

export class ServicesService {
    constructor(repository = new ServicesRepository()) {
        this.repository = repository;
    }

    async getServices(filtros = {}) {
        return this.repository.getAll(buildFilter(filtros));
    }

    async getPaginatedServices({ category, available, page = 1, limit = 10, sortBy, order = 'asc' } = {}) {
        const filtro = buildFilter({ category, available });

        const sort = sortBy
            ? { [sortBy]: order === 'desc' ? -1 : 1, _id: 1 }
            : { _id: 1 };

        const skip = (page - 1) * limit;

        const [servicios, total] = await Promise.all([
            this.repository.getAll(filtro, { skip, limit, sort }),
            this.repository.count(filtro)
        ]);

        const totalPages = Math.max(Math.ceil(total / limit), 1);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;

        const buildLink = targetPage => {
            const params = new URLSearchParams();
            if (category) params.set('category', category);
            if (available !== undefined) params.set('available', available);
            if (sortBy) {
                params.set('sortBy', sortBy);
                params.set('order', order);
            }
            params.set('limit', limit);
            params.set('page', targetPage);
            return `/api/services?${params.toString()}`;
        };

        return {
            payload: servicios,
            total,
            page,
            limit,
            totalPages,
            hasPrevPage,
            hasNextPage,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
            prevLink: hasPrevPage ? buildLink(page - 1) : null,
            nextLink: hasNextPage ? buildLink(page + 1) : null
        };
    }

    async getServiceById(id) {
        return this.repository.getById(id);
    }

    async createService(serviceData) {
        return this.repository.create(serviceData);
    }

    async updateService(id, updatedData) {
        const { id: _ignoredId, _id: _ignoredMongoId, ...safeData } = updatedData;
        return this.repository.update(id, safeData);
    }

    async deleteService(id) {
        return this.repository.delete(id);
    }
}