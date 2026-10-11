import { Router } from 'express';
import {
    createBooking,
    getBookings,
    getBookingById,
    addServiceToBooking,
    updateServiceQuantity,
    removeServiceFromBooking,
    clearBookingServices,
    deleteBooking
} from '../controllers/bookings.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import {
    createBookingSchema,
    addServiceToBookingSchema,
    updateQuantitySchema
} from '../validations/booking.validation.js';

const router = Router();

router.post('/', validateBody(createBookingSchema), createBooking);
router.get('/', getBookings);
router.get('/:bid', getBookingById);

router.post('/:bid/services/:sid', validateBody(addServiceToBookingSchema), addServiceToBooking);
router.put('/:bid/services/:sid', validateBody(updateQuantitySchema), updateServiceQuantity);
router.delete('/:bid/services/:sid', removeServiceFromBooking);

router.delete('/:bid/services', clearBookingServices);
router.delete('/:bid', deleteBooking);

export default router;