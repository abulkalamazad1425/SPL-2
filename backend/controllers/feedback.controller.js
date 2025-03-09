import Feedback from "../models/feedback.model.js";
import { errorHandler } from "../utils/error.js";

export const submitFeedback=async(req,res,next)=>{
    try{
      const { title, description } = req.body;
      const {studentId}=req.params;
      if (!title || !description) {
        return next(errorHandler(400,'title and description is required'));
      }
  
      const newFeedback = new Feedback({
        studentId,
        title,
        description
      });
  
      await newFeedback.save();
      res.status(201).json({ success: true, message: "Feedback submitted successfully!" });
    }catch(error){
      return next(error);
    }
  }

  export const getFeedbackList=async(req,res,next)=>{
    try{
      const feedbackList = await Feedback.find()
        .populate("studentId") // Populate student name & reg_no
        .sort({ createdAt: -1 });
      res.status(200).json({ 'feedbackList':feedbackList })
    }catch(error){
      return next(error);
    }
  }