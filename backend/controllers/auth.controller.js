import Student from "../models/student.model.js";
import Teacher from "../models/teacher.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

export const reset_password=async(req,res,next)=>{
    const{reg_no,newPassword,confirmPassword}=req.body;
    try{
        const user=await Student.findOne({reg_no});
        if(!user){
            return next(errorHandler(404,'user not found'))
        }
        const result = await Student.updateOne(
            { reg_no: reg_no },  
            { $set: {
                 password: bcryptjs.hashSync(newPassword,10),
                } 
            } ,
            {new:true},
          );
          // reset password er somoy cookie delete kore log in a pathaya dite hbe
          return res.status(201).json('user is updated succesfully');
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