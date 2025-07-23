const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Not authorized: No token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Not authorized: User not found' });
    }

    req.user = user; // 👈 attaches user to the request
    next();
  } catch (err) {
    console.error('JWT error:', err);
    res.status(401).json({ message: 'Not authorized: Invalid token' });
  }
};
