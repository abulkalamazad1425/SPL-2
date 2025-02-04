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