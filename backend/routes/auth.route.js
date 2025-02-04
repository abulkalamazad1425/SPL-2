import express from 'express';
import { addTeacher, reset_password } from '../controllers/auth.controller.js';
const router=express.Router();
router.post('/reset_password',reset_password);
router.post('/add_teacher',addTeacher);
export default router;