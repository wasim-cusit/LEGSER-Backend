const responseHelper = require("../helpers/response.helper");
const { Feedback } = require("../models");

const addFeedback = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const isMessageExist = await Feedback.findOne({
      where: { email, message },
    });

    if (isMessageExist) {
      return responseHelper.fail(res, "Message already submitted", 404);
    }

    await Feedback.create(req.body);

    return responseHelper.success(res, [], "Messgae send successfully", 200);
  } catch (error) {
    console.error("Error submitting messgae:", error);
    return responseHelper.fail(res, error.message, 500);
  }
};

const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({
      order: [["createdAt", "DESC"]],
    });

    return responseHelper.success(
      res,
      feedbacks,
      "Feedbacks fetched successfully",
      200
    );
  } catch (error) {
    console.error("Error fetching Feedbacks:", error);
    return responseHelper.fail(res, error.message, 500);
  }
};

const deleteFeedbacks = async (req, res) => {
  try {
    const { id } = req.params;

    const isFeedbackExist = await Feedback.findByPk(id);

    if (!isFeedbackExist) {
      return responseHelper.fail(res, "Record not found", 404);
    }

    await Feedback.destroy({ where: { id } });

    return responseHelper.success(res, {}, "Deleted successfully", 200);
  } catch (error) {
    console.error("Error :", error);
    return responseHelper.fail(res, error.message, 500);
  }
};

module.exports = { getFeedbacks, addFeedback, deleteFeedbacks };
