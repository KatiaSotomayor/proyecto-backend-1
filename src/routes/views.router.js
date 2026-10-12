import { Router } from 'express';
import {
    renderServices,
    renderRealtimeServices,
    renderAvailability,
    renderBookings,
    renderBookingDetail
} from '../controllers/views.controller.js';
import { validateQuery } from '../middlewares/validate.middleware.js';
import { listServicesQuerySchema } from '../validations/service.validation.js';

const router = Router();

router.get('/services', validateQuery(listServicesQuerySchema), renderServices);
router.get('/realtime-services', renderRealtimeServices);
router.get('/availability', renderAvailability);
router.get('/bookings', renderBookings);
router.get('/bookings/:bid', renderBookingDetail);

export default router;
