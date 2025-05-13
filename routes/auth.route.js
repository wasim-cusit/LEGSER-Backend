const express = require("express");
const router = express.Router();
const authController = require("../controllers/").auth;
const { schemaValidator } = require("../middlewares");
const { loginSchema, registerSchema } = require("../validationSchemas/auth");
const { authenticate } = require("../middlewares/auth");
const { UploadFile } = require("../middlewares/uploader");


// router.post("/register", UploadFile, authController.signup);
router.post("/register", UploadFile(), authController.signup);

router.post("/login", schemaValidator(loginSchema), authController.login);

router.post("/change-password", authenticate, authController.changePassword);

module.exports = router;
