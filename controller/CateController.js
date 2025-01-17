//API For Category
const Cate = require('../schema/schema').Category;


//Create Category
const CreateCate = async (req, res) => {
    try {
       const cate= await Cate.create(req.body);
        res.status(201).send("Create Category Success");
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = {
    CreateCate,
}