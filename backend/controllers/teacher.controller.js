import Manager from "../models/manager.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

export const addManager=async(req,res,next)=>{
    const{username,password,name,email,phone}=req.body;
    try{
        const hashedPassword=bcryptjs.hashSync(password,10);
        const manager=new Manager({username,password:hashedPassword,name,email,phone});
        if(!manager){
            return next(errorHandler(401,"manager not added"));
        }
        await manager.save();
        res.status(201).json("new manager is added");
    }catch(error){
        return next(error);
    }
}
export const getManagerDetails=async(req,res,next)=>{
    try{
        const manager=await Manager.findOne();
        if(!manager){
            return next(errorHandler(404,'no manager found'));
        }
        const {password:pass,...rest}=manager._doc;
        res.status(200).json(rest);
    }catch(error){
        return next(error);
    }
}
export const removeManager=async(req,res,next)=>{
    try{
        const{managerId}=req.params;
        const count=await Manager.deleteOne({_id:managerId});
        if(count===0){
            return next(errorHandler(401,'failed to delete'));
        }
        res.status(200).json('manager profile deleted successfully');
    }catch(error){
        return next(error);
    }
}