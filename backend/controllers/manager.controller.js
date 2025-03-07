import Expense from "../models/expense.model.js";
import Feedback from "../models/feedback.model.js";
import Meal from "../models/meal.model.js";
import Notice from "../models/notice.model.js";
import Payment from "../models/payment.model.js";
import Refund from "../models/refund.model.js";
import Student from "../models/student.model.js";
import StudentMeal from "../models/studentMeal.js";
import Survey from "../models/survey.model.js";
import SurveyResponse from "../models/surveyResponse.model.js";
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
    return res.status(200).json('meal schedule and payment updated successfully');
  }catch(error){
    return next(error);
  }
}
export const uploadNotice=async(req,res,next)=>{
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return next(errorHandler(400,"notice title and description is required"));
    }

    const newNotice = new Notice({
      title,
      description,
      pdfFile: req.file ? req.file.path : null, // Save file path if provided, otherwise null
    });
    await newNotice.save();
    res.status(201).json('notice created successfully');
  } catch (error) {
    return next(error);
  }
}
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

    await newExpense.save();
    res.status(201).json('expense details created successfully');
  } catch (error) {
    return next(error);
  }
}
export const uploadSurvey=async(req,res,next)=>{
  try {
    const { title, duration, questions } = req.body;

    if (!title || !duration || !questions || questions.length === 0) {
      return next(errorHandler(400,'all fields are required'));
    }

    const newSurvey = new Survey({
      title,
      duration,
      questions,
      expiresAt:new Date(Date.now() + duration * 24 * 60 * 60 * 1000)
    });

    await newSurvey.save();
    res.status(201).json({'survey':newSurvey});
  } catch (error) {
    return next(error);
  }
}
export const getSurveyResult=async(req,res,next)=>{
  try{
    const { surveyId } = req.params;

    // Check if the survey exists
    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return next(errorHandler(404,'survey not found'));
    }
    const results = await SurveyResponse.aggregate([
      { $match: { surveyId: survey._id } }, // Match responses for the given survey
      { $unwind: "$responses" }, // Flatten responses array
      {
        $group: {
          _id: { question: "$responses.question", answer: "$responses.answer", answerType: "$responses.responseType" },
          count: { $sum: 1 } // Count occurrences
        }
      },
      {
        $group: {
          _id: "$_id.question",
          responses: { 
            $push: { answer: "$_id.answer", answerType: "$_id.answerType", count: "$count" } 
          }
        }
      },
      { $project: { _id: 0, question: "$_id", responses: 1 } },
    ]);
    console.log(results);
    res.status(200).json({'results':results});
  }catch(error){
    return next(error);
  }
}
export const getFeedbackList=async(req,res,next)=>{
  try{
    const feedbackList = await Feedback.find()
      .populate("studentId", "name reg_no") // Populate student name & reg_no
      .sort({ createdAt: -1 });
    res.status(200).json({ 'feedbackList':feedbackList })
  }catch(error){
    return next(error);
  }
}
export const getMealList=async(req,res,next)=>{
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
export const getRefundList=async(req,res,next)=>{
  try{
    const students = await Student.find({ balance: { $gt: 0 } });
    res.status(200).json({ success: true, students });
  }catch(error){
    return next(error);
  }
}
export const updateRefund=async(req,res,next)=>{
  try{
    const{studentId}=req.params;
    const {balance}=req.body;
    const student=await Student.findById(studentId);
    if(!student){
      return next(errorHandler(404,'student not found'));
    }
    const newRefund=new Refund({
      student:studentId,
      refundType:'mealRefund',
      amount:balance,
    });
    await newRefund.save();
    student.balance=0;
    await student.save();
    res.status(200).json({ success: true, message: "Refund processed successfully" });
  }catch(error){
    return next(error);
  }
}
 
  