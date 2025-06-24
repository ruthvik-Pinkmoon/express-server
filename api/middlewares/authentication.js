// authenticationMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/authentication/authenticationSchema');

const authenticationMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    req.user = user; // Attach user to request
    next(); // Continue to next middleware or route handler

  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.', error: error.message });
  }
};

module.exports = authenticationMiddleware;
