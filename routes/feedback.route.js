const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers").feedback;

router.post("/create", feedbackController.addFeedback);

router.get("/list", feedbackController.getFeedbacks);

router.get(`/delete/:id`, feedbackController.deleteFeedbacks);

module.exports = router;
