// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');

// dotenv.config();

// function authenticateToken(req, res, next) {
//   const token = req.header('Authorization');
//   if (!token) {
//     return res.status(401).json({ message: 'Access denied. No token provided.' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(400).json({ message: 'Invalid token.' });
//   }
// }

// module.exports = authenticateToken;
