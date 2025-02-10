const express = require('express');
const cors = require('cors');
require("dotenv").config();
const database = require('./data/data');
const app = express();
const cate = require('./router/cateRouter');
const user = require('./router/UserRouter');
const AI = require('./router/AIRouter');





app.use(cors());
app.use(express.urlencoded({extended:false}))
app.use(express.json());

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


app.get('/', (req, res) => {
  res.send('Hello World');
});


app.get('/test', (req, res) => {
  res.send('Hello World');
});



//routes
app.use('/API', cate);
app.use('/API', user);
app.use('/API', AI);