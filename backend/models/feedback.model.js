import mongoose from 'mongoose';
import Student from './student.model.js';
const feedbackSchema=mongoose.Schema({
    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Student,
        required:true,
    },
    title:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
},{timestamps:true});
const Feedback=mongoose.model('Feedback',feedbackSchema);
export default Feedback;