const express = require('express');
const router = express.Router();

const {
    GetCate
}
= require('../controller/CateController');

router.get('/cate', GetCate);

module.exports = router;