const { Op } = require("sequelize");
const responseHelper = require("../helpers/response.helper");
const { Bidding, Case, User, Chat } = require("../models");
const { Bid_STATUS, CASE_STATUS } = require("../config/constant");

const addBid = async (req, res) => {
  try {
    const { caseId, description } = req.body;
    const userId = req.user.id;

    // Fetch the case to get existing total_bids
    const caseData = await Case.findOne({
      where: { id: caseId },
    });

    if (!caseData) {
      return responseHelper.fail(res, "Case not found", 404);
    }

    // Ensure total_bids is an array (Handle potential null cases)
    let IsBidExist = await Bidding.findOne({
      where: { case_id: caseId, lawyer_id: userId },
    });

    // Check if the user has already bid
    if (IsBidExist) {
      return responseHelper.fail(
        res,
        "You have already submitted a bid for this case",
        409
      );
    }

    // Update the case with the new total_bids array
    await Case.update(
      { total_bids: caseData.total_bids + 1 },
      { where: { id: caseId } }
    );

    // Create a new bid record
    await Bidding.create({
      case_id: caseId,
      description,
      lawyer_id: userId,
    });

    return responseHelper.success(res, [], "Bid submitted successfully", 200);
  } catch (error) {
    console.error("Error submitting bid:", error);
    return responseHelper.fail(res, error.message, 500);
  }
};

const updateBidStatus = async (req, res) => {
  try {
    const { bidId } = req.params;

    await Bidding.update(
      { bid_status: Bid_STATUS.SEEN },
      { where: { id: bidId, bid_status: { [Op.ne]: Bid_STATUS.ACCEPTED } } }
    );

    return responseHelper.success(
      res,
      [],
      "Bid status updated successfully",
      200
    );
  } catch (error) {
    console.error("Error :", error);
    return responseHelper.fail(res, error.message, 500);
  }
};

const acceptBid = async (req, res) => {
  try {
    const { senderId, receiverId, message, caseId, bidId } = req.body;

    await Bidding.update(
      { bid_status: Bid_STATUS.DEACTIVATED },
      { where: { case_id: caseId } }
    );
    await Bidding.update(
      { bid_status: Bid_STATUS.ACCEPTED },
      { where: { id: bidId} }
    );
    await Case.update(
      { status: CASE_STATUS.ONGOING },
      { where: { id: caseId} }
    );    

    await Chat.create({ senderId, receiverId, message });

    return responseHelper.success(
      res,
      [],
      "Bid accepted successfully",
      200
    );
  } catch (error) {
    console.error("Error :", error);
    return responseHelper.fail(res, error.message, 500);
  }
};

module.exports = { addBid, updateBidStatus, acceptBid };
