const express = require('express');
const connectDB = require('./db');
const courseRoutes = require('./routes/course');

const app = express();
const PORT = 5000;

app.use(express.json());


connectDB();


app.get('/', (req, res) => {
  res.send('Course Service is running');
});


app.use('/course', courseRoutes);


app.listen(PORT, () => {
  console.log(`Course Service is running on port ${PORT}`);
});