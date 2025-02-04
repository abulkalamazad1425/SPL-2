import express from 'express';
import { get_payment, getMealList, log_in, reg_verification, studentRegistration, updateMealStatus, verifyOtp } from '../controllers/student.controller.js';
const router=express.Router();
router.post('/reg_verification',reg_verification);
router.post('/otp_verification',verifyOtp);
router.post('/registration',studentRegistration);
router.post('/login',log_in);
router.get('/get_meallist/:studentId',getMealList);
router.get('/get_payment/:studentId',get_payment);
router.put('/update_mealstatus',updateMealStatus);
// router.post('/reg_payment',reg_payment);
// router.post('/payment/success/:tranId',paymentSuccess);
export default router;