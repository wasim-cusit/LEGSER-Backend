const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

module.exports.getHashValue = async (value) => {
  const salt = await bcrypt.genSalt(10);
  const hashValue = await bcrypt.hash(String(value), salt);
  return hashValue;
};

module.exports.isHashMatch = async (plainPassword, hashedPassword = "") => {
  const passwordToCompare = hashedPassword || "abc";
  const isMatch = await bcrypt.compare(plainPassword, passwordToCompare);
  return isMatch;
};

module.exports.signAccessToken = async (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    profile_picture: user.profile_picture,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

module.exports.generateResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  return resetToken;
};

module.exports.verifyResetToken = (token, hashedToken) => {
  const hashedInputToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  return hashedInputToken === hashedToken;
};
