const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});


router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const user =  User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch =  bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid ' });

    const token = jwt.sign({ id: user._id }, 'SECRET_KEY');
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});


router.get('/profile', verifyToken, async (req, res) => {
    try {
      const user = await User.findById(req.userId).select('-password').lean();
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user); 
    } catch (err) {
      res.status(500).json({ message: 'Error fetching profile', error: err.message });
    }
  });
module.exports = router;