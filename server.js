const express = require('express');
const cors = require('cors');
require("dotenv").config();
const app = express();
const AI = require('./router/AIRouter');
const transaction = require('./router/TransactionRouter');
const data=require('./data/data');





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
app.use('/API', AI);
app.use('/API', transaction);