const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    _id: String,
    seq: Number
})

// Đây là schema cho tài khoản người dùng
const AccountSchema = new mongoose.Schema({
    _id: String,
    Username: { type: String, required: true },
    Password: { type: String, required: true },
})

const AdminSchema = new mongoose.Schema({
    _id: String,
    Username: { type: String, required: true },
    Password: { type: String, required: true },
})

const UserSchema = new mongoose.Schema({
    _id: String,
    Username: { type: String, required: true },
    Birthday: { type: Date, required: true },
    PhoneNumber: { type: String, required: true },
    Email: { type: String, required: true },
})


const IncomeSchema = new mongoose.Schema({
    _id:String,
    Date: {Date, required: true},
    Amount: {Number, required: true},
    Description: {String, required: true},
})

const ExpenseSchema = new mongoose.Schema({
    _id:String,
    Date: {Date, required: true},
    Amount: {Number, required: true},
    Description: {String, required: true},
})

const CategorySchema = new mongoose.Schema({
    _id:String,
    Name: {String, required: true},
})

const ReportSchema = new mongoose.Schema({
    _id:String,
    Content: {String, required: true},
})

//Models
const Account = mongoose.model('Account', AccountSchema);
const Admin = mongoose.model('Admin', AdminSchema);
const Income = mongoose.model('Income', IncomeSchema);
const Expense = mongoose.model('Expense', ExpenseSchema);
const Category = mongoose.model('Category', CategorySchema);
const Report = mongoose.model('Report', ReportSchema);
const Counter = mongoose.model('Counter', counterSchema);


const counterAccount = mongoose.model("counterAccount", counterSchema);
const counterAdmin = mongoose.model("counterAdmin", counterSchema);
const counterIncome = mongoose.model("counterIncome", counterSchema);
const counterExpense = mongoose.model("counterExpense", counterSchema);
const counterCategory = mongoose.model("counterCategory", counterSchema);
const counterReport = mongoose.model("counterReport", counterSchema);

module.exports = {
    Account,
    Admin,
    Income,
    Expense,
    Category,
    Report,
    Counter,
    counterAccount,
    counterAdmin,
    counterIncome,
    counterExpense,
    counterCategory,
    counterReport
}