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

const transactionSchema = new mongoose.Schema({
    userID:{type:String, required:true},
    type:{type:String, required:true},
    totalMoney:{type:Number, required:true},
    description:{type:String, required:true},
    date:{type:Date, required:true},
    transactionType:{type:String, required:true, enum:['Income', 'Expense']},
})




// const CategorySchema = new mongoose.Schema({
//     User: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
//     Name: {type:String, required:[true, 'Name is required']},
//     StarDate: {type:Date, required:true, default:Date.now,
//         validate: {
//             validator: function (value) {
//                 const today = new Date();
//                 today.setHours(0, 0, 0, 0); // Xóa giờ, phút, giây để so sánh chỉ ngày

//                 const inputDate = new Date(value);
//                 inputDate.setHours(0, 0, 0, 0);

//                 return inputDate.getTime() === today.getTime();
//         }
//     }
//     },
//     EndDate: {type:Date, required:true},
//     Money: {type:Number, required:[true, 'Money is required']},
//     Description: {type:String, required:false},
// })

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


// const Category = mongoose.model('Category', CategorySchema);
const Report = mongoose.model('Report', ReportSchema);
const User = mongoose.model('User', UserSchema);
const GeneratedContent  = mongoose.model('Content', generatedContentSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);



module.exports = {
    User,
    // Category,
    Report,
    GeneratedContent,
    Transaction
}