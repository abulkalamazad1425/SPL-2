import express from 'express';
import { getLeaveStudent, getMealPayment, getRegFee, removeStudent, unpaidStudent, updatePayment,updateRegFee} from '../controllers/manager.controller.js';

const router=express.Router();
router.post('/update_payment',updatePayment);
router.get('/leave_application',getLeaveStudent);
router.get('/remove_student/:studentId',removeStudent);
router.get('/unpaid_student',unpaidStudent);
router.get('/get_meal_payment',getMealPayment);
router.get('/get_registration_fee',getRegFee);
router.post('/update_registration_fee',updateRegFee);
export default router;