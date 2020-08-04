const planController = require("./plan.controller");
const express = require("express");
const router = express.Router();

router.post("/plan/creat", planController.createPlan);
router.get("/plan/list", planController.listPlan);


module.exports = router;
