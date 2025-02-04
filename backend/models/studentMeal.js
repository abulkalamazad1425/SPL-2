import mongoose from "mongoose";
import Student from "./student.model.js";
import Meal from "./meal.model.js";
const StudentMealSchema=mongoose.Schema({
    studentRef:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Student,
        required:true,
    },
    mealRef:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Meal,
        required:true,
    },
    mealStatus:{
        type:String,
        required:true,
    },
},{timestamps:true});
const StudentMeal=mongoose.model('StudentMeal',StudentMealSchema);
export default StudentMeal;