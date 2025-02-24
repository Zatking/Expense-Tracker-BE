const express = require('express');
const router = express.Router();

const {
    createTransactionExpense,
    createTransactionIncome,
    getTransaction,
    getExpenseTransaction,
    getIncomeTransaction,
    getTransactionByMonth
}= require('../controller/Transaction');


router.post('/transactionIncome', createTransactionIncome);
router.post('/transactionExpense', createTransactionExpense);
router.get('/transaction', getTransaction);
router.get('/transactionExpense', getExpenseTransaction);
router.get('/transactionIncome', getIncomeTransaction);
router.get('/transactionByMonth', getTransactionByMonth);

module.exports = router;