import mongoose from 'mongoose'
import Payment from './payment.model.js';
import Student from './student.model.js';

const StudentPaymentSchema=mongoose.Schema({
    paymentRef:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Payment,
        required:true,
    },
    studentRef:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Student,
        required:true,
    },
    transactionId:{
        type:String,
        required:true,
        unique:true,
    },
    date:{
        type:Date,
        required:true,
        default:Date.now(),
    }
},{timestamps:true});
const StudentPayment=mongoose.model('StudentPayment',StudentPaymentSchema);
export default StudentPayment;