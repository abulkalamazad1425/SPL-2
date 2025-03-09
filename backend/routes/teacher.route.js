import express from 'express';
import { addManager, getManagerDetails, removeManager } from '../controllers/teacher.controller.js';
const router=express.Router();
router.post('/add_manager',addManager);
router.get('/manager_details',getManagerDetails);
router.delete('/remove_manager/:managerId',removeManager);
export default router;