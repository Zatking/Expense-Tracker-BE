//API For Category
const Cate = require('../schema/schema').Category;

//Get Category
const GetCate = async (req, res) => {
    try {
        const cate = await Cate.find();
        res.status(200).json(cate);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


//Create Category
const CreateCate = async (req, res) => {
    try {
       const cate= await Cate.create(req.body);
       res.status(201).json(cate);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    GetCate,
    CreateCate,
}