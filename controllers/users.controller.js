const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailvalidator = require("email-validator");
const multiparty = require("multiparty");
const validatePhoneNumber = require("validate-phone-number-node-js");
const multer = require("multer");
const fs = require("fs"); //doi file name
let path = require("path");
var nodemailer = require("nodemailer"); // khai báo sử dụng module nodemailer

const {
  handlePostOTP,
  handleSelectOTP,
  handleChangePass,
  getUserByUsername,
  getUserDetailByUserName,
  updatePasswordById,
  createAnAccount,
  putAccCreatedIntoUser,
  getTranSHistoryByUsername,
  increaseLoginAttemptsByUsername,
  updateStatusById,
  updateLoginDateToCurrent,
  getUserIntervalOneMinute,
  updateStatusByUsername,
  updateAbnormal,
  handleSelectFrontCMND,
  handleUpdateFrontCMND,
  handleSelectBackCMND,
  handleUpdateBackCMND,
  getUserNameByPhoneNumber,
  getUserStatusByUserName,
  updateStatusAndLastModifiedByUsername,
  getUsernameByEmail,
  getEmailExistOrNot,
  getEmailPhoneExistOrNot,
} = require("../models/user.model");

const {
  getCardByAll,
  getCardByNumber,
  getCardByUsername,
  addCardByUsername,
  getQuantityCardByUsername,
} = require("../models/credit_card.model");

const { getAllBills } = require("../models/phone_card.model");
const {
  generateRandomPassword,
  generateUsername,
  encodeStatusCode,
  formatDateTime,
  formatDate,
  formatMoney,
} = require("../config/helper");
const { validationResult, check } = require("express-validator");
var nodemailer = require("nodemailer"); // khai báo sử dụng module nodemailer
var smtpTransport = require("nodemailer-smtp-transport");
const { off } = require("../config/db");
const { getAllWithdraws } = require("../models/withdraw.model");
const {
  getAllDeposits,
  getAllDepositsSender,
  getAllDepositsReceiver,
} = require("../models/deposit.model");
const {
  getAllRecharges,
  getRechargeListByUser,
} = require("../models/recharge.model");
const { transporterEmail } = require("../config/email_setup");

const resetPasswordGet = (req, res) => {
  res.render("account/resetpassword", { title: "Reset Password" });
};
const requestOtpToMail = (req, res) => {
  let result = validationResult(req);
  if (result.errors.length === 0) {
    let { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    var transporter = transporterEmail();
    // var transporter = nodemailer.createTransport({
    //   // config mail server
    //   service: "Gmail",
    //   auth: {
    //     user: "nchdang16012001@gmail.com",
    //     pass: "mlrafbeyqtvtqloe",
    //   },
    // });

    // config mail server = mail thầy
    // var transporter = nodemailer.createTransport(smtpTransport({
    //     tls: {
    //         rejectUnauthorized: false
    //     },
    //     host: 'mail.phongdaotao.com',
    //     port: 25,
    //     secureConnection: false,
    //     auth: {
    //         user: 'sinhvien@phongdaotao.com',
    //         pass: 'svtdtu'
    //     }
    // }));

    var mainOptions = {
      // thiết lập đối tượng, nội dung gửi mail
      from: "sinhvien@phongdaotao.com",
      to: email,
      subject: "OTP code",
      html:
        "<p>You have got a code: " +
        otp +
        "<br></br> Code will expired in 1 minute </p>",
    };

    transporter.sendMail(mainOptions, function (err, info) {
      if (err) {
        // console.log(err);
        req.session.flash = {
          type: "danger",
          intro: "Oops!",
          message: "Some thing went wrong",
        };

        res.redirect("/users/account/resetpassword");
      } else {
        //lưu vào db
        let time = Date.now() + 60000;
        let day = new Date(time);
        req.session.email = email;
        handlePostOTP(email, otp, day);
        req.session.flash = {
          type: "success",
          intro: "Congratulation!",
          message:
            "OTP has been sent to your email. Please check your email!!!!",
        };
        res.redirect("/users/account/resetpassword/sendOtp");
      }
    });
  } else {
    const errors = result.mapped();
    let errorMessage = errors[Object.keys(errors)[0]].msg;
    req.session.flash = {
      type: "danger",
      intro: "Oops!",
      message: errorMessage,
    };
    res.redirect("/users/account/resetpassword");
  }
};

const sendOtp = (req, res) => {
  res.render("account/sendOtp", { title: "sendOtp" });
};

const sendOtpPost = async (req, res) => {
  let { otpcode } = req.body;
  let otpdatabase = await handleSelectOTP(req.session.email);
  const result = Object.values(JSON.parse(JSON.stringify(otpdatabase)));
  let rightnow = new Date(Date.now()).getTime();
  let expiredtime = new Date(result[3]).getTime();
  if (otpcode === result[2] && expiredtime > rightnow) {
    req.session.flash = {
      type: "success",
      intro: "Congratulation!",
      message: "OTP is right. Please change your password!!!!",
    };
    res.redirect("/users/account/resetpassword/changepassword");
  } else {
    req.session.flash = {
      type: "danger",
      intro: "Oops!",
      message: "Your OTP not match or OTP expired",
    };
    res.redirect("/users/account/resetpassword/sendOtp");
  }
};
const resetPassGet = (req, res) => {
  res.render("account/changepassword", { title: "changepassword" });
};

const changePassGet = (req, res) => {
  res.render("account/user-change-pw", { title: "changepassword" });
};

const firstLoginGet = (req, res) => {
  let userData = req.userClaims;
  if (userData.status !== -1) {
    // Không phải login lần đầu thì không cho truy cập
    res.redirect("/");
  }
  res.render("account/user-change-pw-first-login", { title: "First Login" });
};

const changePassPost = async (req, res) => {
  try {
    let result = validationResult(req);
    let username = await getUsernameByEmail(req.session.email);
    console.log(username);
    if (result.errors.length === 0) {
      let { newpass, renewpass } = req.body;
      // console.log(password,newpass,renewpass);
      if (newpass !== renewpass || newpass === "" || renewpass === "") {
        req.session.flash = {
          type: "danger",
          intro: "Oops!",
          message: "New password and Renew Password have problem",
        };
        return res.redirect("/users/account/resetpassword/changepassword");
      } else if (await handleChangePass(newpass, username)) {
        req.session.flash = {
          type: "success",
          intro: "Congratulation!",
          message: "Change password successful",
        };
        return res.redirect("/users/login");
      } else {
        req.session.flash = {
          type: "danger",
          intro: "Oops!",
          message: "Some thing went wrong here2",
        };
        return res.redirect("/users/account/resetpassword/changepassword");
      }
    } else {
      const errors = result.mapped();
      let errorMessage = errors[Object.keys(errors)[0]].msg;
      req.session.flash = {
        type: "danger",
        intro: "Oops!",
        message: errorMessage,
      };
      res.redirect("/users/account/resetpassword/changepassword");
    }
  } catch (error) {
    console.log(error);
    return res.redirect("/users/account/resetpassword/changepassword");
  }
};

const resendOtpPost = (req, res) => {
  // let { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  var transporter = transporterEmail();
  // var transporter = nodemailer.createTransport({
  //   // config mail server
  //   service: "Gmail",
  //   auth: {
  //     user: "nchdang16012001@gmail.com",
  //     pass: "mlrafbeyqtvtqloe",
  //   },
  // });
  //mail thầy
  // var transporter = nodemailer.createTransport(
  //   smtpTransport({
  //     // config mail server
  //     tls: {
  //       rejectUnauthorized: false,
  //     },
  //     // service: 'Gmail',
  //     host: "mail.phongdaotao.com",
  //     port: 25,
  //     secureConnection: false,
  //     auth: {
  //       user: "sinhvien@phongdaotao.com",
  //       pass: "svtdtu",
  //     },
  //   })
  // );

  var mainOptions = {
    // thiết lập đối tượng, nội dung gửi mail
    from: "sinhvien@phongdaotao.com",
    to: req.session.email,
    subject: "OTP code",
    html:
      "<p>You have got a code: " +
      otp +
      "<br></br> Code will expired in 1 minute </p>",
  };

  transporter.sendMail(mainOptions, function (err, info) {
    if (err) {
      // console.log(err);
      req.session.flash = {
        type: "danger",
        intro: "Oops!",
        message: "Some thing went wrong",
      };

      res.redirect("/users/account/resetpassword/sendOtp");
    } else {
      //lưu vào db
      let time = Date.now() + 60000;
      let day = new Date(time);
      handlePostOTP(req.session.email, otp, day);
      req.session.flash = {
        type: "success",
        intro: "Congratulation!",
        message:
          "OTP has been resent to your email. Please check your email!!!!",
      };
      res.redirect("/users/account/resetpassword/sendOtp");
    }
  });
};

// GET '/logout'
function logoutGet(req, res) {
  res.clearCookie("accessToken");
  res.redirect("/users/login");
}

// todo POST /users/register
const handleRegister = async (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, async (err, fields, files) => {
    // if (err) return res.status(500).send(err.message);
    if (err) {
      return res.json({
        code: 1,
        message: err.message,
      });
    }
    let checkEP = await getEmailPhoneExistOrNot(fields.email, fields.phone);
    console.log(checkEP !== undefined);
    if (checkEP !== undefined) {
      return res.json({
        code: 1,
        message:
          "Email or Phone has exist. Please register another email or phone!",
      });
    } else {
      const randomUsername = generateUsername(1000000000, 9000000000);
      const randomPassword = generateRandomPassword(6);
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(randomPassword.toString(), salt);

      console.log(fields);
      console.log(files);
      let pathofimage1 =
        Date.now() + "--" + files.front_cmnd[0].originalFilename;
      let imagePath1 = path.join("public", "images", pathofimage1);
      let pathofimage2 =
        Date.now() + "--" + files.back_cmnd[0].originalFilename;
      let imagePath2 = path.join("public", "images", pathofimage2);
      fs.renameSync(files.front_cmnd[0].path, imagePath1);
      fs.renameSync(files.back_cmnd[0].path, imagePath2);

      var transporter = transporterEmail();
      // var transporter = nodemailer.createTransport({
      //   // config mail server
      //   service: "Gmail",
      //   auth: {
      //     user: "nchdang16012001@gmail.com",
      //     pass: "mlrafbeyqtvtqloe",
      //   },
      // });

      // config mail server = mail thầy
      // var transporter = nodemailer.createTransport(smtpTransport({
      //     tls: {
      //         rejectUnauthorized: false
      //     },
      //     host: 'mail.phongdaotao.com',
      //     port: 25,
      //     secureConnection: false,
      //     auth: {
      //         user: 'sinhvien@phongdaotao.com',
      //         pass: 'svtdtu'
      //     }
      // }));

      var mainOptions = {
        // thiết lập đối tượng, nội dung gửi mail
        from: "sinhvien@phongdaotao.com",
        to: fields.email,
        subject: "Your account",
        html:
          "<h2>WELCOME TO OUR BANKING SYSTEM</h2><br></br><p>Your account:<br></br></p>Username: " +
          randomUsername +
          " <br></br>Password: " +
          randomPassword +
          "</p>",
      };

      transporter.sendMail(mainOptions, async function (err, info) {
        if (err) {
          return res.json({
            code: 1,
            message: err.message,
          });
        } else {
          //lưu vào db
          await createAnAccount(
            randomUsername,
            fields.phone,
            fields.email,
            fields.name,
            fields.date_of_birth,
            fields.address,
            pathofimage1,
            pathofimage2
          );
          await putAccCreatedIntoUser(randomUsername, hashPassword);
          console.log(randomPassword);
          console.log(randomUsername);
          return res.json({
            code: 0,
            message:
              "Create account successful. Please check your email to get your account!",
          });
        }
      });
    }
  });
};

// todo POST /users/login
async function handleLogin(req, res, next) {
  // Validation from loginValidator
  let errors = validationResult(req).errors;
  let error = errors[0];

  if (error) {
    return res.json({
      success: false,
      message: error.msg,
    });
  }

  if (req.userClaims) {
    return res.json({
      success: false,
      message: "Already login!",
    });
  }

  let { username, password } = req.body;
  let acc = await getUserByUsername(username);

  if (!acc) {
    return res.json({ success: false, message: "Account not exist!" });
  } else {
    if (acc.login_attempts % 3 === 0 && acc.abnormal === 1) {
      let accIntervalOneMin = await getUserIntervalOneMinute(username);

      if (accIntervalOneMin) {
        return res.json({
          success: false,
          message: "Tài khoản hiện đang tạm khóa, vui lòng thử lại sau 1 phút",
        });
      }
    } else if (acc.abnormal === 2) {
      // Không cho tài khoản bị block login
      return res.json({
        success: false,
        message:
          "Tài khoản đã bị khóa do nhập sai mật khẩu nhiều lần, vui lòng liên hệ quản trị viên để được hỗ trợ",
      });
    } else if (acc.status === 2) {
      // Không cho tài khoản bị vô hiệu hóa login
      return res.json({
        success: false,
        message:
          "Tài khoản này đã bị vô hiệu hóa, xin vui lòng liên hệ tổng đài 18001008",
      });
    }

    const validPassword = await bcrypt.compare(password, acc.password);

    if (!validPassword) {
      // ghi nhận login sai mật khẩu
      await increaseLoginAttemptsByUsername(username);
      await updateLoginDateToCurrent(username);
      //* Automatic lock account feature
      if (acc["login_attempts"] % 3 === 2 && username !== "admin") {
        if (acc.abnormal === 0) {
          await updateAbnormal(username);
          await updateLoginDateToCurrent(username);
          return res.json({
            success: false,
            message:
              "Tài khoản hiện đang tạm khóa, vui lòng thử lại sau 1 phút",
          });
        } else if (acc.abnormal === 1) {
          // Khóa tài khoản chờ quản trị viên duyệt
          await updateAbnormal(username, 2);
          return res.json({
            success: false,
            message:
              "Tài khoản đã bị khóa do nhập sai mật khẩu nhiều lần, vui lòng liên hệ quản trị viên để được hỗ trợ",
          });
        }
      }
      return res.json({ success: false, message: "Incorrect password!" });
    } else {
      let assignData = {
        id: acc.id,
        username: acc.username,
        status: acc.status,
        loginAttempts: acc["login_attempts"],
      };

      let token = assignDataToCookie(res, assignData);

      req.session.flash = {
        type: "success",
        intro: "Congratulation!",
        message: "Login successfully!",
      };

      return res.json({
        success: true,
        message: "Login successful",
        token: token,
        name: acc.username,
        id: acc.id,
      });
    }
  }
}

// * POST /users/change-password
async function handleChangePassword(req, res, next) {
  let errors = validationResult(req).errors;
  let error = errors[0];

  if (error) {
    return res.json({
      success: false,
      message: error.msg,
    });
  }

  let { currentPass, newPass, renewPass } = req.body;

  if (currentPass === newPass) {
    return res.json({
      success: false,
      message: "Current password can't be the same as the new password",
    });
  }

  if (newPass !== renewPass) {
    return res.json({
      success: false,
      message: "re-new password must be the same as the new password",
    });
  }

  let userData = req.userClaims;

  if (!userData) {
    return res.json({
      success: false,
      message: "Please sign in to change your password",
    });
  }
  let acc = await getUserByUsername(userData.username);

  if (!acc) {
    return res.json({ success: false, message: "Account not exist!" });
  } else if (!bcrypt.compareSync(req.body.currentPass, acc.password)) {
    return res.json({
      success: false,
      message: "Current password is incorrect!",
    });
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.newPass, salt);

    await updatePasswordById(acc.id, hashPassword);

    return res.json({
      success: true,
      message: "You have changed your password successfully",
    });
  }
}

// * POST /users/first-login
async function handleFirstLogin(req, res, next) {
  let userData = req.userClaims;
  if (userData.status !== -1) {
    // Không phải login lần đầu thì không cho truy cập
    res.redirect("/");
  }
  let errors = validationResult(req).errors;
  let error = errors[0];

  if (error) {
    return res.json({
      success: false,
      message: error.msg,
    });
  }

  let { newPass, renewPass } = req.body;

  if (newPass !== renewPass) {
    return res.json({
      success: false,
      message: "re-new password must be the same as the new password",
    });
  }

  if (!userData) {
    return res.json({
      success: false,
      message: "Please sign in to change your password",
    });
  }
  let acc = await getUserByUsername(userData.username);

  if (!acc) {
    return res.json({ success: false, message: "Account not exist!" });
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.newPass, salt);

    await updatePasswordById(acc.id, hashPassword);

    // Trường hợp đăng nhập lần đầu
    updateStatusById(acc.id, 0);

    userData.status = 0;
    delete userData["iat"];
    delete userData["exp"];

    assignDataToCookie(res, userData);

    return res.json({
      success: true,
      message: "You have changed your password successfully",
    });
  }
}

// todo Get /users/profile
async function profileGet(req, res) {
  let userData = req.userClaims;

  let userDetail = await getUserDetailByUserName(userData.username);
  console.log(userDetail);
  userDetail.date_of_birth = formatDate(userDetail.date_of_birth);
  userDetail.total_value = formatMoney(userDetail.total_value)
  let status = (await getUserStatusByUserName(userData.username)).status;

  console.log("status", status);
  res.render("account/profile", {
    title: "Profile",
    userDetail,
    encodeStatus: encodeStatusCode(status),
    status,
  });
}

// const profilePostCMND = async (req, res) => {
//   console.log(req.files);
//   // console.log(req.files[1])
//   let result = validationResult(req);
//   if (result.errors.length === 0) {
//     let image = req.file;
//     let username = req.userClaims.username;
//     let imageFileName;
//     if (req.files.length != 2) {
//       try {
//         // const FrontCMND = await handleSelectFrontCMND(username);
//         // const BackCMND = await handleSelectBackCMND(username);
//         // imageFileName = FrontCMND;
//         req.session.flash = {
//           type: "danger",
//           intro: "Oops!",
//           message:
//             "You upload not valid, please upload 2 pictures or we will take old picture",
//         };
//         return res.redirect("/users/profile");
//       } catch (error) {
//         console.log(error);
//       }
//     } else {
//       // let pathofimage = image.filename + ".png";
//       // let imagePath = path.join("public", "images", pathofimage);
//       // console.log(imagePath);
//       // fs.renameSync(image.path, imagePath);
//       // imageFileName = pathofimage;
//       try {
//         if (
//           (await handleUpdateFrontCMND(req.files[0].filename, username)) &&
//           (await handleUpdateBackCMND(req.files[1].filename, username)) &&
//           (await updateStatusAndLastModifiedByUsername(
//             username,
//             0,
//             new Date(Date.now())
//           ))
//         ) {
//           req.session.flash = {
//             type: "success",
//             intro: "Congratulation!",
//             message:
//               "Upload CMND successfully!!!! Please wait for admin verify",
//           };
//           return res.redirect("/users/profile");
//         } else {
//           req.session.flash = {
//             type: "danger",
//             intro: "Oops!",
//             message: "Some thing went wrong",
//           };
//           return res.redirect("/users/profile");
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   } else {
//     const errors = result.mapped();
//     let errorMessage = errors[Object.keys(errors)[0]].msg;
//     req.session.flash = {
//       type: "danger",
//       intro: "Oops!",
//       message: errorMessage,
//     };
//     res.redirect("/users/profile");
//   }
// };

const profilePostCMND = async (req, res) => {
  // console.log(req.files);
  // console.log(req.files[1])
  const form = new multiparty.Form();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.json({
        code: 1,
        message: err.message,
      });
    } else {
      let pathofimage1 =
        Date.now() + "--" + files.front_cmnd[0].originalFilename;
      let imagePath1 = path.join("public", "images", pathofimage1);
      let pathofimage2 =
        Date.now() + "--" + files.back_cmnd[0].originalFilename;
      let imagePath2 = path.join("public", "images", pathofimage2);
      fs.renameSync(files.front_cmnd[0].path, imagePath1);
      fs.renameSync(files.back_cmnd[0].path, imagePath2);
      let username = req.userClaims.username;
      try {
        if (
          (await handleUpdateFrontCMND(pathofimage1, username)) &&
          (await handleUpdateBackCMND(pathofimage2, username)) &&
          (await updateStatusAndLastModifiedByUsername(
            username,
            0,
            new Date(Date.now())
          ))
        ) {
          return res.json({
            code: 0,
            message:
              "Upload CMND successfully!!!! Please wait for admin verify",
          });
        } else {
          return res.json({
            code: 1,
            message: "Some thing went wrong",
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
};

// todo Get /users/card
async function cardGet(req, res) {
  let userData = req.userClaims;
  const raw = await getCardByUsername(userData.username);
  return res.json({
    title: "card",
    isUser: true,
    routerPath: "account/card",
    data: raw,
  });

  res.render("account/user-change-pw", { title: "changepassword" });
}

// todo Post /users/card
async function cardPost(req, res, next) {
  let errors = validationResult(req).errors;
  let error = errors[0];

  if (error) {
    return res.json({
      success: false,
      message: error.msg,
    });
  }

  var recharge_date = formatDateTime(new Date());

  let userData = req.userClaims;
  let { money, card_number, expire_date, cvv } = req.body;

  const quantity = getQuantityCardByUsername(userData.username);
  const raw = await getCardByNumber(card_number);

  console.log(raw);
  if (!raw) {
    return res.json({
      success: false,
      message: "Credit card is not supported.",
    });
  }

  let inputDate = formatDateTime(expire_date);
  let foundDate = formatDateTime(raw.expire_date);

  if (inputDate !== foundDate) {
    return res.json({
      success: false,
      message: "Expire date is not correct.",
    });
  }
  if (parseInt(cvv) !== raw.cvv) {
    return res.json({
      success: false,
      message: "Cvv is not correct.",
    });
  }
  if (raw.card_number === "222222" && money > 1000000) {
    return res.json({
      success: false,
      message: "Thẻ này chỉ hỗ trợ nạp tiền tối đa là 1 triệu",
    });
  }

  if (raw.card_number === "333333") {
    return res.json({
      success: false,
      message: "Thẻ này đã hết tiền",
    });
  }

  await addCardByUsername({
    username: userData.username,
    card_number,
    recharge_date,
    money,
  });

  return res.json({
    success: true,
    message: "You have recharged your card successfully",
  });
}

function assignDataToCookie(res, data) {
  /**
   * Tạo token từ data rồi thêm vào cookie
   * Input: res - Request, data - Object
   * Output: Assign token được tạo ra vào cookie và trả về token
   */
  console.log(data);
  try {
    var token = jwt.sign(data, process.env.TOKEN_KEY, {
      expiresIn: "4h",
    });

    // ? Sử dụng cookie hay refreshToken
    res.cookie("accessToken", token, {
      expires: new Date(Date.now() + 4 * 60 * 1000 * 60),
    });

    return token;
  } catch (err) {
    console.log(err);
    return null;
  }
}

function getDataFromToken(req) {
  /**
   * Function này sẽ giải mã token và trả về data lấy được từ token
   * Input: Request request
   * Output: data lấy được từ token, null nếu không lấy được
   */
  try {
    let token = req.cookies.accessToken;
    let data = jwt.verify(token, process.env.TOKEN_KEY);

    return data;
  } catch {
    return null;
  }
}

const getRechargeByUser = async (req, res) => {
  const myUsername = req.query["username"]
  console.log(myUsername)
  let username
  if(myUsername!==undefined){
      username = myUsername
  }else{
      const userData = req.userClaims
      username = userData.username;
  }
  try {
    const rawData = await getRechargeListByUser(username);
    console.log(rawData);
    data = rawData.map((e) => ({
      id: e.id,
      value: formatMoney(e.value),
      card_number: e.card_number,
      date: formatDateTime(e.date),
    }));
    console.log(data)
    return res.json({
      code: 0,
      message: "Get recharge data successful",
      data,
    });
  } catch (error) {
    return res.json({
      code: 1,
      message: error.message,
    });
  }
};

module.exports = {
  resetPassGet,
  resetPasswordGet,
  requestOtpToMail,
  sendOtp,
  sendOtpPost,
  changePassGet,
  changePassPost,
  resendOtpPost,
  logoutGet,
  firstLoginGet,
  handleRegister,
  handleLogin,
  handleChangePassword,
  handleFirstLogin,
  profileGet,
  profilePostCMND,
  cardGet,
  cardPost,
  getRechargeByUser,
};
