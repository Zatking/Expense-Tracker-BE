const mongoose = require('mongoose');

// Đây là schema cho tài khoản người dùng


const UserSchema = new mongoose.Schema({
    Username:{type:String, required:true},
    Email:{type:String, required:true,match: [/^\S+@\S+\.\S+$/, 'Invalid email format']},
    Password:{type:String, required:true},
    CreatedAt:{type:Date, default:Date.now},
    Income: {type:mongoose.Schema.Types.ObjectId, ref:'Income'},
    Expense: {type:mongoose.Schema.Types.ObjectId, ref:'Expense'},
})


const IncomeSchema = new mongoose.Schema({
    Date: {type:Date,default:Date.now},
    Amount: {type:Number, required:true},
    Description: {type:String, required:true},
})

const ExpenseSchema = new mongoose.Schema({
    Date: {type:Date,default:Date.now},
    Amount: {type:Number, required:true},
    Description: {type:String, required:true},

})

const CategorySchema = new mongoose.Schema({
    Name: {type:String, required:true},
    StarDate: {type:Date, required:true},
    EndDate: {type:Date, required:true},
    Money: {type:Number, required:true},
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