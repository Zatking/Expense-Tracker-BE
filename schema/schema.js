const mongoose = require('mongoose');


// Đây là schema cho tài khoản người dùng
const UserSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:[true, 'Username is required'],
        unique:true
    },
    password:{
        type:String,
        required:[true, 'Password is required']
    },
})


const IncomeSchema = new mongoose.Schema({
    Date: {type:Date,default:Date.now},
    Money: {type:Number, required:[true, 'Amount is required']},
    Description: {type:String, required:false},
    Category: {type:mongoose.Schema.Types.ObjectId, ref:'Category'}
})

const ExpenseSchema = new mongoose.Schema({
    Date: {type:Date,default:Date.now},
    Money: {type:Number, required:[true, 'Amount is required']},
    Description: {type:String, required:false},
    Category: {type:mongoose.Schema.Types.ObjectId, ref:'Category'}

})



const CategorySchema = new mongoose.Schema({
    User: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    Name: {type:String, required:[true, 'Name is required']},
    StarDate: {type:Date, required:true},
    EndDate: {type:Date, required:true},
    Money: {type:Number, required:[true, 'Money is required']},
    Description: {type:String, required:false},
})

const ReportSchema = new mongoose.Schema({
    Content: {type:String, required:true},
    Date: {type:Date, default:Date.now},
    User: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
   
})

const generatedContentSchema = new mongoose.Schema({
    prompt: {
      type: String,
      required: true,
    },
    result: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

//Models

const Income = mongoose.model('Income', IncomeSchema);
const Expense = mongoose.model('Expense', ExpenseSchema);
const Category = mongoose.model('Category', CategorySchema);
const Report = mongoose.model('Report', ReportSchema);
const User = mongoose.model('User', UserSchema);
const GeneratedContent  = mongoose.model('Content', generatedContentSchema);



module.exports = {
    User,
    Income,
    Expense,
    Category,
    Report,
    GeneratedContent 
}