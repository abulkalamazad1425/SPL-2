import express from 'express';
import { addManager } from '../controllers/teacher.controller.js';
const router=express.Router();
router.post('/add_manager',addManager);
export default router;