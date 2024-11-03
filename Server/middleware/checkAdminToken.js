const jwt = require('jsonwebtoken');

function checkAdminToken(req, res, next) {
  try {
    const adminAuthToken = req.cookies.adminAuthToken;

    if (!adminAuthToken) {
      return res
        .status(401)
        .json({ message: 'Authentication failed: No token provided', ok: false });
    }

    jwt.verify(adminAuthToken, process.env.JWT_ADMIN_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ message: 'Authentication failed: Invalid token', ok: false });
      }

      // If valid, store the admin ID in the request object for further use
      req.adminId = decoded.adminId;
      next();
    });
  } catch (error) {
    console.error('Error verifying admin token:', error);
    res.status(500).json({ message: 'Internal server error', ok: false });
  }
}

module.exports = checkAdminToken;
