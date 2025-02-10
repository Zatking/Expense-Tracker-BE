const express = require('express');
const router = express.Router();

const {
    GetCate,
    CreateCate,
    UpdateCate,
    DeleteCate,
    DeleteAllCate,
    GetListCateByUser,
    CreateCateUser,
    UpdateCateUser,
    CreateIncome,
    CreateExpense
}
= require('../controller/CateController');

router.get('/getCate', GetCate);
router.post('/createCate', CreateCate);
router.put('/updateCate', UpdateCate);
router.delete('/deleteCate', DeleteCate);
router.delete('/deleteAllCate', DeleteAllCate);
router.get('/getListCateByUser', GetListCateByUser);
router.post('/createCateUser', CreateCateUser);
router.put('/updateCateUser', UpdateCateUser);
router.post('/createIncome', CreateIncome);
router.post('/createExpense', CreateExpense);

module.exports = router;