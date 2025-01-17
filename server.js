const express = require('express');
const cors = require('cors');
// const cate = require('./router/CategoryRouter');
const app = express();
const { CreateCate } = require('./controller/CateController.js');
app.post('/createCate', CreateCate);


app.use(cors());
app.use(express.json());

const PORT = 4000;


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


app.get('/test', (req, res) => {
  res.send('Hello World');
});

// app.use("/api", cate);