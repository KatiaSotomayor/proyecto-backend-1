import mongoose from 'mongoose';
import { ServiceModel } from './models/service.model.js';

const isValidId = id => mongoose.isObjectIdOrHexString(id);

export class ServicesDao {
    async getAll() {
        return ServiceModel.find().lean();
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
}