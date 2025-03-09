import Notice from "../models/notice.model.js";
import { errorHandler } from "../utils/error.js";

export const uploadNotice=async(req,res,next)=>{
    try {
      const { title, description } = req.body;
  
      if (!title || !description) {
        return next(errorHandler(400,"notice title and description is required"));
      }
  
      const newNotice = new Notice({
        title,
        description,
        pdfFile: req.file ? req.file.path : null, // Save file path if provided, otherwise null
      });
      await newNotice.save();
      res.status(201).json('notice created successfully');
    } catch (error) {
      return next(error);
    }
  }
  export const getAllNotice=async(req,res,next)=>{
    try{
        const noticeList=await Notice.find().sort({ createdAt: -1 });
        if(!noticeList){
            return next(errorHandler(400,'notice not found'));
        }
        res.status(200).json({'notices':noticeList});
    }catch(error){
        return next(error);
    }
}
export const getSingleNotice=async(req,res,next)=>{
    const{noticeId}=req.params;
    try{
        const notice= await Notice.findById(noticeId);
        if(!notice){
            console.log('hello');
            return next(errorHandler(400,'notice not found'));
        }
        res.status(200).json({'notice':notice});
    }catch(error){
        return next(error);
    }
}