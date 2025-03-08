const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Invalid token format' });
  }

  jwt.verify(token, 'SECRET_KEY', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    console.log('Decoded token:', decoded);
    if (!decoded.id) {
      return res.status(400).json({ message: 'Invalid token payload' });
    }
    req.userId = decoded.id; 
    next();
  });
};

module.exports = verifyToken;
