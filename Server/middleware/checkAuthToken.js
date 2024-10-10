const jwt = require('jsonwebtoken');

// Middleware to verify the auth token
function verifyToken(req, res, next) {
  const authToken = req.cookies.authToken;
  const refreshToken = req.cookies.refreshToken;

  // Check if both authToken and refreshToken are provided
  if (!authToken || !refreshToken) {
    return res.status(401).json({
      message: 'Authentication failed: No authToken or refreshToken provided',
      ok: false,
    });
  }

  // Verify the authToken
  jwt.verify(authToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      // If authToken has expired or is invalid, check the refreshToken
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, (refreshErr, refreshDecoded) => {
        if (refreshErr) {
          // Both tokens are invalid, user must log in again
          return res.status(401).json({
            message: 'Authentication failed: Both tokens are invalid. Please log in again.',
            ok: false,
          });
        } else {
          // Refresh the authToken using the refreshToken
          const newAuthToken = jwt.sign(
            { userId: refreshDecoded.userId },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '15m' } // Issue a new short-lived auth token
          );
          const newRefreshToken = jwt.sign(
            { userId: refreshDecoded.userId },
            process.env.JWT_REFRESH_SECRET_KEY,
            { expiresIn: '7d' } // Refresh token for another 7 days
          );

          // Set the new tokens as secure cookies
          res.cookie('authToken', newAuthToken, {
            httpOnly: true,
            secure: true, // Use true in production (HTTPS)
            sameSite: 'Strict', // Prevent CSRF attacks
          });
          res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
          });

          // Attach the userId to the request and continue processing
          req.userId = refreshDecoded.userId;
          next();
        }
      });
    } else {
      // If authToken is valid, proceed with the request
      req.userId = decoded.userId;
      next();
    }
  });
}

// Middleware to verify if the user has the required role(s)
function verifyRole(allowedRoles) {
  return (req, res, next) => {
    const userRole = req.userRole; // Assuming role is attached in verifyToken

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }

    next();
  };
}

module.exports = { verifyToken, verifyRole };
