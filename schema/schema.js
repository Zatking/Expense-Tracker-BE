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
    Amount: {type:Number, required:[true, 'Amount is required']},
    Description: {type:String, required:false},
})

const ExpenseSchema = new mongoose.Schema({
    Date: {type:Date,default:Date.now},
    Amount: {type:Number, required:[true, 'Amount is required']},
    Description: {type:String, required:false},

})



const CategorySchema = new mongoose.Schema({
    Name: {type:String, required:[true, 'Name is required']},
    StarDate: {type:Date, required:true},
    EndDate: {type:Date, required:true},
    Money: {type:Number, required:[true, 'Money is required']},
    Description: {type:String, required:false},
    Income: {type:mongoose.Schema.Types.ObjectId, ref:'Income'},

})

const ReportSchema = new mongoose.Schema({
    Content: {type:String, required:true},
    Date: {type:Date, default:Date.now},
    User: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
   
})

//Models

const Income = mongoose.model('Income', IncomeSchema);
const Expense = mongoose.model('Expense', ExpenseSchema);
const Category = mongoose.model('Category', CategorySchema);
const Report = mongoose.model('Report', ReportSchema);
const User = mongoose.model('User', UserSchema);



module.exports = {
    User,
    Income,
    Expense,
    Category,
    Report
}