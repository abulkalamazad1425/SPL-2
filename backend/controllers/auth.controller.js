import Expense from "../models/expense.model.js";
import Notice from "../models/notice.model.js";
import Student from "../models/student.model.js";
import Teacher from "../models/teacher.model.js";
import Manager from "../models/manager.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import Otp from "../models/otp.model.js";
import { generateOtp,sendOtpEmail } from "./student.controller.js";

export const reset_password=async(req,res,next)=>{
    const{identifier,newPassword,userType}=req.body;
    try{
        if(userType==='student'){
            const user=await Student.findOne({reg_no:identifier});
            if(!user){
                return next(errorHandler(404,'user not found'))
            }
            const result = await Student.updateOne(
                { reg_no: identifier },  
                { $set: {
                    password: bcryptjs.hashSync(newPassword,10),
                    } 
                } ,
                {new:true},
            );
        }
        else if(userType==='manager'){
            const user=await Manager.findOne({username:identifier});
            if(!user){
                return next(errorHandler(404,'user not found'))
            }
            const result = await Manager.updateOne(
                { username: identifier },  
                { $set: {
                    password: bcryptjs.hashSync(newPassword,10),
                    } 
                } ,
                {new:true},
            );
        }
        else if(userType==='admin'){
            const user=await Teacher.findOne({username:identifier});
            if(!user){
                return next(errorHandler(404,'user not found'))
            }
            const result = await Teacher.updateOne(
                { username: identifier },  
                { $set: {
                    password: bcryptjs.hashSync(newPassword,10),
                    } 
                } ,
                {new:true},
            );
        }
        return res.status(201).json('password  updated succesfully');
    }catch(error){
       return next(error);
    }
}

export const addTeacher=async(req,res,next)=>{
    const {username,password,name,email,designation,department,phone}=req.body;
    try{
        const hashedPassword=bcryptjs.hashSync(password,10);
        const teacher=new Teacher({username,password:hashedPassword,name,email,designation,department,phone});
        if(!teacher){
            return next(errorHandler(401,'user not created'));
        }
        await teacher.save();
        res.status(201).json("Teacher is added successfully");
    }catch(error){
        return next(error);
    }
}
export const updateProfile=async(req,res,next)=>{
    try{
        const student=await Student.findOne({_id:req.params.id});
        let updatedUser,usertype;
        if(student){
            const{name,email,hons_year,phone}=req.body;
            const updateFields = { name, email, phone, hons_year };
            if (req.file) {
            updateFields.photo = req.file.path;
            }
            usertype='student';
            updatedUser = await Student.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true });

        }
        else{
            const manager=await Manager.findById(req.params.id);
            if(manager){
                const{name,email,phone}=req.body;
                const updateFields = { name, email, phone};
                if (req.file) {
                updateFields.photo = req.file.path;
                }
                usertype='manager'
                updatedUser = await Manager.findByIdAndUpdate(
                req.params.id,
                { $set: updateFields },
                { new: true });
            }
            else{
                const teacher=await Teacher.findById(req.params.id);
                if(!teacher){
                    return next(errorHandler(404,'user not found'));
                }
                const{name,email,phone,designation,department}=req.body;
                const updateFields = { name, email, phone,designation,department};
                if (req.file) {
                updateFields.photo = req.file.path;
                }
                usertype='admin';
                updatedUser = await Teacher.findByIdAndUpdate(
                req.params.id,
                { $set: updateFields },
                { new: true });
            }
        }
        const{password:pass,...rest}=updatedUser._doc;
        const updatedRest={...rest,usertype:usertype};
        return res.status(200).json(updatedRest);
    }catch(error){
        return next(error);
    }
}
export const changePassword=async(req,res,next)=>{
    try{
        const{currentPassword,newPassword}=req.body;
        let user=await Student.findById(req.params.id);
        if (!user) {
            user = await Manager.findById(req.params.id);
        }
        if (!user) {
            user = await Teacher.findById(req.params.id);
        }
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }
        const isMatch =bcryptjs.compareSync(currentPassword, user.password);
        if (!isMatch) {
        return res.status(400).json({ success: false, message: "Current password is incorrect" });
        }
        user.password = bcryptjs.hashSync(newPassword, 10);
        await user.save();
        res.status(200).json('password updated successfully');
    }catch(error){
        return next(error);
    }
}
export const logOut=async(req,res,next)=>{
    try{
        res.clearCookie('access_token');
        res.status(200).json('logged out successfully');
    }catch(error){
        return next(error);
    }
}
export const getProfile=async(req,res,next)=>{
    try{
        const{userId}=req.params;
        let usertype='student';
        let user=await Student.findById(userId);
        if(user){
            if(user.reg_payment==='unpaid'){
                return next(errorHandler(400,'you are removed'));
            }
        }
        if(!user){
            user=await Manager.findById(userId);
            usertype='manager';
        }
        if(!user){
            user=await Teacher.findById(userId);
            usertype='admin';
        }
        if(!user){
            return next(errorHandler(404,'user not found'));
        }
        const{password:pass,...rest}=user._doc;
        const updatedRest={...rest,usertype:usertype};
        console.log(updatedRest)
        res.status(200).json(updatedRest)
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
  export const forgetPassVerifyOtp=async(req,res,next)=>{
    try{
      const{identifier,otp}=req.body;
      const otpRecord = await Otp.findOne({identifier,otp});
      if (!otpRecord) {
        return next(errorHandler(404,"otp not matched"));
      }
      if (new Date() > otpRecord.expiresAt) {
        return next(errorHandler(404,'OTP has expired. Please request a new OTP.'))
      }
      if (otp !== otpRecord.otp) {
          return next(errorHandler(400,"otp not matched")) ;
      }
      await Otp.deleteOne({identifier });
      res.status(200).json('otp verified successfully');
    }catch(error){
      return next(error);
    }
  }
  export const forgetPassGenerateOtp=async(req,res,next)=>{
    try{
      const{identifier,userType}=req.body;
      const result = await Otp.deleteMany({ identifier });
      let record;
      if(userType==='student'){
        const student = await Student.findOne({ reg_no:identifier });
        if (!student) {
          return next(errorHandler(404,'you are not a valid user'))
        }
        record=student;
      }
      else if(userType==='manager'){
        const manager = await Manager.findOne({ username:identifier });
        if (!manager) {
          return next(errorHandler(404,'you are not a valid user'))
        }
        record=manager;
      }
      else if(userType==='admin'){
        const admin = await Teacher.findOne({ username:identifier });
        if (!admin) {
          return next(errorHandler(404,'you are not a valid user'))
        }
        record=admin;
      }
      const email = record.email;
      const otp = generateOtp(); 
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 
      const otpRecord = new Otp({
        otp,
        email,
        identifier,
        expiresAt,
      });
      await otpRecord.save();
      await sendOtpEmail(email, otp);
      return res.status(200).json({ message: `an otp is sent to ${email}` });
    }catch(error){
      return next(error);
    }
  }