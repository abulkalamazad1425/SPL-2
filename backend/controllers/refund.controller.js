import Manager from "../models/manager.model.js";
import Refund from "../models/refund.model.js";
import Student from "../models/student.model.js";
import { errorHandler } from "../utils/error.js";

export const getRefundList=async(req,res,next)=>{
    try{
      const students = await Student.find({ balance: { $gt: 0 } });
      res.status(200).json({ success: true, students });
    }catch(error){
      return next(error);
    }
  }
  export const updateRefund=async(req,res,next)=>{
    try{
      const{studentId}=req.params;
      const {balance}=req.body;
      const student=await Student.findById(studentId);
      if(!student){
        return next(errorHandler(404,'student not found'));
      }
      const newRefund=new Refund({
        student:studentId,
        refundType:'mealRefund',
        amount:balance,
      });
      await newRefund.save();
      student.balance=0;
      const manager=await Manager.findOne();
      manager.balance-=balance;
      await manager.save();
      await student.save();
      res.status(200).json({ success: true, message: "Refund processed successfully" });
    }catch(error){
      return next(error);
    }
  }

  export const getRefundHistory=async(req,res,next)=>{
    try{
      const refunds = await Refund.find().populate("student"); // Adjust fields as needed
      if(!refunds){
        return next(errorHandler(404,'no entry in refund'));
      }
      res.status(200).json(refunds);
    }catch(error){
      return next(error);
    }
  }