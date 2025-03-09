import express from 'express';
import { getFeedbackList, submitFeedback } from '../controllers/feedback.controller.js';
const router=express.Router();
router.post('/submit_feedback/:studentId',submitFeedback);
router.get('/get_feedback_list',getFeedbackList);
export default router;