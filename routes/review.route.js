const express = require("express");
const { authenticate } = require("../middlewares/auth");
const router = express.Router();
const reviewController = require("../controllers").review;

router.post("/submit", authenticate , reviewController.submitReview);

router.get("/lawyer/:id", reviewController.getLawyerReviews);

module.exports = router;
