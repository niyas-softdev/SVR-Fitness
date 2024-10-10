const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const userModel = require('../models/userModel'); // Adjust path as needed
const JWT_SECRET = process.env.JWT_SECRET;

// Check if JWT_SECRET is defined
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined. Please set it in the .env file.");
}

// Configure options for JWT Strategy
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
};

// Define the JWT Strategy
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        // Log payload for debugging
        console.log("JWT Payload:", jwt_payload);
        
        // Find user by ID from payload
        const user = await userModel.findById(jwt_payload._id);
        
        if (user) {
            // If user found, pass user object to done callback
            return done(null, user);
        } else {
            // If user not found, pass false to done callback
            return done(null, false, { message: 'User not found' });
        }
    } catch (err) {
        // If there's an error, pass error to done callback
        return done(err, false);
    }
}));

module.exports = passport;
