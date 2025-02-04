import express from 'express';
import { updateMealSchedule, updatePayment } from '../controllers/manager.controller.js';
const router=express.Router();
router.post('/update_payment',updatePayment);
router.post('/update_mealschedule',updateMealSchedule);
export default router;