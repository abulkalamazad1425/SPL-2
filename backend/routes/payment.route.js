import express from 'express';
import { allTransaction, updateMealPayment, updatePaymentStatus } from '../controllers/payment.controller.js';
const router=express.Router();
router.get('/update_payment_status/:studentId',updatePaymentStatus);
router.post('/update_meal_payment/:paymentId',updateMealPayment);
router.get('/all_transaction',allTransaction);
export default router;