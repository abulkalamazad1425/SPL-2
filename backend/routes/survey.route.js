import express from 'express';
import { uploadSurvey ,getSurveyResult,getSurvey,getSingleSurvey,giveSurveyResponse} from '../controllers/survey.controller.js';
const router=express.Router();
router.post('/upload_survey/:usertype',uploadSurvey);
router.get('/get_survey_result/:surveyId',getSurveyResult);
router.get('/get_all_survey/:usertype',getSurvey);
router.get('/get_single_survey/:surveyId',getSingleSurvey);
router.post('/give_survey_response/:studentId',giveSurveyResponse);
export default router;