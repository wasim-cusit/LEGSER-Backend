const express = require("express");
const { authenticate } = require("../middlewares/auth");
const router = express.Router();

router.use("/auth", require("./auth.route"));
router.use("/case", require("./case.route"));
router.use("/user", require("./user.route"));
router.use("/bid", authenticate, require("./bidding.route"));
router.use("/feedback", authenticate, require("./feedback.route"));
router.use("/review", require("./review.route"));
router.use("/chat", authenticate, require("./chat.route"));

module.exports = router;
