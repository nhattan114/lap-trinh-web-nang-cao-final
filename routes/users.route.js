var express = require("express");
const { getTransHistoryDetail } = require("../controllers/admin.controller");
var router = express.Router();
const multer = require("multer");
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const upload = multer({ storage: fileStorageEngine });

const {
  resetPasswordGet,
  requestOtpToMail,
  sendOtp,
  sendOtpPost,
  changePassGet,
  changePassPost,
  resendOtpPost,
  handleLogin,
  handleRegister,
  handleChangePassword,
  logoutGet,
  profileGet,
  cardGet,
  cardPost,
  firstLoginGet,
  handleFirstLogin,
  getRechargeByUser,
  profilePostCMND,
  resetPassGet,
} = require("../controllers/users.controller");
const {
  changePassValidator,
  requestOtpToMailValidator,
  loginValidator,
  firstLoginValidator,
  rechargeValidator,
} = require("../validations/account");
const { profilePostCMNDValidation } = require("../validations/profile");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/login", function (req, res, next) {
  if(req.userClaims){
     res.redirect("/")
  }
  res.render("account/login", { title: "Login" });
});

router.get("/register", function (req, res, next) {
  if(req.userClaims){
     res.redirect("/")
  }
  res.render("account/register", { title: "Register" });
});

router.get("/trans-history", function (req, res, next) {
  res.render("account/trans_history", { title: "Transaction History" });
});

router.get("/logout", logoutGet);

// * POST /login
router.post("/login", loginValidator, handleLogin);

// *POST /register
router.post("/register", handleRegister);

// * GET /change-password
router.get("/change-password", changePassGet);

// * POST /change-password
router.post("/change-password", changePassValidator, handleChangePassword);

// * GET /first-login
router.get("/first-login", firstLoginGet);

router.post("/first-login", firstLoginValidator, handleFirstLogin);

router.get("/account/resetpassword", resetPasswordGet);
router.post(
  "/account/resetpassword",
  requestOtpToMailValidator,
  requestOtpToMail
);

router.get("/account/resetpassword/sendOtp", sendOtp);
router.post("/account/resetpassword/sendOtpPost", sendOtpPost);

router.get("/account/resetpassword/changepassword", resetPassGet);
router.post("/account/resetpassword/changepassword", changePassPost);

router.post("/account/resetpassword/resendOtpPost", resendOtpPost);

router.get("/profile", profileGet);

// router.post(
//   "/profile",
//   upload.array("images", 2),
//   profilePostCMNDValidation,
//   profilePostCMND
// );
//test git 
router.post(
  "/profile",
  profilePostCMND
);

router.get("/card", cardGet);
router.post("/card", rechargeValidator, cardPost);
router.get("/card/api", getRechargeByUser);

module.exports = router;
