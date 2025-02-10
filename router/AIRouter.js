const express = require('express');
const router = express.Router();

const {
    generateContent
}= require('../controller/AiService');

router.post('/AI', generateContent);

module.exports = router;