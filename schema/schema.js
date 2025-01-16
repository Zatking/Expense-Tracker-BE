const mongoose = require('mongoose');
const {z} = require('zod');



// Đây là schema cho tài khoản người dùng
const AccountSchema = new mongoose.Schema({
   _id: z.number().positive().optional(),
    Username: z.string().min(8,"Tên tài khoản ít nhất 8 ký tự").max(20,"Tên tài khoản tối đa 20 ký tự"),
    Password: z.string().min(8,"Mật khẩu ít nhất là 8 ký tự").max(20,"Mật khẩu tối đa là 20 ký tự").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),// Ký tự đặc biệt
})

const AdminSchema = new mongoose.Schema({
    _id: z.number().positive().optional(),
    Username: z.string().min(8,"Tên người dùng ít nhất 8 ký tự").max(20,"Tên người dùngdùng tối đa 20 ký tự"),
})

const UserSchema = new mongoose.Schema({
    _id: z.number().positive().optional(),
    Username: z.string().min(8,"Tên người dùng ít nhất 8 ký tự").max(20,"Tên người dùng tối đa 20 ký tự"),
    Birthday: z.date().min(new Date(1900, 1, 1), "Ngày sinh không hợp lệ").max(new Date().now(), "Ngày sinh không hợp lệ"),
    PhoneNumber: z.string().min(10,"Số điện thoại ít nhất 10 số").max(11,"Số điện thoại tối đa 11 số"),
    Email: z.string().email("Email không hợp lệ"),
})


const IncomeSchema = new mongoose.Schema({
    _id:z.number().positive().optional(),
    Date: z.date().min(new Date.now(), "Ngày không hợp lệ").max(new Date.now,"Ngày không hợp lệ"),
    Amount: z.number().positive().min(0,"Số tiền không hợp lệ"),
    Description: z.string()
})

const ExpenseSchema = new mongoose.Schema({
    _id:z.number().positive().optional(),
    Date: z.date().min(new Date.now(), "Ngày không hợp lệ").max(new Date.now,"Ngày không hợp lệ"),
    Date: {Date, required: true},
    Amount: z.number().positive().min(0,"Số tiền không hợp lệ"),
    Description: z.string()
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
const User = mongoose.model('User', UserSchema);
const Counter = mongoose.model('Counter', counterSchema);


const counterAccount = mongoose.model("counterAccount", counterSchema);
const counterAdmin = mongoose.model("counterAdmin", counterSchema);
const counterIncome = mongoose.model("counterIncome", counterSchema);
const counterExpense = mongoose.model("counterExpense", counterSchema);
const counterCategory = mongoose.model("counterCategory", counterSchema);
const counterReport = mongoose.model("counterReport", counterSchema);
const counterUser = mongoose.model("counterUser", counterSchema);q

module.exports = {
    Account,
    Admin,
    Income,
    Expense,
    Category,
    Report,
    User,
    Counter,
    counterAccount,
    counterAdmin,
    counterIncome,
    counterExpense,
    counterCategory,
    counterReport,
    counterUser
}