const express = require("express");
const { authenticate } = require("../middlewares/auth");
const { UploadFile } = require("../middlewares/uploader");
const router = express.Router();
const userController = require("../controllers").user;

router.post("/ping", authenticate, userController.ping);

router.get("/get-dashboard-data", userController.getDashboardData);

router.get("/lawyer/list", userController.getActiveLawyers);

router.get("/lawyer/profile/:id", userController.lawyerProfile);

router.put(
  "/lawyer/profile/update",
  authenticate,
  userController.updateLawyerProfile
);

router.get("/client/list", userController.getClients);

router.put(
  "/client/profile/update",
  authenticate,
  userController.updateClientProfile
);
router.get("/client/profile/:id", userController.clientProfile);

// router.get("/admin/client/list", userController.getClients);
router.get("/admin/lawyer/list", userController.getLawyers);

router.put("/change-status", authenticate, userController.changeStatus);

router.put(
  "/update-profile-image",
  UploadFile(),
  authenticate,
  userController.updateProfileImage
);

module.exports = router;
