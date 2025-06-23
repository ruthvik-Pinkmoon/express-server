// authenticationMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/authentication/authenticationSchema');

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    next(); // Go to the next middleware or route
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.', error: error.message });
  }
};

module.exports = authenticationMiddleware;
