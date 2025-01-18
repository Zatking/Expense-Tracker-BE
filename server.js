const express = require('express');
const cors = require('cors');
require("dotenv").config();
const database = require('./data/data');
const app = express();
const cate = require('./router/CategoryRouter');
const user = require('./router/UserRouter');





app.use(cors());
app.use(express.urlencoded({extended:false}))
app.use(express.json());

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


app.get('/test', (req, res) => {
  res.send('Hello World');
});

//routes
app.use('/API', cate);
app.use('/API', user);