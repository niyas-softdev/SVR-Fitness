const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const ms = require("ms");
const { generateJWT } = require("../utils/generate&ClearTokens");
const { decrypt, encrypt } = require("../utils/encryptDecrypt");
const UserModal = require("../models/userModel");

const {
  ACCESS_TOKEN_LIFE,
  REFRESH_TOKEN_LIFE,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  NODE_ENV
} = process.env;
const dev = NODE_ENV === "development";

const generateAuthTokens = async (req, res, next) => {
  // console.log("NODE_ENV --------------> ", dev);
  try {
    const user = await UserModal.findById(req._id);
    if (!user) {
      const error = createError.NotFound("User not found");
      throw error;
    }

    const ip = req.ip;
    // console.log("<><><>><><><><><", ip);

    const ACrefreshToken = generateJWT(
      req._id,
      req.role,
      ip,
      REFRESH_TOKEN_SECRET,
      REFRESH_TOKEN_LIFE
    );

    const accessToken = generateJWT(
      req._id,
      req.role,
      ip,
      ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_LIFE
    );

    // Update user document with refresh token and expiration time
    user.ACaccessToken = "Bearer " + accessToken;
    user.ACrefreshToken = ACrefreshToken;
    user.ACaccessTokenExpiresAt = Date.now() + ms(ACCESS_TOKEN_LIFE);
    user.ACrefreshTokenExpiresAt = Date.now() + ms(REFRESH_TOKEN_LIFE);
    user.ip = ip;
    await user.save();
    res.cookie("ACrefreshToken", ACrefreshToken, {
      httpOnly: true,
      // secure: !dev,
      secure: true,
      signed: true,
      expires: new Date(Date.now() + ms(REFRESH_TOKEN_LIFE)),
      sameSite: "None"
    });

    // Calculate expiration time in user's local time zone
    const accessTokenExpirationTime = new Date(
      Date.now() + ms(ACCESS_TOKEN_LIFE)
    );
    accessTokenExpirationTime.toLocaleString("en-US", {
      timeZone: user.timezone
    });
    const refreshTokenExpirationTime = new Date(
      Date.now() + ms(REFRESH_TOKEN_LIFE)
    );
    refreshTokenExpirationTime.toLocaleString("en-US", {
      timeZone: user.timezone
    });

    // token: "Bearer " + token
    // const encryptedData = encrypt(JSON.stringify(user));

    return res.status(200).json({
      message: "Process Successful",
      return: user
      /*       accessToken: "Bearer " + accessToken,
      accessTokenExpiresAt: accessTokenExpirationTime.toLocaleString(),
      ACrefreshToken: ACrefreshToken,
      ACrefreshTokenExpiresAt: refreshTokenExpirationTime.toLocaleString() */
    });
  } catch (error) {
    return next(error);
  }
};

const isAuthenticated = async (req, res, next) => {
  try {
    const authToken = req.get("Authorization");

    // console.log("authToken: ", authToken);
    const accessToken = authToken?.split("Bearer")[1];
    console.log("accessToken: ", accessToken);
    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized Access Denied.!" });
    }

    const { signedCookies = {} } = req;
    console.log("signedCookies:-----------------------------> ", signedCookies);
    const { ACrefreshToken } = signedCookies;
    if (!ACrefreshToken) {
      return res.status(401).json({ message: "Unauthorized Access Denied..!" });
    }

    const decodedToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    const { _id } = decodedToken;

    // console.log("decodedToken: ", _id);

    const user = await UserModal.findById(_id);

    if (
      !user ||
      user.ACrefreshToken !== ACrefreshToken ||
      user.ACrefreshTokenExpiresAt < Date.now()
    ) {
      return res
        .status(401)
        .json({ message: "Unauthorized Access Denied...!" });
    }

    req._id = user.id;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  generateAuthTokens,
  isAuthenticated
};
