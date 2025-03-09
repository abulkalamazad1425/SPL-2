import express from 'express';
import { getRefundHistory, getRefundList, updateRefund } from '../controllers/refund.controller.js';
const router=express.Router();
router.get('/get_refund_list',getRefundList);
router.post('/update_refund/:studentId',updateRefund);
router.get('/refund_history',getRefundHistory);
export default router;