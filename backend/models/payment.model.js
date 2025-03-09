import mongoose from "mongoose";
const paymentSchema=mongoose.Schema({
    ref:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    paymentType:{
        type:String,
        enum:['registration','mealPayment'],
        required:true,
    }
},{timestamps:true});
const Payment=mongoose.model('Payment',paymentSchema);
export default Payment;