import generateTransactionId from "../index.js";
import Expense from "../models/expense.model.js";
import Feedback from "../models/feedback.model.js";
import Manager from "../models/manager.model.js";
import Meal from "../models/meal.model.js";
import Notice from "../models/notice.model.js";
import Payment from "../models/payment.model.js";
import Refund from "../models/refund.model.js";
import Student from "../models/student.model.js";
import StudentMeal from "../models/studentMeal.js";
import StudentPayment from "../models/studentPayment.model.js";
import Survey from "../models/survey.model.js";
import SurveyResponse from "../models/surveyResponse.model.js";
import {errorHandler} from '../utils/error.js'


function formatDateToDDMMYY(date) {
  const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with 0 if necessary
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based, so add 1) and pad
  const year = String(date.getFullYear()).slice(-2); // Get the last two digits of the year

  return `${day}-${month}-${year}`;
}
function createReference(startdate,enddate){
  const start=new Date(startdate);
  const end=new Date(enddate);
  const startString=start.toDateString().split(' ').slice(1).join(' ');
  const endString=end.toDateString().split(' ').slice(1).join(' ');
  return startString+'-'+endString;
}
//nai may be
export const updatePayment=async(req,res,next)=>{
    const{month,section,amount,paymentType}=req.body;
    const payment=new Payment({month,section,amount,paymentType});
    try{
      await payment.save();
      res.status(201).json("payment updated successfully");
    }catch(error){
      return next(error);
    }
}
export const getLeaveStudent=async(req,res,next)=>{
  try{
    const studentsOnLeave = await Student.find({ leaveStatus: "applied" });
    
    if (!studentsOnLeave) {
      return next(errorHandler(404,'no student is applied for leave'));
    }
    res.status(200).json(studentsOnLeave);
  }catch(error){
    return next(error);
  }
}
export const removeStudent=async(req,res,next)=>{
  try{
    const {studentId}=req.params;
    const student=await Student.findById(studentId);
    if(!student){
      return next(errorHandler(404,'student not found'));
    }
    const refundRegistration=new Refund({
      student:studentId,
      refundType:'jamanatRefund',
      amount:student.registrationAmount,
    })
    const manager=await Manager.findOne();
    manager.jamanatBalance-=student.registrationAmount;
    await refundRegistration.save();
    if(student.balance>0){
      const refundCurrentBalance=new Refund({
        student:studentId,
        refundType:'mealRefund',
        amount:student.balance,
      });
      manager.balance-=student.balance;
      await refundCurrentBalance.save();
    }
    student.registrationAmount=0;
    student.reg_payment='unpaid';
    student.balance=0;
    student.leaveStatus='running';
    await manager.save();
    await student.save();
    res.status(200).json('delete successfull');
  }catch(error){
    return next(error);
  }
}
export const unpaidStudent=async(req,res,next)=>{
  try{
    const studentList=await Student.find({reg_payment:'unpaid'});
    if(!studentList){
      return next(errorHandler(404,'no student found'));
    }
    res.status(200).json(studentList);
  }catch(error){
    return next(error);
  }
}
export const getMealPayment=async(req,res,next)=>{
  try{
    const today = new Date();
    today.setHours(23,59,59,999); 
    const paymentList = await Payment.find({ paymentType: "mealPayment" });

    if (!paymentList) {
      return next(errorHandler(404, "No meal payments found"));
    }

    let upcomingPaymentList = [];

    for (const payment of paymentList) {
      const paymentDate = new Date(payment.ref.split('-')[0]); // Extract start date from ref

      if (paymentDate > today) {
          upcomingPaymentList.push(payment);
        }
      }
      res.status(200).json(upcomingPaymentList);
  }catch(error){
    return next(error);
  }
}
export const getRegFee=async(req,res,next)=>{
  try{
    const registration=await Payment.findOne({paymentType:'registration'}).sort({createdAt:-1});
    if(!registration){
      res.status(200).json({'fee':0});
    }
    else{
      res.status(200).json({'fee':registration.amount});
    }
  }catch(error){
    return next(error);
  }
}
export const updateRegFee=async(req,res,next)=>{
  try{
    const{fee}=req.body;
    if(fee<=0){
      return next(errorHandler(400,'enter the valid fee'))
    }
    const newFee=new Payment({
      ref:'registration',
      amount:fee,
      paymentType:'registration',
    })
    await newFee.save();
    res.status(200).json('registration fee updated successfully');
  }catch(error){
    return next(error);
  }
}
  