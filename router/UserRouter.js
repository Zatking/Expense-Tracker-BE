const express = require('express');
const router = express.Router();

const {
    createUser,
    getUser,
    getUserByName,
    deleteAllUser,
    deleteUserById
}= require('../controller/UserController');

router.post('/user', createUser);
router.get('/user', getUser);
router.get('/user/:name', getUserByName);
router.delete('/user', deleteAllUser);

module.exports = router;