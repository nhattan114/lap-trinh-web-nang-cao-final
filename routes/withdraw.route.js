var express = require("express");
var router = express.Router();

const {
  renderWithdraw,
  handleWithdraw,
  getWithdrawByUser,
} = require("../controllers/withdraw.controller");

const { withdrawValidator } = require("../validations/account");

router.get("/", renderWithdraw);
router.post("/", withdrawValidator, handleWithdraw);
router.get('/api', getWithdrawByUser)

module.exports = router;
