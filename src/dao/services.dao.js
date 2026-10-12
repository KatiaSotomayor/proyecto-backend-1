import mongoose from 'mongoose';
import { ServiceModel } from './models/service.model.js';

const isValidId = id => mongoose.isObjectIdOrHexString(id);
const COLLATION = { locale: 'es', strength: 2 };

export class ServicesDao {
    async getAll(filter = {}, { skip = 0, limit = 0, sort = {} } = {}) {
        return ServiceModel.find(filter).collation(COLLATION).sort(sort).skip(skip).limit(limit).lean();
    }

    async getById(id) {
        if (!isValidId(id)) return null;
        return ServiceModel.findById(id).lean();
    }

    async create(data) {
        const created = await ServiceModel.create(data);
        return created.toObject();
    }

    async update(id, data) {
        if (!isValidId(id)) return null;
        return ServiceModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    }

    async delete(id) {
        if (!isValidId(id)) return null;
        return ServiceModel.findByIdAndDelete(id).lean();
    }

    async count(filter = {}) {
        return ServiceModel.countDocuments(filter).collation(COLLATION);
    }

    async getCategories() {
        return ServiceModel.distinct('category');
    }
}