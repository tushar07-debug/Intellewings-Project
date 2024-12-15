const jwt = require('jsonwebtoken');

// Load the secret key
const JWT_SECRET = process.env.JWT_SECRET;

// Function  of  JWT token
const generateToken = (payload, expiresIn = '1h') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

// Function to verify a JWT token
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
