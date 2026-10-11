import mongoose from 'mongoose';
import { BookingModel } from './models/booking.model.js';

const isValidId = id => mongoose.isObjectIdOrHexString(id);

export class BookingsDao {
    async getAll() {
        return BookingModel.find().sort({ createdAt: -1 }).populate('services.service').lean();
    }

    async create(data) {
        const created = await BookingModel.create(data);
        return created.toObject();
    }

    async getById(id) {
        if (!isValidId(id)) return null;
        return BookingModel.findById(id).lean();
    }

    async getByIdPopulated(id) {
        if (!isValidId(id)) return null;
        return BookingModel.findById(id).populate('services.service').lean();
    }

    async update(id, data) {
        if (!isValidId(id)) return null;
        return BookingModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    }

    async delete(id) {
        if (!isValidId(id)) return null;
        return BookingModel.findByIdAndDelete(id).lean();
    }
}