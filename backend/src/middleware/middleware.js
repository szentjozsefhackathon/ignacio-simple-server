const rateLimit = require('express-rate-limit');
const basicAuth = require('express-basic-auth');

// Load environment variables from .env file
require('dotenv').config();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 100 requests per windowMs TODO: Find optimal value
    message: 'Too many requests, please try again later.'
  });
  
// const adminAuth = basicAuth({
//   users: { [process.env.ADMIN_NAME]: process.env.ADMIN_PASSWORD },
//   challenge: true,
//   unauthorizedResponse: 'Unauthorized access'
// });

module.exports = { limiter, adminAuth };