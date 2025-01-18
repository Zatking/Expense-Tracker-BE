const User = require('../schema/schema').User;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


//API Register user
const createUser = async (req, res) => {
    try {
        const cate= await User.create(req.body);
        res.status(201).json(cate);
     } catch (error) {
         res.status(500).json({message: error.message});
     }
}

const getUser = async (req, res) => {
    try {
        const user = await User.find();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    createUser,
    getUser
}