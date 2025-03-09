import Survey from "../models/survey.model.js";
import SurveyResponse from "../models/surveyResponse.model.js";
import { errorHandler } from "../utils/error.js";

export const getSurveyResult=async(req,res,next)=>{
    try{
      const { surveyId } = req.params;
  
      // Check if the survey exists
      const survey = await Survey.findById(surveyId);
      if (!survey) {
        return next(errorHandler(404,'survey not found'));
      }
      const results = await SurveyResponse.aggregate([
        { $match: { surveyId: survey._id } }, // Match responses for the given survey
        { $unwind: "$responses" }, // Flatten responses array
        {
          $group: {
            _id: { question: "$responses.question", answer: "$responses.answer", answerType: "$responses.responseType" },
            count: { $sum: 1 } // Count occurrences
          }
        },
        {
          $group: {
            _id: "$_id.question",
            responses: { 
              $push: { answer: "$_id.answer", answerType: "$_id.answerType", count: "$count" } 
            }
          }
        },
        { $project: { _id: 0, question: "$_id", responses: 1 } },
      ]);
      console.log(results);
      res.status(200).json({'results':results});
    }catch(error){
      return next(error);
    }
  }
  export const uploadSurvey=async(req,res,next)=>{
    try {
      const { title, duration, questions } = req.body;
        const{usertype}=req.params;
      if (!title || !duration || !questions || questions.length === 0) {
        return next(errorHandler(400,'all fields are required'));
      }
  
      const newSurvey = new Survey({
        title,
        duration,
        questions,
        expiresAt:new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
        createdBy:usertype
      });
  
      await newSurvey.save();
      res.status(201).json({'survey':newSurvey});
    } catch (error) {
      return next(error);
    }
  }
  export const getSurvey=async(req,res,next)=>{
    try {
        const{usertype}=req.params;
        let surveys;
      const currentDate = new Date();
      if(usertype==='manager' || usertype==='admin'){
         surveys = await Survey.find({ expiresAt: { $gt: currentDate } ,createdBy:usertype}).sort({ createdAt: -1 });
      }
      else{
         surveys = await Survey.find({ expiresAt: { $gt: currentDate } }).sort({ createdAt: -1 });
      }
      res.status(200).json({'surveys':surveys});
    } catch (error) {
      return next(error);
    }
  }
  export const getSingleSurvey=async(req,res,next)=>{
    try{
      const{surveyId}=req.params;
      const survey=await Survey.findById(surveyId);
      if(!survey){
        return next(errorHandler(400,'survey not found'));
      }
      res.status(200).json({'survey':survey});
    }catch(error){
      return next(error);
    }
  }
  export const giveSurveyResponse=async(req,res,next)=>{
    try {
      const { surveyId, responses } = req.body;
      const {studentId}=req.params;
  
      // Validate survey existence
      const survey = await Survey.findById(surveyId);
      if (!survey) {
        return next(errorHandler(404,'survey not found'));
      }
  
      // Validate responses
      if (responses.length === 0) {
        return next(errorHandler(400,'response can not be empty'));
      }
  
      // Construct the response data
      const formattedResponses = Object.values(responses).map((resp, index) => {
        const question = survey.questions[index]?.question || "Unknown Question";
        return {
          question,
          responseType: survey.questions[index]?.type || "unknown",
          answer: resp,
        };
      });
  
      // Save response
      const newResponse = new SurveyResponse({
        surveyId,
        studentId,
        responses: formattedResponses,
      });
      await newResponse.save();
      res.status(201).json({ success: true, message: "Response submitted successfully" });
  
    } catch (error) {
      return next(error);
    }
  }