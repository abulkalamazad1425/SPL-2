import mongoose from "mongoose";

// Define the student schema
const studentSchema = new mongoose.Schema({
  reg_no: {
    type: String,
    required: true,
    unique: true, // Ensures registration number is unique
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email is unique
  },
  phone: {
    type: String,
    required: true,
    unique: true, // Ensures phone number is unique
  },
  department: {
    type: String,
    required: true,
  },
  session: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  reg_payment: {
    type: String,
    required:true,
  },
  name: {
    type: String,
    required: true,
  },
  hons_year: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0, // Set default balance value to 0
  }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
export default Student;
