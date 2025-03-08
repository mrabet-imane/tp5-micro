const express = require('express');
const connectDB = require('./db');
const studentRoutes = require('./routes/student');
const app = express();
const PORT = 5005;


app.use(express.json());


connectDB();


app.get('/', (req, res) => {
  res.send('Student Service is running');
});
app.use('/student', studentRoutes);
app.listen(PORT, () => {
  console.log(`Student Service is running on port ${PORT}`);
});