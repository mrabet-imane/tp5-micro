const express = require('express');
const connectDB = require('./db');
const teacherRoutes = require('./routes/teacher');
const app = express();
const PORT = 5002;


app.use(express.json());


connectDB();

app.get('/', (req, res) => {
  res.send('Teacher Service is running');
});
app.use('/teacher', teacherRoutes);

app.listen(PORT, () => {
  console.log(`Teacher Service is running on port ${PORT}`);
});