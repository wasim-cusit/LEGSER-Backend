const { Op } = require("sequelize");
const { ROLES, CASE_STATUS } = require("../config/constant");
const responseHelper = require("../helpers/response.helper");
const { User, Bidding, Case } = require("../models");
const { getHashValue, signAccessToken } = require("../helpers/hash.helper");


const ping = async (req, res) => {
  try {
    const userId = req.user.id;

    await User.update(
      { is_online: true, last_seen: new Date() },
      { where: { id: userId } }
    );

    return responseHelper.success(res, {}, "Ping received", 200);
  } catch (error) {
    return responseHelper.fail(res, error.message, 500);
  }
};

const getDashboardData = async (req, res) => {
  try {
    const verifiedLawyers = await User.count({
      where: { role: ROLES.LAWYER, status: true },
    });

    const unVerifiedLawyers = await User.count({
      where: { role: ROLES.LAWYER, status: false },
    });

    const totalClients = await User.count({
      where: { role: ROLES.CLIENT },
    });

    // Fixed Case Queries: Removed incorrect `role: ROLES.LAWYER`
    const openCases = await Case.count({
      where: { status: CASE_STATUS.OPEN },
    });

    const ongoingCases = await Case.count({
      where: { status: CASE_STATUS.ONGOING },
    });

    const closedCases = await Case.count({
      where: { status: CASE_STATUS.CLOSED },
    });

    // Return a properly formatted response
    return responseHelper.success(
      res,
      {
        verifiedLawyers,
        unVerifiedLawyers,
        totalClients,
        openCases,
        ongoingCases,
        closedCases,
      },
      "Dashboard fetched successfully",
      200
    );
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return responseHelper.fail(res, error.message, 500);
  }
};

const getLawyers = async (req, res) => {
  try {
    const lawyers = await User.findAll({
      where: { role: ROLES.LAWYER },
      order: [["createdAt", "DESC"]],
    });

    return responseHelper.success(
      res,
      lawyers,
      "Lawyer fetched successfully",
      200
    );
  } catch (error) {
    console.error("Error fetching lawyers:", error);
    return responseHelper.fail(res, error.message, 500);
  }
};

const getClients = async (req, res) => {
  try {
    const clients = await User.findAll({
      where: { role: ROLES.CLIENT },
      order: [["createdAt", "DESC"]],
    });

    return responseHelper.success(
      res,
      clients,
      "Lawyer fetched successfully",
      200
    );
  } catch (error) {
    console.error("Error fetching lawyers:", error);
    return responseHelper.fail(res, error.message, 500);
  }
};

const getActiveLawyers = async (req, res) => {
  try {
    const lawyers = await User.findAll({
      where: { role: ROLES.LAWYER, status: true },
      order: [["createdAt", "DESC"]],
    });

    return responseHelper.success(
      res,
      lawyers,
      "Lawyer fetched successfully",
      200
    );
  } catch (error) {
    console.error("Error fetching lawyers:", error);
    return responseHelper.fail(res, error.message, 500);
  }
};

const lawyerProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const lawyer = await User.findOne({ where: { id, role: ROLES.LAWYER } });

    if (!lawyer) {
      return responseHelper.fail(res, "Lawyer not found", 404);
    }

    const Bids = await Bidding.findAll({
      include: [
        {
          model: Case,
          foreignKey: "case_id",
          as: "case",
        },
      ],
      where: { lawyer_id: id },
      order: [["createdAt", "DESC"]],
    });

    const caseIds = Bids.map((bidItem) => bidItem.case_id);

    const pendingCases = await Case.findAll({
      where: {
        id: {
          [Op.in]: caseIds,
        },
        status: CASE_STATUS.ONGOING,
      },
    });

    const completedCases = await Case.findAll({
      where: {
        id: {
          [Op.in]: caseIds,
        },
        status: CASE_STATUS.CLOSED,
      },
    });

    const lawyerProfile = {};
    lawyerProfile.lawyerInfo = lawyer;
    lawyerProfile.cases = {
      pendingCases,
      completedCases,
    };

    lawyerProfile.bids = Bids;
    return responseHelper.success(
      res,
      lawyerProfile,
      "Lawyer fetched successfully",
      200
    );
  } catch (error) {
    console.error("Error fetching lawyer profile:", error);
    return responseHelper.fail(res, error.message, 500);
  }
};

const updateLawyerProfile = async (req, res) => {
  try {
    const { id } = req.user;

    // Update the user
    await User.update({ ...req.body }, { where: { id } });

    // Fetch the updated user
    const updatedUser = await User.findByPk(id);

    // Create a new token with updated data
    const token = await signAccessToken({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      profile_picture: updatedUser.profile_picture,
    });

    return responseHelper.success(
      res,
      { token },
      "Lawyer profile updated successfully",
      200
    );
  } catch (error) {
    console.error("Error updating lawyer profile:", error);
    return responseHelper.fail(res, error.message, 500);
  }
};


const clientProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await User.findOne({ where: { id, role: ROLES.CLIENT } });

    if (!client) {
      return responseHelper.fail(res, "Client not found", 404);
    }

    const Cases = await Case.findAll({
      where: { client_id: id },
    });

    const caseIds = Cases.map((caseItem) => caseItem.id);

    // Fetch bids related to those cases
    const Bids = await Bidding.findAll({
      include: [
        {
          model: Case,
          foreignKey: "case_id",
          as: "case",
        },
        {
          model: User,
          foreignKey: "lawyer_id",
          as: "lawyer",
        },
      ],
      where: {
        case_id: {
          [Op.in]: caseIds,
        },
      },
      order: [
        ["createdAt", "DESC"],
        ["case", "title", "ASC"],
      ],
    });

    const BidsGroupedByCase = {};

    Bids.forEach((bid) => {
      const caseId = bid.case.id;

      if (!BidsGroupedByCase[caseId]) {
        BidsGroupedByCase[caseId] = {
          ...bid.case.dataValues,
          bids: [],
        };
      }
      delete bid.case;
      BidsGroupedByCase[caseId].bids.push(bid);
    });

    const clientProfile = {};
    clientProfile.clientInfo = client;
    clientProfile.cases = Cases;
    clientProfile.bids = Object.values(BidsGroupedByCase);

    return responseHelper.success(
      res,
      clientProfile,
      "Client fetched successfully",
      200
    );
  } catch (error) {
    console.error("Error fetching client:", error);
    return responseHelper.fail(res, error.message, 500);
  }
};

const updateClientProfile = async (req, res) => {
  try {
    const { id } = req.user;

    // Update client profile
    await User.update({ ...req.body }, { where: { id } });

    // Fetch updated user
    const updatedUser = await User.findByPk(id);

    // Sign a new token
    const token = await signAccessToken({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      profile_picture: updatedUser.profile_picture,
    });

    return responseHelper.success(
      res,
      { token },
      "Client profile updated successfully",
      200
    );
  } catch (error) {
    console.error("Error updating client profile:", error);
    return responseHelper.fail(res, error.message, 500);
  }
};


const updateProfileImage = async (req, res) => {
  try {
    const { id } = req.user;

    // Extract file path
    const profilePicture =
      req.files && req.files.profile_picture
        ? req.files.profile_picture[0].path
        : null;

    if (!profilePicture) {
      return responseHelper.fail(res, "Image not found!", 400);
    }

    // Update profile picture in DB
    await User.update(
      { profile_picture: profilePicture },
      { where: { id } }
    );

    // Fetch updated user
    const updatedUser = await User.findByPk(id);

    // Sign new token with updated info
    const token = await signAccessToken({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      profile_picture: updatedUser.profile_picture,
    });

    // Return updated token and message
    return responseHelper.success(
      res,
      { token },
      "Profile image updated successfully",
      201
    );
  } catch (error) {
    return responseHelper.fail(res, error.message, 500);
  }
};

const changeStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;

    if (!userId || status === undefined) {
      return responseHelper.fail(res, "User ID and status are required", 400);
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return responseHelper.fail(res, "User not found", 404);
    }

    await user.update({ status });

    return responseHelper.success(
      res,
      user,
      "Status updated successfully",
      200
    );
  } catch (error) {
    return responseHelper.fail(res, error.message, 500);
  }
};

const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({
      where: { email: process.env.ADMIN_EMAIL },
    });

    if (!adminExists) {
      const hashedPassword = await getHashValue(process.env.ADMIN_PASSWORD);

      await User.create({
        name: "Admin",
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
        phone_number: "0000000000",
        address: "Admin Address",
        specialization: JSON.stringify(["Admin Management"]),
        experience: 10,
        profile_picture: "",
        certificate: null,
        cnic: "0000000000000",
        gender: "Other",
        languages_spoken: "English",
        city: "System",
        profession: "System Admin"
      });
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};


module.exports = {
  ping,
  getLawyers,
  lawyerProfile,
  updateLawyerProfile,
  clientProfile,
  updateClientProfile,
  updateProfileImage,
  createAdminUser,
  getDashboardData,
  changeStatus,
  getClients,
  getActiveLawyers,
};
