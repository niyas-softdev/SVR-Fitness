// utils/generateUserId.js
const User = require('../models/userModel');

// Generate a new user ID in the format SVR-01, SVR-02, etc.
async function generateUserId() {
  try {
    // Find the latest user based on the highest userId
    const latestUser = await User.findOne().sort({ userId: -1 }).exec();
    let nextIdNumber = 1;

    if (latestUser && latestUser.userId) {
      // Extract the number part of the userId (e.g., SVR-05 -> 5)
      const latestIdNumber = parseInt(latestUser.userId.split('-')[1], 10);
      nextIdNumber = latestIdNumber + 1;
    }

    // Return the new userId in the format SVR-01, SVR-02, etc.
    return `SVR-${String(nextIdNumber).padStart(2, '0')}`;
  } catch (error) {
    throw new Error("Error generating User ID");
  }
}

module.exports = generateUserId;
