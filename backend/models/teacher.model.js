import mongoose from "mongoose";
const teacherSchema=mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    department:{
        type:String,
        required:true,
    },
    designation:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
        unique:true,
    }
},{timestamps:true});
const Teacher=mongoose.model('Teacher',teacherSchema);
export default Teacher;
