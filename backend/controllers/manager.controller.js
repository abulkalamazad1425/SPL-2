import Meal from "../models/meal.model.js";
import Payment from "../models/payment.model.js";
import Student from "../models/student.model.js";
import StudentMeal from "../models/studentMeal.js";
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

export const updateMealSchedule=async(req,res,next)=>{
  const{startDate,finishDate,mealRate,mealChoice}=req.body;
  const ref=createReference(startDate,finishDate);
  let count=0;
  try{
    for(let i=new Date(startDate);i<=new Date(finishDate);i.setDate(i.getDate()+1)){
      count++;
      //let formattedDate=formatDateToDDMMYY(i);
      if(mealChoice==='period'){
        const meal=['lunch','dinner'];
        for(let j=0;j<meal.length;j++){
          const newMeal=new Meal({date:new Date(i),mealtype:meal[j],mealrate:Number(mealRate)});
          if(!newMeal){
            return next(errorHandler(401,'meal not created'));
          }
          await newMeal.save();
        }
      }
      else if(mealChoice==='day'){
        const newMeal=new Meal({date:new Date(i),mealtype:'fullDay',mealrate:Number(mealRate)*2});
        if(!newMeal){
          return next(errorHandler(401,'meal not created'));
        }
        await newMeal.save();
      }
    }
    const newPayment=new Payment({ref,amount:Number(mealRate)*2*count,paymentType:'mealPayment'});
    await newPayment.save();
    const studentList= await Student.find();
    const mealList = await Meal.find({ date: { $gte: new Date(startDate), $lte: new Date(finishDate) } });
    studentList.forEach(student=>{
      mealList.forEach(async (meal)=>{
        const newStudentMeal=new StudentMeal({studentRef:student._id,mealRef:meal._id,mealStatus:'off'});
        if(!newStudentMeal){
          return next(errorHandler(401,'problem creating in student meal'));
        }
        await newStudentMeal.save();
      })
    })
    return res.status(200).json('meal schedule and payment updated successfully');
  }catch(error){
    return next(error);
  }
}
 
  