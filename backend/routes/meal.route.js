import express from 'express';
import { getDailyMealList, getMealHistory, getMealList, updateMealSchedule, updateMealStatus, updateServedStatus } from '../controllers/meal.controller.js';
const router=express.Router();
router.post('/update_mealschedule',updateMealSchedule);
router.get('/get_daily_meal_list',getDailyMealList);//manager
router.post('/update_served_status/:mealId',updateServedStatus);
router.put('/update_mealstatus',updateMealStatus);
router.get('/meal_history/:studentId',getMealHistory);
router.get('/get_meallist/:studentId',getMealList);
export default router;