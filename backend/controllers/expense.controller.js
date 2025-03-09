import Expense from "../models/expense.model.js";
import Manager from "../models/manager.model.js";
import { errorHandler } from "../utils/error.js";

export const uploadExpense=async(req,res,next)=>{
    const{items}=req.body;
    try {
  
      if (!items || items.length === 0) {
        return next(errorHandler(400,'no item given'));
      }
  
      // Calculate total price from items
      const totalPrice = items.reduce((sum, item) => sum + Number(item.price), 0);
  
      const newExpense = new Expense({
        date: Date.now(), // Use provided date or default to current date
        items,
        totalPrice,
      });
      const manager=await Manager.findOne();
      manager.balance-=totalPrice;
      await manager.save();
      await newExpense.save();
      res.status(201).json('expense details created successfully');
    } catch (error) {
      return next(error);
    }
  }
  export const getExpenses=async(req,res,next)=>{
    try{
        const expenseList=await Expense.find().sort({date:-1});
        if(!expenseList){
            return next(errorHandler(400,'expense is not updated'));
        }
        res.status(200).json({'expenseList':expenseList});
    }catch(error){
        return next(error);
    }
}
export const getSingleExpense=async(req,res,next)=>{
    const {expenseId}=req.params;
    try{
        const expense=await Expense.findById(expenseId);
        if(!expense){
            return next(errorHandler(400,'expense is not updated'));
        }
        res.status(200).json({'expenseDetails':expense});
    }catch(error){
        return next(error);
    }
}