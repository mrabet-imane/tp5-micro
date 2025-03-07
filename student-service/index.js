const express = require('express');
const connectDB = require('./db');

const app = express();
const PORT = 5001;


app.use(express.json());


connectDB();


app.get('/', (req, res) => {
  res.send('Student Service is running');
});

app.listen(PORT, () => {
  console.log(`Student Service is running on port ${PORT}`);
});