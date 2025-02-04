import mongoose from "mongoose";
const managerSchema=mongoose.Schema({
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
        unique:true,
        required:true,
    },
    phone:{
        type:String,
        unique:true,
        required:true,
    },

},{timestamps:true});
const Manager=mongoose.model('Manager',managerSchema);
export default Manager;