import nodemailer from 'nodemailer';
import Hall from '../models/hall.model.js';
import Otp from '../models/otp.model.js';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import Student from '../models/student.model.js';
import jwt from 'jsonwebtoken';
import Payment from '../models/payment.model.js';
import StudentPayment from '../models/studentPayment.model.js';
import Manager from '../models/manager.model.js';
import Teacher from '../models/teacher.model.js';
import StudentMeal from '../models/studentMeal.js';
import generateTransactionId from '../index.js';
import SSLCommerzPayment from 'sslcommerz-lts';
import Meal from '../models/meal.model.js';
import Survey from '../models/survey.model.js';
import SurveyResponse from '../models/surveyResponse.model.js';
import Feedback from '../models/feedback.model.js';
dotenv.config();
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASS;
const is_live = false 

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }, 
});

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};
export const sendOtpEmail = async (email, otp,next) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}`,
    html: `<b>Your OTP is: ${otp}</b>`,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    return next(error);
  }
};
export const reg_verification = async (req, res,next) => {
  const { reg_no } = req.body;

  try {
    const result = await Otp.deleteMany({ identifier:reg_no });
    const hallRecord = await Hall.findOne({ reg_no });
    if (!hallRecord) {
      return next(errorHandler(404,'you are not a student of shahidullah hall'))
    }
    const email = hallRecord.email;
    const otp = generateOtp(); 
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 
    const otpRecord = new Otp({
      otp,
      email,
      identifier:reg_no,
      expiresAt,
    });
    await otpRecord.save();
    await sendOtpEmail(email, otp);
    return res.status(200).json({ message: `an otp is sent to ${email}` });

  } catch (error) {
    return next(error);
  }
};

export const verifyOtp = async (req, res,next) => {
  const { reg_no, otp } = req.body; 
  try {
    const otpRecord = await Otp.findOne({identifier: reg_no,otp:otp});
    if (!otpRecord) {
      return next(errorHandler(404,"otp not matched"));
    }
    if (new Date() > otpRecord.expiresAt) {
      return next(errorHandler(404,'OTP has expired. Please request a new OTP.'))
    }
    if (otp !== otpRecord.otp) {
        return next(errorHandler(400,"otp not matched")) ;
    }
    await Otp.deleteOne({identifier: reg_no });
    const user=await Hall.findOne({reg_no});
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getHallInformation=async(req,res,next)=>{
  try{
    const {hallId}=req.params;
    const hallStudent=await Hall.findById(hallId);
    if(!hallStudent){
      return next(errorHandler(404,'hall student not found'));
    }
    res.status(200).json(hallStudent);
  }catch(error){
    return next(error);
  }
}
//student registration
// hall database e name korte hbe
export const studentRegistration=async(req,res,next)=>{
    try{
      const{reg_no,email,phone,department,session,password,name,hons_year}=req.body;
      const hashedPassword=bcryptjs.hashSync(password,10);
      const payment=await Payment.findOne({paymentType:'registration'}).sort({createdAt:-1});
      const message=`you have to pay ${payment.amount} for registration`;
      const newStudent=new Student({reg_no,email,phone,department,session,password:hashedPassword,name,hons_year});
      await newStudent.save();
      const student=await Student.findOne({reg_no});
      res.status(201).json({'message':message,payment,student});
    }catch(error){
      return next(error);
    }
}



//double may be
export const get_payment = async (req, res, next) => {
  const { studentId } = req.params;  // Extract studentId
  const today = new Date();
  today.setHours(23,59,59,999);  // Set time to end of today

  try {
    const paymentList = await Payment.find({ paymentType: "mealPayment" });
    const student=await Student.findById(studentId);
    if(!student){
      return next(errorHandler(404,'student not found'));
    }
    if(student.reg_payment==='unpaid' || student.leaveStatus==='applied'){
      return next(errorHandler(400,'leave applied or registration fee is unpaid'));
    }
    if (!paymentList) {
      return next(errorHandler(404, "No meal payments found"));
    }

    let upcomingPaymentList = [];

    for (const payment of paymentList) {
      const paymentDate = new Date(payment.ref.split('-')[0]); // Extract start date from ref

      if (paymentDate > today) { // Only future payments
        const paidStudent = await StudentPayment.findOne({
          studentRef: studentId,
          paymentRef: payment._id
        });

        if (!paidStudent) { // If payment is not done
          upcomingPaymentList.push(payment);
        }
      }
    }
    return res.status(200).json(upcomingPaymentList);
  } catch (error) {
    return next(error);
  }
};
export const makeMealPayment=async(req,res,next)=>{
  const{paymentId,studentId}=req.query;
  try{
    const findPayment= await Payment.findOne({_id:paymentId});
    const findStudent= await Student.findOne({_id:studentId});
    if(!findPayment){
      return next(errorHandler(404,'payment not found'));
    }
    const amount=findPayment.amount;
    const transactionId=generateTransactionId();
    const data = {
      total_amount: amount,
      currency: 'BDT',
      tran_id: transactionId, // use unique tran_id for each api call
      success_url: `http://localhost:3000/api/student/payment_success?studentId=${studentId}&paymentId=${paymentId}&transactionId=${transactionId}`,
      fail_url: 'http://localhost:3000/api/payment/fail',
      cancel_url: 'http://localhost:3000/api/payment/cancel',
      ipn_url: 'http://localhost:3000/api/payment/ipn',
      shipping_method: 'Courier',
      product_name: 'Computer.',
      product_category: 'Electronic',
      product_profile: 'general',
      cus_name: findStudent.name,
      cus_email: findStudent.email,
      cus_add1: 'Dhaka',
      cus_add2: 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: findStudent.phone,
      cus_fax: '01711111111',
      ship_name: findStudent.name,
      ship_add1: 'Dhaka',
      ship_add2: 'Dhaka',
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: 1000,
      ship_country: 'Bangladesh',
  };
  const sslcz = new SSLCommerzPayment(process.env.STORE_ID,process.env.STORE_PASS,false);
  sslcz.init(data).then(apiResponse => {
    
      // Redirect the user to payment gateway
      let GatewayPageURL = apiResponse.GatewayPageURL
      //res.redirect(GatewayPageURL)
      res.json({'url':GatewayPageURL});
  });
  }catch(error){
    return next(error);
  }
}
export const paymentSuccess=async(req,res,next)=>{
  const{paymentId,transactionId,studentId}=req.query;
  const currentDate = new Date();
  try{
    const newPayment=new StudentPayment({
      paymentRef:paymentId,
      studentRef:studentId,
      transactionId:transactionId,
      date:currentDate,
    });
  await newPayment.save();
  const paymentDetails=await Payment.findOne({_id:paymentId});
  const startDate=new Date(paymentDetails.ref.split('-')[0]);
  const endDate=new Date(paymentDetails.ref.split('-')[1]);
  endDate.setHours(23,59,59,999);
  const mealList = await Meal.find({ date: { $gte:startDate, $lte:endDate } });
  mealList.forEach(async (meal)=>{
    const newStudentMeal=new StudentMeal({studentRef:studentId,mealRef:meal._id,mealStatus:'on'});
    if(!newStudentMeal){
      return next(errorHandler(401,'problem creating in student meal'));
    }
    await newStudentMeal.save();
  })
  const manager=await Manager.findOne();
  manager.balance+=paymentDetails.amount;
  await manager.save();
  res.redirect(`http://localhost:5173/update_mealstatus`);
  }catch(error){
    return next(error);
  }
}
export const getPaymentHistory=async(req,res,next)=>{
  try{
    const { studentId } = req.params;
    const paymentHistory = await StudentPayment.find({ studentRef: studentId })
      .populate("paymentRef") // Populate payment details
      .sort({ date: -1 }); // Sort by latest payments
    if (!paymentHistory || paymentHistory.length === 0) {
      return res.status(404).json({ success: false, message: "No payment history found for this student." });
    }

    res.status(200).json({ success: true, paymentHistory });
  }catch(error){
    return next(error);
  }
}
export const getMealHistory=async(req,res,next)=>{
  try{
    const { studentId } = req.params;
    
    let mealHistory = await StudentMeal.find({ studentRef: studentId })
      .populate("mealRef") // Populate meal details
      .sort({ createdAt: -1 }); // Sort by latest meals initially

    if (!mealHistory || mealHistory.length === 0) {
      return res.status(404).json({ success: false, message: "No meal history found for this student." });
    }

    // Custom sorting: First by date, then by mealType (lunch before dinner)
    mealHistory.sort((a, b) => {
      const dateA = new Date(a.mealRef.date);
      const dateB = new Date(b.mealRef.date);
      
      if (dateA - dateB !== 0) {
        return dateA - dateB; // Sort by date first (earliest to latest)
      }
      
      // If same date, prioritize lunch before dinner
      return a.mealRef.mealType === "lunch" ? -1 : 1;
    });

    res.status(200).json({ success: true, mealHistory });
  }catch(error){
    return next(error);
  }
}
export const applyLeave=async(req,res,next)=>{
  try{
    const{studentId}=req.params;
    const student=await Student.findById(studentId);
    if(!student){
      return next(errorHandler(404,'student not found'));
    }
    student.leaveStatus='applied';
    await student.save();
    res.status(200).json('apply leave successfull');
  }catch(error){
    return next(error);
  }
}
export const payRegistrationFee=async(req,res,next)=>{
  try{
    const{studentId}=req.query;
    let paymentId=req.query.paymentId;
    console.log(studentId,paymentId);
    if(paymentId==='registration'){
      const getPaymentId=await Payment.findOne({paymentType:'registration'}).sort({createdAt:-1});
      paymentId=getPaymentId._id;
    }
    const findPayment= await Payment.findOne({_id:paymentId});
    const findStudent= await Student.findOne({_id:studentId});
    if(!findPayment){
      return next(errorHandler(404,'payment not found'));
    }
    const amount=findPayment.amount;
    const transactionId=generateTransactionId();
    const data = {
      total_amount: amount,
      currency: 'BDT',
      tran_id: transactionId, // use unique tran_id for each api call
      success_url: `http://localhost:3000/api/student/registration_success?studentId=${studentId}&paymentId=${paymentId}&transactionId=${transactionId}`,
      fail_url: 'http://localhost:3000/api/payment/fail',
      cancel_url: 'http://localhost:3000/api/payment/cancel',
      ipn_url: 'http://localhost:3000/api/payment/ipn',
      shipping_method: 'Courier',
      product_name: 'Computer.',
      product_category: 'Electronic',
      product_profile: 'general',
      cus_name: findStudent.name,
      cus_email: findStudent.email,
      cus_add1: 'Dhaka',
      cus_add2: 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: findStudent.phone,
      cus_fax: '01711111111',
      ship_name: findStudent.name,
      ship_add1: 'Dhaka',
      ship_add2: 'Dhaka',
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: 1000,
      ship_country: 'Bangladesh',
  };
  const sslcz = new SSLCommerzPayment(process.env.STORE_ID,process.env.STORE_PASS,false);
  sslcz.init(data).then(apiResponse => {
    
      // Redirect the user to payment gateway
      let GatewayPageURL = apiResponse.GatewayPageURL
      //res.redirect(GatewayPageURL)
      console.log(GatewayPageURL);
      res.json({'url':GatewayPageURL});
  });
  }catch(error){
    return next(error);
  }
}
export const registrationSuccess=async(req,res,next)=>{
  try{
    const{paymentId,transactionId,studentId}=req.query;
    const student=await Student.findById(studentId);
    const payment=await Payment.findById(paymentId);
    const currentDate = new Date();
    const newPayment=new StudentPayment({
      paymentRef:paymentId,
      studentRef:studentId,
      transactionId:transactionId,
      date:currentDate,
    });
  student.reg_payment='paid';
  student.registrationAmount=payment.amount;
  student.leaveStatus='running';
  const manager=await Manager.findOne();
  manager.jamanatBalance+=payment.amount;
  await newPayment.save();
  await student.save();
  await manager.save();
  res.redirect(`http://localhost:5173/login`);
  }catch(error){
    return next(error);
  }
}
export const getLeaveRefund=async(req,res,next)=>{
  try{
    const{studentId}=req.params;
    const student=await Student.findById(studentId);
    if(!student){
      return next(errorHandler(404,'student not found'));
    }
    const refundAmount=student.registrationAmount+student.balance;
    res.status(200).json(refundAmount);
  }catch(error){
    return next(error);
  }
}


