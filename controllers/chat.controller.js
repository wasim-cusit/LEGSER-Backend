const { Chat, User, Bidding, Case } = require("../models");
const { Sequelize, Op } = require("sequelize");
const responseHelper = require("../helpers/response.helper");
const { ROLES, Bid_STATUS, CASE_STATUS } = require("../config/constant");

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    const msg = await Chat.create({ senderId, receiverId, message });

    return responseHelper.success(res, msg, "Message sent successfully", 200);
  } catch (error) {
    console.error("Send message error:", error);
    return responseHelper.fail(res, error.message, 500);
  }
};

const getPartners = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findByPk(id);

    if (!user) {
      return responseHelper.fail(res, "User not found", 404);
    }

    const grouped = new Map();

    if (user.role === ROLES.CLIENT) {
      const bids = await Bidding.findAll({
        include: [
          {
            model: Case,
            as: "case",
            where: {
              client_id: user.id,
            },
            attributes: ["id", "title", "status"],
            required: true,
          },
          {
            model: User,
            as: "lawyer",
            attributes: [
              "id",
              "name",
              "email",
              "profile_picture",
              "is_online",
              "last_seen",
            ],
          },
        ],
        where: { bid_status: Bid_STATUS.ACCEPTED },
        attributes: [],
      });

      bids.forEach((bid) => {
        const partner = bid.lawyer;
        const caseData = bid.case;

        if (!grouped.has(partner.id)) {
          grouped.set(partner.id, {
            ...partner.dataValues,
            cases: [],
          });
        }
        grouped.get(partner.id).cases.push(caseData);
      });
    }

    if (user.role === ROLES.LAWYER) {
      const bids = await Bidding.findAll({
        include: [
          {
            model: Case,
            as: "case",
            attributes: ["id", "title", "status"],
            include: [
              {
                model: User,
                as: "client",
                attributes: [
                  "id",
                  "name",
                  "email",
                  "profile_picture",
                  "is_online",
                  "last_seen",
                ],
              },
            ],
          },
        ],
        where: {
          bid_status: Bid_STATUS.ACCEPTED,
          lawyer_id: user.id,
        },
        attributes: [],
      });

      bids.forEach((bid) => {
        const partner = bid.case?.client;
        const caseData = bid.case;

        if (partner) {
          if (!grouped.has(partner.id)) {
            grouped.set(partner.id, {
              ...partner.dataValues,
              cases: [],
            });
          }
          grouped.get(partner.id).cases.push(caseData);
        }
      });
    }

    const result = Array.from(grouped.values());

    return responseHelper.success(
      res,
      result,
      "Partners with cases fetched",
      200
    );
  } catch (error) {
    console.error("Get partners error:", error);
    return responseHelper.fail(res, error.message, 500);
  }
};

const getMessages = async (req, res) => {
  try {
    const { partnerId } = req.query;
    const myId = req.user.id;

    if (!partnerId) {
      return responseHelper.fail(res, "Partner ID is required", 400);
    }

    const messages = await Chat.findAll({
      where: {
        [Op.or]: [
          { senderId: myId, receiverId: partnerId },
          { senderId: partnerId, receiverId: myId },
        ],
      },
      order: [["createdAt", "ASC"]],
    });

    await Chat.update(
      { seen: true },
      {
        where: {
          senderId: partnerId,
          receiverId: myId,
          seen: false,
        },
      }
    );

    const filteredMessages = messages.filter(
      (m) =>
        !(
          (m.senderId === myId && m.deletedBySender) ||
          (m.receiverId === myId && m.deletedByReceiver)
        )
    );

    return responseHelper.success(
      res,
      filteredMessages,
      "Messages fetched and seen status updated successfully",
      200
    );
  } catch (error) {
    console.error("Get messages error:", error);
    return responseHelper.fail(res, "Failed to fetch messages", 500);
  }
};

// Mark message as seen
const markSeen = async (req, res) => {
  try {
    const { messageId } = req.params;
    await Chat.update({ seen: true }, { where: { id: messageId } });

    return responseHelper.success(res, [], "Message marked as seen", 200);
  } catch (error) {
    console.error("Mark seen error:", error);
    return responseHelper.fail(res, error.message, 500);
  }
};

// Delete message for me
const deleteForMe = async (req, res) => {
  try {
    const { messageId, userId } = req.body;
    const message = await Chat.findByPk(messageId);

    if (!message) {
      return responseHelper.fail(res, "Message not found", 404);
    }

    if (message.senderId == userId) {
      message.deletedBySender = true;
    } else if (message.receiverId == userId) {
      message.deletedByReceiver = true;
    }

    await message.save();

    return responseHelper.success(res, [], "Message deleted for you", 200);
  } catch (error) {
    console.error("Delete for me error:", error);
    return responseHelper.fail(res, error.message, 500);
  }
};

// Delete for everyone
const deleteForEveryone = async (req, res) => {
  try {
    const { messageId } = req.body;
    await Chat.destroy({ where: { id: messageId } });

    return responseHelper.success(res, [], "Message deleted for everyone", 200);
  } catch (error) {
    console.error("Delete for everyone error:", error);
    return responseHelper.fail(res, error.message, 500);
  }
};

// Clear chat
const clearChat = async (req, res) => {
  try {
    const { userId, otherUserId } = req.body;

    const messages = await Chat.findAll({
      where: {
        [Sequelize.Op.or]: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
    });

    for (let message of messages) {
      if (message.senderId == userId) message.deletedBySender = true;
      if (message.receiverId == userId) message.deletedByReceiver = true;
      await message.save();
    }

    return responseHelper.success(res, [], "Chat cleared", 200);
  } catch (error) {
    console.error("Clear chat error:", error);
    return responseHelper.fail(res, error.message, 500);
  }
};

// Export all
module.exports = {
  sendMessage,
  getMessages,
  markSeen,
  deleteForMe,
  deleteForEveryone,
  clearChat,
  getPartners,
};
