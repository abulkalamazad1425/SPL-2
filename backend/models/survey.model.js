import mongoose from 'mongoose';
const surveySchema=mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
      },
      duration: {
        type: Number, // Duration in days
        required: true,
      },
      questions: [
        {
          type: {
            type: String,
            enum: ["multiple-choice", "rating-scale", "open-ended", "yes-no", "dropdown-checkbox"],
            required: true,
          },
          question: {
            type: String,
            required: true,
          },
          options: {
            type: [String], // Only applicable for multiple-choice & dropdown-checkbox
            default: [],
          },
        },
      ],
      createdAt: {
        type: Date,
        default: Date.now,
      },
      expiresAt: {
        type: Date,
        required: true,
      },
      createdBy:{
        type:String,
        required:true,
        enum:['manager','admin'],
      }
},{timestamps:true});
// surveySchema.pre("save", function (next) {
//     this.expiresAt = new Date(Date.now() + this.duration * 24 * 60 * 60 * 1000);
//     next();
//   });
  
  const Survey = mongoose.model("Survey", surveySchema);
  export default Survey;
  