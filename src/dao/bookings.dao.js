import mongoose from 'mongoose';
import { BookingModel } from './models/booking.model.js';

const isValidId = id => mongoose.isObjectIdOrHexString(id);

export class BookingsDao {
    async create(data) {
        const created = await BookingModel.create(data);
        return created.toObject();
    }

    async getById(id) {
        if (!isValidId(id)) return null;
        return BookingModel.findById(id).lean();
    }

    async update(id, data) {
        if (!isValidId(id)) return null;
        return BookingModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    }
}