var express = require("express");
var router = express.Router();

const {
  renderRecharge,
  handleRecharge,
} = require("../controllers/recharge.controller");

const { rechargeValidator } = require("../validations/account");

router.get("/", renderRecharge);
router.post("/", rechargeValidator, handleRecharge);

module.exports = router;
