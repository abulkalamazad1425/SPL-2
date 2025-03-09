import Meal from "../models/meal.model.js";
import Payment from "../models/payment.model.js";
import Student from "../models/student.model.js";
import StudentMeal from "../models/studentMeal.js";
import { errorHandler } from "../utils/error.js";
function createReference(startdate,enddate){
    const start=new Date(startdate);
    const end=new Date(enddate);
    const startString=start.toDateString().split(' ').slice(1).join(' ');
    const endString=end.toDateString().split(' ').slice(1).join(' ');
    return startString+'-'+endString;
  }

export const updateMealSchedule=async(req,res,next)=>{
    const{startDate,finishDate,mealRate,mealChoice}=req.body;
    const ref=createReference(startDate,finishDate);
    let count=0;
    try{
      for(let i=new Date(startDate);i<=new Date(finishDate);i.setDate(i.getDate()+1)){
        count++;
        //let formattedDate=formatDateToDDMMYY(i);
        if(mealChoice==='Double Choice'){
          const meal=['lunch','dinner'];
          for(let j=0;j<meal.length;j++){
            const newMeal=new Meal({date:new Date(i),mealtype:meal[j],mealrate:Number(mealRate)});
            if(!newMeal){
              return next(errorHandler(401,'meal not created'));
            }
            await newMeal.save();
          }
        }
        else if(mealChoice==='Single Choice'){
          const newMeal=new Meal({date:new Date(i),mealtype:'Lunch+Dinner',mealrate:Number(mealRate)*2});
          if(!newMeal){
            return next(errorHandler(401,'meal not created'));
          }
          await newMeal.save();
        }
      }
      const newPayment=new Payment({ref,amount:Number(mealRate)*2*count,paymentType:'mealPayment'});
      await newPayment.save();
      return res.status(200).json('meal schedule and payment updated successfully');
    }catch(error){
      return next(error);
    }
  }

  export const updateMealStatus = async (req, res, next) => {
    const { student_id, meal_id } = req.query; // Get student_id and meal_id from query params
    try {
      const studentMeal = await StudentMeal.findOne({ studentRef: student_id, mealRef: meal_id });
      const mealDetails=await Meal.findById(meal_id);
  
      if (!studentMeal) {
        return next(errorHandler(404, "Meal entry not found for this student"));
      }
  
      // Toggle the meal status (off -> on, on -> off)
      const student=await Student.findById(student_id);
      if(student.balance<mealDetails.mealrate && studentMeal.mealStatus==='off'){
        res.status(200).json({'mealStatus':'off'});
        return;
      }
      studentMeal.mealStatus = studentMeal.mealStatus === "off" ? "on" : "off";
      let balance;
      if(studentMeal.mealStatus==='off'){
        const updatedStudent= await Student.findOneAndUpdate(
         { _id:student_id},
         {$inc:{balance:mealDetails.mealrate}},
         {new:true}
        );
        balance=updatedStudent.balance;
      }
      else if(studentMeal.mealStatus==='on'){
        const updatedStudent= await Student.findOneAndUpdate(
         { _id:student_id},
         {$inc:{balance:-mealDetails.mealrate}},
         {new:true}
        );
      }
      await studentMeal.save();
      res.status(200).json({'mealStatus':studentMeal.mealStatus});
  
    } catch (error) {
      return next(error);
    }
  }

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

  export const updateServedStatus=async(req,res,next)=>{
    try{
      const { mealId } = req.params;
      const { servedStatus } = req.body;
  
      if (!servedStatus || !["Served", "Unserved"].includes(servedStatus)) {
        return res.status(400).json({ success: false, message: "Invalid served status" });
      }
  
      const updatedMeal = await StudentMeal.findByIdAndUpdate(
        mealId,
        { servedStatus },
        { new: true }
      );
  
      if (!updatedMeal) {
        return res.status(404).json({ success: false, message: "Meal not found" });
      }
  
      res.status(200).json({ success: true, message: "Meal status updated successfully", updatedMeal });
  
    }catch(error){
      return next(error)
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
  export const getDailyMealList=async(req,res,next)=>{
    try{
      const { date } = req.query; // Get date from query params
  
      if (!date) {
        return res.status(400).json({ success: false, message: "Date is required" });
      }
  
      // Convert date to a Date object and match meals on that date
      const mealDate = new Date(date);
      const meals = await Meal.find({ date: mealDate });
  
      if (meals.length === 0) {
        return res.status(404).json({ success: false, message: "No meals found for the given date" });
      }
  
      // Get meal IDs for the given date
      const mealIds = meals.map(meal => meal._id);
  
      // Fetch student meals that match the meal IDs
      const studentMeals = await StudentMeal.find({ mealRef: { $in: mealIds },mealStatus:'on'})
        .populate("studentRef", "name reg_no") // Populate student details
        .populate("mealRef", "mealtype mealrate date"); // Populate meal details
  
      if (studentMeals.length === 0) {
        return res.status(404).json({ success: false, message: "No students found for meals on this date" });
      }
      res.status(200).json({ success: true, studentMeals });
    }catch(error){
      return next(error);
    }
  }
  