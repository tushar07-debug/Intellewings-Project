const jwt = require('jsonwebtoken');

// Load the secret key from the environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Function to generate a JWT token
const generateToken = (payload, expiresIn = '1h') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

// Function to verify a JWT token
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
