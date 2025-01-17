require('dotenv').config();

const mongoose = require('mongoose');
const uri = process.env.MONGO_URI; // Đọc giá trị từ file .env

if (!uri) {
  console.error("MONGO_URI is not defined in your .env file");
  process.exit(1); // Thoát chương trình nếu không có URI
}

mongoose.connect(uri)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.error("Failed to connect to MongoDB", err));
