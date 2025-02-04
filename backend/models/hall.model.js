import mongoose from "mongoose";
const hallSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    reg_no:{
        type:String,
        required:true,
        unique:true,
    },
    department:{
        type:String,
        required:true,
    },
    session:{
        type:String,
        required:true,
    },
    hons_year:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    }
},{timestamps:true});
const Hall=mongoose.model('Hall',hallSchema);
export default Hall;