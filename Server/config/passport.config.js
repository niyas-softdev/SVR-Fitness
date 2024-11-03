const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const UserModel = require("../models/userModel"); // Adjust path if needed
const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Ensure JWT_SECRET is set
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

// JWT options
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
};

// JWT Strategy
passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await UserModel.findById(jwt_payload.userId);
      console.log("User from DB:", user); // Verify if user is found

      if (!user) {
        console.log("User not found:", jwt_payload.userId);
        return done(null, false, { message: "User not found" });
      }

      if (!["admin", "user"].includes(user.role)) {
        console.log("Invalid role:", user.role);
        return done(null, false, { message: "Invalid role" });
      }

      return done(null, user);
    } catch (error) {
      console.error("Error during authentication:", error);
      return done(error, false);
    }
  })
);

module.exports = passport;
