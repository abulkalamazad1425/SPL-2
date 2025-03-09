import mongoose from "mongoose";
import Survey from "./survey.model.js";
import Student from "./student.model.js";

const surveyResponseSchema = new mongoose.Schema({
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Survey,
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Student, // Reference to the user who submitted the response
    required: true
  },
  responses: [
    {
      question: { type: String, required: true },
      responseType: { type: String, enum: ["multiple-choice", "yes-no", "rating-scale", "open-ended"], required: true },
      answer: mongoose.Schema.Types.Mixed // Can be a string, number, or array depending on question type
    }
  ],
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const SurveyResponse = mongoose.model("SurveyResponse", surveyResponseSchema);
export default SurveyResponse;
