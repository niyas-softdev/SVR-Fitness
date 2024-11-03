const jwt = require("jsonwebtoken");
const UserModal = require("../models/userModel");
const dev = process.env.NODE_ENV || "development";

const generateJWT = (_id, role, ip, secret, expirationTime) => {
  return jwt.sign(
    {
      _id,
      role,
      ip
    },
    secret,
    { expiresIn: expirationTime }
  );
};

const clearTokens = async (req, res) => {
  try {
    const { signedCookies = {} } = req;
    const { ACrefreshToken } = signedCookies;
    if (ACrefreshToken) {
      // Find the user by ACrefreshToken
      const user = await UserModal.findOne({ ACrefreshToken });
      if (user) {
        // Clear ACrefreshToken and ACexpiresAt fields
        user.ACrefreshToken = null;
        user.ACaccessToken = null;
        user.ACrefreshTokenExpiresAt = null;
        user.ACaccessTokenExpiresAt = null;
        user.ip = null;
        await user.save();
      }
    }
    res.clearCookie("ACrefreshToken", {
      httpOnly: true,
      secure: !dev,
      signed: true
    });
  } catch (error) {
    // Handle error, perhaps log it
    console.error(error);
    // You might still want to clear the cookie even if there's an error
    res.clearCookie("ACrefreshToken", {
      httpOnly: true,
      secure: !dev,
      signed: true
    });
  }
};

module.exports = {
  generateJWT,
  clearTokens
};
