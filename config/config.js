require("dotenv").config();

console.log(process.env.MONGO_URL);
module.exports ={
    MONGO_URL: process.env.MONGO_URL,
}