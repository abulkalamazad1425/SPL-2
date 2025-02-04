import mongoose from "mongoose";
const paymentSchema=mongoose.Schema({
    ref:{
        type:String,
        required:true,
        unique:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    paymentType:{
        type:String,
        required:true,
    }
},{timestamps:true});
const Payment=mongoose.model('Payment',paymentSchema);
export default Payment;