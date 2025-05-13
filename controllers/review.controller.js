const { CASE_STATUS } = require("../config/constant");
const responseHelper = require("../helpers/response.helper");
const { Review, Case, User } = require("../models");

const submitReview = async (req, res) => {
  try {
    const { lawyer_id, case_id, rating, message } = req.body;
    const client_id = req.user.id;

    await Review.create({
      lawyer_id,
      message,
      rating,
      client_id,
    });

    await Case.update(
      { status: CASE_STATUS.CLOSED, assignedLawyer_id: lawyer_id },
      { where: { id: case_id } }
    );

    return responseHelper.success(
      res,
      [],
      "Review submitted successfully",
      200
    );
  } catch (error) {
    console.error("Error submitting review:", error);
    return responseHelper.fail(res, error.message, 500);
  }
};

const getLawyerReviews = async (req, res) => {
  try {
    const { id } = req.params;

    const reviews = await Review.findAll({
      where: { lawyer_id: id },
      include: [
        {
          model: User,
          as: "client",
          attributes: ["id", "name", "profile_picture"],
        },
      ],
      order: [["createdAt", "DESC"]], // Optional: latest first
    });

    return responseHelper.success(
      res,
      reviews,
      "Reviews fetched successfully",
      200
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return responseHelper.fail(res, error.message, 500);
  }
};

module.exports = { submitReview, getLawyerReviews };
