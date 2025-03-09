import Manager from "../models/manager.model.js";
import Payment from "../models/payment.model.js";
import Student from "../models/student.model.js";
import StudentPayment from "../models/studentPayment.model.js";
import generateTransactionId from "../index.js";
import Meal from "../models/meal.model.js";
import StudentMeal from "../models/studentMeal.js";
import { errorHandler } from "../utils/error.js";

export const updatePaymentStatus=async(req,res,next)=>{
    try{
      const {studentId}=req.params;
      const student=await Student.findById(studentId);
      if(!student){
        return next(errorHandler(404,'student not found'));
      }
      const registrationId=await Payment.findOne({paymentType:'registration'}).sort({createdAt:-1});
      if(!registrationId){
        return next(errorHandler(404,'registration fee not found'));
      }
      const newPayment=await StudentPayment({
        studentRef:student._id,
        paymentRef:registrationId._id,
        transactionId:'offline-'+generateTransactionId().split('-')[1]
      });
      await newPayment.save();
      student.registrationAmount=registrationId.amount;
      student.reg_payment='paid';
      const manager=await Manager.findOne();
      manager.jamanatBalance+=registrationId.amount;
      await manager.save();
      await student.save();
      res.status(200).json('registration status updated successfully');
    }catch(error){
      return next(error);
    }
  }
  export const allTransaction=async(req,res,next)=>{
    try{
      const transactions = await StudentPayment.find()
        .populate("studentRef") // Populate student details
        .populate("paymentRef",) // Populate payment details
        .sort({ date: -1 }); // Sort by latest transactions
  
      if (!transactions) {
        return next(errorHandler(404,'no transaction found'));
      }
  
      res.status(200).json(transactions);
    }catch(error){
      return next(error);
    }
  }
  export const updateMealPayment=async(req,res,next)=>{
    try{
      const{reg_no}=req.body;
      console.log(reg_no)
      const{paymentId}=req.params;
      const student=await Student.findOne({reg_no:reg_no});
      console.log(paymentId)
      if(!student){
        return next(errorHandler(404,'student not found'));
      }
      if(student.reg_payment==='unpaid'){
        return next(errorHandler(400,'you have to pay registration fee'));
      }
      console.log(reg_no)
      const paymentDetails=await Payment.findById(paymentId);
      if(!paymentDetails){
        console.log('error in payment details');
        return next(errorHandler(404,'payment details not found'));
      }
      const newPayment=new StudentPayment({
        studentRef:student._id,
        paymentRef:paymentDetails._id,
        transactionId:'offline'+generateTransactionId().split('-')[1]
      });
      await newPayment.save();
      const startDate=new Date(paymentDetails.ref.split('-')[0]);
      const endDate=new Date(paymentDetails.ref.split('-')[1]);
      endDate.setHours(23,59,59,999);
      const mealList = await Meal.find({ date: { $gte:startDate, $lte:endDate } });
      mealList.forEach(async (meal)=>{
        const newStudentMeal=new StudentMeal({studentRef:student._id,mealRef:meal._id,mealStatus:'on'});
        if(!newStudentMeal){
          console.log('error is studentmeal')
          return next(errorHandler(401,'problem creating in student meal'));
        }
        await newStudentMeal.save();
      })
      const manager=await Manager.findOne();
      manager.balance+=paymentDetails.amount;
      await manager.save();
      res.status(200).json('payment updated successfully');
    }catch(error){
      console.log(error.message);
      return next(error);
    }
  }