const express = require('express');
const router = express.Router();
const { CreateCate, GetCate } = require('../controller/CateController');

router.post('/createCate  ', CreateCate);
router.get('/getCate', GetCate);

module.exports = router;