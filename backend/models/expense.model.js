import mongoose from 'mongoose';
const expenseSchema=mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now, // Automatically set to current date
      },
      items: [
        {
          name: { type: String, required: true }, // Item name
          quantity: { type: Number, required: true }, // Quantity purchased
          price: { type: Number, required: true }, // Price of item
        },
      ],
      totalPrice: {
        type: Number,
        required: true, // Stores the total of all item prices
      },
},{timestamps:true});
const Expense=mongoose.model('Expense',expenseSchema);
export default Expense;