const _ = require("lodash");

let success = (response, data, message, status = 200) => {
  let successResponse = {
    message: message,
    status: true,
  };
  if (data) {
    _.extend(successResponse, {
      data: data,
    });
  }
  response.status(status).json(successResponse);
};

let fail = (response, err, status = 404) => {
  if (typeof err === "object" && err.message) {
    message = err.message;
  } else {
    message = err;
  }
  response.status(status).json({
    message: message,
    status: false,
  });
};

module.exports = {
  success: success,
  fail: fail,
};
