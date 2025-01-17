const express = require('express');
const router = express.Router();
const { CreateCate } = require('../controller/CateController.js');


router.post('/createCate  ', CreateCate);

module.exports = router;