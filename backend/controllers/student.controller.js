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
dotenv.config();
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASS;
const is_live = false 
function generateTransactionId() {
  return `TXN-${uuidv4()}`;  // Generate a UUID v4-based transaction ID
}
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }, 
});

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};
const sendOtpEmail = async (email, otp,next) => {
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
    const result = await Otp.deleteMany({ reg_no });
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
      reg_no,
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
    const otpRecord = await Otp.findOne({ reg_no,otp});
    if (!otpRecord) {
      return next(errorHandler(404,"otp not matched"));
    }
    if (new Date() > otpRecord.expiresAt) {
      return next(errorHandler(404,'OTP has expired. Please request a new OTP.'))
    }
    if (otp !== otpRecord.otp) {
        return next(errorHandler(400,"otp not matched")) ;
    }
    await Otp.deleteOne({ reg_no });
    const user=await Hall.findOne({reg_no});
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
//student registration
// hall database e name korte hbe
export const studentRegistration=async(req,res,next)=>{
    const{reg_no,email,phone,department,session,password,payment,name,hons_year}=req.body;
    let reg_payment='unpaid';
    if(payment==='online'){
      const{transactionId}=req.body;
      const paymentEntry= await StudentPayment.findOne({transactionId});
      if(!paymentEntry){
        console.log('payment entry not found')
        return next(errorHandler(400,'transaction id not matched'));
      }
      reg_payment='paid';
    }
    const hashedPassword=bcryptjs.hashSync(password,10);
    const newStudent=new Student({reg_no,email,phone,department,session,password:hashedPassword,reg_payment,name,hons_year});
    try{
      await newStudent.save();
      res.status(201).json("user created successfully");
    }catch(error){
      return next(error);
    }
}

export const log_in=async(req,res,next)=>{
  const{usertype}=req.body;
  if(usertype==="student"){
    const{reg_no,password}=req.body;
    try{
      const validUser=await Student.findOne({reg_no});
      if(!validUser){
          return next(errorHandler(404,'user not found'));
      }
      const validPassword=bcryptjs.compareSync(password,validUser.password);
      if(!validPassword){
          return next(errorHandler(401,'wrong credentials'));
      }
      const{password:pass,...rest}=validUser._doc;
      const updatedRest={...rest,usertype:usertype};
      console.log(updatedRest)
      const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET);
      res.cookie('access_token',token,{httpOnly:true}).status(200).json(updatedRest);
      }catch(error){
        return next(error)
      }
  }
  else{
    const{reg_no,password}=req.body;
    const username=reg_no;
    if(usertype==="manager"){
      try{
        const validUser=await Manager.findOne({username});
        if(!validUser){
            return next(errorHandler(404,'user not found'));
        }
        const validPassword=bcryptjs.compareSync(password,validUser.password);
        if(!validPassword){
            return next(errorHandler(401,'wrong credentials'));
        }
        const{password:pass,...rest}=validUser._doc;
        const updatedRest={...rest,usertype:usertype};
        console.log(updatedRest)
        const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET);
        res.cookie('access_token',token,{httpOnly:true}).status(200).json(updatedRest);
        }catch(error){
          return next(error)
       }
    }
    else if(usertype==='admin'){
      try{
        const validUser=await Teacher.findOne({username});
        if(!validUser){
            return next(errorHandler(404,'user not found'));
        }
        const validPassword=bcryptjs.compareSync(password,validUser.password);
        if(!validPassword){
            return next(errorHandler(401,'wrong credentials'));
        }
        const{password:pass,...rest}=validUser._doc;
        const updatedRest={...rest,usertype:usertype};
        console.log(updatedRest)
        const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET);
        res.cookie('access_token',token,{httpOnly:true}).status(200).json(updatedRest);
        }catch(error){
          return next(error)
        }
    }
  }
  
}

// export const reg_payment= async(req,res,next)=>{
//   const{reg_no,name,phone,email}=req.body;
//   try{
//     const registrationId=await Paymnet.findOne({paymentType:'registration'});
//     if(!registrationId){
//       return next(errorHandler(404,'registration fee is not updated by manager'));
//     }
//     const amount=registrationId.amount;
//     const transactionId=generateTransactionId();
//     const data = {
//       total_amount: amount,
//       currency: 'BDT',
//       tran_id: transactionId, // use unique tran_id for each api call
//       success_url: `http://localhost:3000/api/student/payment/success/${transactionId}`,
//       fail_url: 'http://localhost:3000/api/student/payment/fail',
//       cancel_url: 'http://localhost:3000/api/student/payment/cancel',
//       ipn_url: 'http://localhost:3000/api/student/payment/ipn',
//       shipping_method: 'Courier',
//       product_name: 'Computer.',
//       product_category: 'Electronic',
//       product_profile: 'general',
//       cus_name: name,
//       cus_email: email,
//       cus_add1: 'Dhaka',
//       cus_add2: 'Dhaka',
//       cus_city: 'Dhaka',
//       cus_state: 'Dhaka',
//       cus_postcode: '1000',
//       cus_country: 'Bangladesh',
//       cus_phone: phone,
//       cus_fax: '01711111111',
//       ship_name: name,
//       ship_add1: 'Dhaka',
//       ship_add2: 'Dhaka',
//       ship_city: 'Dhaka',
//       ship_state: 'Dhaka',
//       ship_postcode: 1000,
//       ship_country: 'Bangladesh',
//   };
//   const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
//   sslcz.init(data).then(apiResponse => {
//       // Redirect the user to payment gateway
//       let GatewayPageURL = apiResponse.GatewayPageURL
//       //res.redirect(GatewayPageURL)
//       res.json({'url':GatewayPageURL});
//   });
//   }catch(error){
//     return next(error);
//   }
// }

// export const paymentSuccess=async (req,res)=>{
//   console.log(req.params.tranId);
// }


export const getMealList=async(req,res,next)=>{
  const studentRef=req.params.studentId;
  const today = new Date();
  today.setHours(23,59,59,999); 
  try {
    const studentMeals = await StudentMeal.find({ studentRef })
      .populate({
        path: "mealRef",
        match: { date: { $gt: today } }, // Filter: Only future meals
      });

    // Remove null values (if mealRef is not populated due to filter)
    const filteredMeals = studentMeals.filter((studentMeal) => studentMeal.mealRef !== null);

    if (filteredMeals.length === 0) {
      return next(errorHandler(404, "No upcoming meals found for this student"));
    }

    // Formatting response
    const mealList = filteredMeals.map((studentMeal) => ({
      mealId: studentMeal.mealRef._id,
      date: studentMeal.mealRef.date,
      mealType: studentMeal.mealRef.mealtype,
      mealRate: studentMeal.mealRef.mealrate,
      mealStatus: studentMeal.mealStatus, // "on" or "off"
    }));

    res.status(200).json(mealList);

  } catch (error) {
    return next(error);
  }
}

export const updateMealStatus = async (req, res, next) => {
  const { student_id, meal_id } = req.query; // Get student_id and meal_id from query params

  try {
    const studentMeal = await StudentMeal.findOne({ studentRef: student_id, mealRef: meal_id });

    if (!studentMeal) {
      return next(errorHandler(404, "Meal entry not found for this student"));
    }

    // Toggle the meal status (off -> on, on -> off)
    studentMeal.mealStatus = studentMeal.mealStatus === "off" ? "on" : "off";

    await studentMeal.save();

    res.status(200).json({ 
      success: true, 
      message: "Meal status updated successfully", 
      mealStatus: studentMeal.mealStatus 
    });

  } catch (error) {
    return next(error);
  }
};


export const get_payment = async (req, res, next) => {
  const { studentId } = req.params;  // Extract studentId
  const today = new Date();
  today.setHours(23, 59, 59, 999);  // Set time to end of today

  try {
    const paymentList = await Payment.find({ paymentType: "mealPayment" });

    if (!paymentList || paymentList.length === 0) {
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

