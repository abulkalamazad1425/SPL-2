import mongoose from "mongoose";
const mealSchema=mongoose.Schema({
    date:{
        type:Date,
        required:true,
    },
    mealtype:{
        type:String,
        required:true,
    },
    mealrate:{
        type:Number,
        required:true,
        min:0,
    },
},{timestamps:true});
const Meal=mongoose.model('Meal',mealSchema);
export default Meal;