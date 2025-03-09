import express from 'express';
import { getAllNotice, getSingleNotice, uploadNotice } from '../controllers/notice.controller.js';
import { upload } from '../utils/multer.js';
const router=express.Router();
router.get('/get_all_notice',getAllNotice);
router.get('/get_single_notice/:noticeId',getSingleNotice);
router.post('/upload_notice',upload.single('pdf'),uploadNotice);
export default router;