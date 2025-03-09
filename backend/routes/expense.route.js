import express from 'express';
import { getExpenses, getSingleExpense, uploadExpense } from '../controllers/expense.controller.js';
const router=express.Router();
router.post('/upload_expense',uploadExpense);
router.get('/get_all_expense',getExpenses);
router.get('/get_single_expense/:expenseId',getSingleExpense);
export default router;