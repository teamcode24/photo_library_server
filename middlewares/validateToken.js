const jwt = require('jsonwebtoken');
const config = require('../config/config')


module.exports = function (req, res, next) {
  console.log(req.headers['authorization'])
    const token = req.headers['authorization']; // Create token found in headers
    console.log(token)
    // Check if token was found in headers
    if (!token) {
     res.json({ success: false, message: 'No token provided' }); // Return error
    } 
    // Verify the token is valid
    jwt.verify(token, config.SECRET_KEY, (err, decoded) => {
      // Check if error is expired or invalid
      if (err) {
        res.status(401).json({ success: false, message: 'Token invalid: ' + err }); // Return error for token validation
      } else {
        req.decoded = decoded; // Create global variable to use in any request beyond
        next(); // Exit middleware
      }
    });
    
};
