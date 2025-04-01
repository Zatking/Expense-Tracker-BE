const express = require('express');
const router = express.Router();

const {
    createTransaction,
    editTransaction,
    getTransactionUser,
    getTransaction,
    getExpenseTransaction,
    getIncomeTransaction,
    getTransactionByMonth,
    getExpenseTransactionNow,
    getIncomeTransactionNow,
    totalMoneyExpense,
    totalMoneyIncome,
    getTransactionByMonth,
    totalMoney,
}= require('../controller/Transaction');


router.post('/createTransaction', createTransaction);
router.put('/editTransaction', editTransaction);
router.get('/getTransactionUser', getTransactionUser);
router.get('/transaction', getTransaction);
router.get('/transactionExpense', getExpenseTransaction);
router.get('/transactionIncome', getIncomeTransaction);
router.get('/transactionByMonth', getTransactionByMonth);
router.get('/transactionExpenseNow', getExpenseTransactionNow);
router.get('/transactionIncomeNow', getIncomeTransactionNow);
router.get('/totalMoneyExpense', totalMoneyExpense);
router.get('/totalMoneyIncome', totalMoneyIncome);
router.get('/totalMoney', totalMoney);
router.get('/transactionByMonth', getTransactionByMonth);

module.exports = router;