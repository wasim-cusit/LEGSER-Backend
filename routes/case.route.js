const express = require("express");
const router = express.Router();
const caseController = require("../controllers").case;
const { schemaValidator } = require("../middlewares");
const { caseSchema } = require("../validationSchemas/case");
const { authenticate } = require("../middlewares/auth");

router.post(
  "/create",
  authenticate,
  schemaValidator(caseSchema),
  caseController.addCase
);

router.get("/list", caseController.getCases);

// router.get("/my-cases", authenticate, caseController.getMyCases);

router.get("/detail/:id", caseController.getCaseById);

router.put("/update/:caseId", authenticate, caseController.updateCase);

router.delete("/delete/:id", caseController.deleteCase);

module.exports = router;
