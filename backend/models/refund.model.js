import mongoose from "mongoose";
import Student from "./student.model.js";

const refundSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Student,
      required: true,
    },
    refundType: {
      type: String,
      required: true,
      enum: ['mealRefund','jamanatRefund'],
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Refund = mongoose.model("Refund", refundSchema);
export default Refund;
