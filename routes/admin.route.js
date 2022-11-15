var express = require("express");
const {
  getAdminHome,
  handleAdminUserAccount,
  handleAccountApi,
  handleAccountStatus,
  getDepositMore5m,
  postDepositMore5m,
  getWithdrawMore5m,
  postWithdrawMore5m,
  apiGetWithdrawMore5m,
  apiGetTransHistory,
  getTransHistory,
  getTransHistoryDetail,
  postRejectDeposit5m,
  getWithdrawDetail,
  getDepositDetail,
  handleAdminUserAccountDetail,
  handleAdminLogout,
} = require("../controllers/admin.controller");
const { adminWithdrawValidator } = require("../validations/account");
var router = express.Router();

/* GET users listing. */
router.get("/", getAdminHome);

router.get("/account", handleAdminUserAccount);
router.get("/account/api", handleAccountApi);
router.get("/account/:username", handleAdminUserAccountDetail);

router.put("/account", handleAccountStatus);


router.get("/deposit", getDepositMore5m);
router.get("/deposit/:id", getDepositDetail);
router.post("/deposit", postDepositMore5m);
router.post("/deposit2", postRejectDeposit5m);

router.get("/trans-history", getTransHistory);
router.get("/trans-history/:choice", apiGetTransHistory);
router.get("/trans-history/:choice/:id", getTransHistoryDetail);

router.get("/withdraw/api", apiGetWithdrawMore5m);
router.get("/withdraw", getWithdrawMore5m);
router.post("/withdraw", adminWithdrawValidator, postWithdrawMore5m);
router.get("/withdraw/:id", getWithdrawDetail);

router.get("/logout", handleAdminLogout)

// * withdraw detail
module.exports = router;
