import { Router } from 'express';
import {
    createBooking,
    getBookingById,
    addServiceToBooking
} from '../controllers/bookings.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createBookingSchema, addServiceToBookingSchema } from '../validations/booking.validation.js';

const router = Router();

router.post('/', validateBody(createBookingSchema), createBooking);
router.get('/:bid', getBookingById);
router.post('/:bid/services/:sid', validateBody(addServiceToBookingSchema), addServiceToBooking);

export default router;