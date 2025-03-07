const express = require('express');
const connectDB = require('./db'); 
const authRoutes = require('./routes/auth'); 

const app = express();
const PORT = 5003;

app.use(express.json());

app.use('/auth', authRoutes);


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Auth Service is running on port ${PORT}`);
  });
});