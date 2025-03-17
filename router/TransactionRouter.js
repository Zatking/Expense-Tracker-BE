const express = require('express');
const router = express.Router();

const {
    createTransaction,
    editTransaction,
    getTransactionUser,
    getTransaction,
    getExpenseTransaction,
    getIncomeTransaction,
    getTransactionByMonth
}= require('../controller/Transaction');


router.post('/createTransaction', createTransaction);
router.put('/editTransaction', editTransaction);
router.get('/transactionUser', getTransactionUser);
router.get('/transaction', getTransaction);
router.get('/transactionExpense', getExpenseTransaction);
router.get('/transactionIncome', getIncomeTransaction);
router.get('/transactionByMonth', getTransactionByMonth);

module.exports = router;