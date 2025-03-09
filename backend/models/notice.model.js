import mongoose from "mongoose";
const noticeSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    pdfFile:{
        type:String,
        default:null,
    },
},{timestamps:true});
const Notice=mongoose.model('Notice',noticeSchema);
export default Notice;