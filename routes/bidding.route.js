const express = require("express");
const router = express.Router();
const biddingController = require("../controllers").bidding;

router.post("/create", biddingController.addBid);

router.put("/update-status/:bidId", biddingController.updateBidStatus);

router.put("/accept-bid", biddingController.acceptBid);

module.exports = router;
