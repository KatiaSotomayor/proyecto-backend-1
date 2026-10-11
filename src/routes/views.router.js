import { Router } from 'express';
import {
    renderServices,
    renderRealtimeServices,
    renderAvailability,
    renderBookingDetail
} from '../controllers/views.controller.js';

const router = Router();

router.get('/services', renderServices);
router.get('/realtime-services', renderRealtimeServices);
router.get('/availability', renderAvailability);
router.get('/bookings/:bid', renderBookingDetail);

export default router;