const jwt = require("jsonwebtoken");
const response = require("../helpers/response.helper");
const { User } = require("../models");
const { ROLES } = require("../config/constant");

module.exports.authenticate = async (req, res, next) => {
  const authorization = req.header("Authorization");
  if (!authorization) {
    return response.fail(res, "Token is missing", 401);
  }

  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      where: {
        id: decoded.id,
      },
    });
    if (!user) {
      return response.fail(res, "Account not found", 404);
    }
    if (!user.status && user.role === ROLES.LAWYER) {
      return response.fail(
        res,
        "Your account is under review. Once approved, you will be able to take action.",
        403
      );
    }

    if (!user.status) {
      return response.fail(
        res,
        "Your account has been deactivated by the admin.",
        403
      );
    }

    req.user = user;
    next();
  } catch (err) {
    return response.fail(res, err.message, 401);
  }
};
