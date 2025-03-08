const express = require('express');
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

   
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = new User({ name, email, password });
    await user.save();

    console.log('User successfully registered:', user);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Received email:', email);
    console.log('Received password:', password);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user);
    console.log('Stored password in database:', user.password);

    
    if (password !== user.password) {
      console.log('Incorrect password for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, 'SECRET_KEY', { expiresIn: '1h' });
    console.log('Generated token:', token);

    res.json({ token });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

router.get('/profile', verifyToken, async (req, res) => {
  try {
    console.log('User ID from token:', req.userId);

   
    const user = await User.findById(req.userId).select('-password').lean();
    if (!user) {
      console.log('User not found for ID:', req.userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User profile retrieved:', user);
    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});

module.exports = router;
