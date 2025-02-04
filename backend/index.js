import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import studentRouter from './routes/student.route.js';
import authRouter from './routes/auth.route.js';
import managaerRouter from './routes/manager.route.js';
import teacherRouter from './routes/teacher.route.js'
import Payment from './models/payment.model.js';
import {v4 as uuidv4} from 'uuid';
import SSLCommerzPayment from 'sslcommerz-lts';
import Student from './models/student.model.js';
import { errorHandler } from './utils/error.js';
import StudentPayment from './models/studentPayment.model.js';
import Hall from './models/hall.model.js';
dotenv.config();
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASS;
const is_live = false 
function generateTransactionId() {
  return `TXN-${uuidv4()}`;
}
//database e transaction id ta rekhe tarpor failed hole delete diye dibo
mongoose.connect(process.env.Mongo_url).then(()=>{
    console.log("connected to mongodb");
}).catch((err)=>{
    console.log(err);
});

const app=express();
app.use(express.json());
const port=3000;
app.listen(port,()=>{
    console.log(`server in running on port ${port}`)
});
app.post('/api/updateregfee',(req,res)=>{
  const{ref,amount,paymentType}=req.body;
  const newPayment=new Payment({ref,amount,paymentType});
  newPayment.save();
  res.status(201).json('registration fee updated');
});
app.post('/api/hallstudent',(req,res)=>{
  const {reg_no,email,department,session,hons_year,name}=req.body;
  const newStudent= new Hall({reg_no,email,department,session,hons_year,name});
  newStudent.save();
  res.status(201).json('hall student added');
})
app.use('/api/student',studentRouter);
app.use('/api/auth',authRouter);
app.use('/api/manager',managaerRouter);
app.use('/api/teacher',teacherRouter);
app.post('/api/reg_payment',async (req,res,next)=>{
    const{reg_no,name,phone,email}=req.body;
    const user=await Hall.findOne({reg_no});
    if(!user){
        return next(errorHandler(404,'user not found'));
    }
  try{
    const registrationId=await Payment.findOne({paymentType:'registration'});
    if(!registrationId){
      return next(errorHandler(404,'registration fee is not updated by manager'));
    }
    const amount=registrationId.amount;
    const transactionId=generateTransactionId();
    const data = {
      total_amount: amount,
      currency: 'BDT',
      tran_id: transactionId, // use unique tran_id for each api call
      success_url: `http://localhost:3000/api/payment/success/${transactionId}`,
      fail_url: 'http://localhost:3000/api/payment/fail',
      cancel_url: 'http://localhost:3000/api/payment/cancel',
      ipn_url: 'http://localhost:3000/api/payment/ipn',
      shipping_method: 'Courier',
      product_name: 'Computer.',
      product_category: 'Electronic',
      product_profile: 'general',
      cus_name: name,
      cus_email: email,
      cus_add1: 'Dhaka',
      cus_add2: 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: phone,
      cus_fax: '01711111111',
      ship_name: name,
      ship_add1: 'Dhaka',
      ship_add2: 'Dhaka',
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: 1000,
      ship_country: 'Bangladesh',
  };
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
  sslcz.init(data).then(apiResponse => {
      // Redirect the user to payment gateway
      let GatewayPageURL = apiResponse.GatewayPageURL
      //res.redirect(GatewayPageURL)
      res.json({'url':GatewayPageURL});
  });
  app.post('/api/payment/success/:tranId',async(req,res)=>{
    const transactionId=req.params.tranId;
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    const newPayment=new StudentPayment({
        paymentRef:registrationId._id,
        studentRef:user._id,
        transactionId:transactionId,
        date:formattedDate,
    });
    await newPayment.save();
   res.redirect(`http://localhost:5173/payment_success/${req.params.tranId}`);
  });
  app.post('/api/payment/fail', (req, res) => {
    res.redirect(`http://localhost:5173/payment_failed`);
});

// Example Cancel Endpoint
app.post('/api/payment/cancel', (req, res) => {
    res.redirect(`http://localhost:5173/payment_cancelled`);
});
  }catch(error){
    return next(error);
  }
})
//middleware for error
app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||"internal server error";
    return res.status(statusCode).json({
        success:false,
        statusCode:statusCode,
        message:message
    });
    //from those function next(error)
});