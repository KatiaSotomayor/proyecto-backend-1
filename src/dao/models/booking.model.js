import mongoose from 'mongoose';

const bookingServiceSchema = new mongoose.Schema(
    {
        service: { type: mongoose.Schema.Types.ObjectId, ref: 'services', required: true },
        quantity: { type: Number, default: 1, min: 1 }
    },
    { _id: false }
);

const bookingSchema = new mongoose.Schema(
    {
        clientName: { type: String, required: true, trim: true },
        clientEmail: { type: String, required: true, trim: true, lowercase: true },
        date: { type: Date, required: true },
        time: { type: String, required: true, trim: true },
        status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
        services: { type: [bookingServiceSchema], default: [] }
    },
    { timestamps: true }
);

export const BookingModel = mongoose.model('bookings', bookingSchema);