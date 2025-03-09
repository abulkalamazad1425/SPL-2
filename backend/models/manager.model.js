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
    photo:{
        type:String,
        default:'uploads\\profiles\\profile.png'
    },
    balance:{
        type:Number,
        required:true,
        default:0,
    },
    jamanatBalance:{
        type:Number,
        required:true,
        default:0,
    }

},{timestamps:true});
const Manager=mongoose.model('Manager',managerSchema);
export default Manager;