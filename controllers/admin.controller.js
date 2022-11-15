var nodemailer = require("nodemailer"); // khai báo sử dụng module nodemailer

const jwt = require("jsonwebtoken");

const {
  formatDateTime,
  dataProcess,
  formatDate,
  encodeStatusCode,
  formatDateTime2,
  encodeTransistionCode,
  formatCash,
  formatMoney,
} = require("../config/helper");
const {
  getUserAccountByStatus,
  getUserDetailByUsername,
  updateUserStatus,
  handleSelectDepositMore5m,
  handleSelectEmailDepositMore5m,
  updateStatusToCheck,
  getUserAccountBlock,
} = require("../models/admin.model");
const {
  handleUpdateTotalValueOfSender,
  handleUpdateTotalValueOfReceiver,
  getAllDepositsSender,
  getAllDepositsReceiver,
  getDepositById,
} = require("../models/deposit.model");
const {
  updateTotalValueByDifference,
  updateAbnormal,
} = require("../models/user.model");
const {
  getWithdrawAdmin,
  updateStatusById,
  getWithdrawById,
  getAllWithdraws,
} = require("../models/withdraw.model");
const { getTranSHistoryByUsername } = require("../models/trans-history.model");
const {
  getRechargeById,
  getAllRecharges,
} = require("../models/recharge.model");
const { getAllBills, getBillById } = require("../models/phone_card.model");
const { transporterEmail } = require("../config/email_setup");
const getAdminHome = (req, res) => {
  res.render("admin/home", { title: "Admin", isAdmin: true, routerPath: "" });
};

// const handleAdminUserAccount = async (req, res) => {
//   const username = req.query["username"];
//   console.log(username);
//   if (username === undefined) {
//     const raw = await getUserAccountByStatus(0);
//     const data = raw.map((e) => ({
//       id: e.id,
//       username: e.username,
//       status: e.status,
//       last_modified: formatDateTime(e.last_modified),
//     }));

//     return res.render("admin/account", {
//       title: "Account",
//       isAdmin: true,
//       data,
//       routerPath: "admin/account",
//     });
//   } else {
//     const raw = await getUserDetailByUsername(username);
//     console.log(raw);
//     const data = raw.map((e) => ({
//       id: e.id,
//       username: e.username,
//       status:
//         e.abnormal == 2 ? encodeStatusCode(4) : encodeStatusCode(e.status),
//       statusCode: e.abnormal == 2 ? 4 : e.status,
//       login_attempts: e.login_attempts,
//       phone: e.phone,
//       email: e.email,
//       name: e.name,
//       date_of_birth: formatDate(e.date_of_birth),
//       address: e.address,
//       front_cmnd: e.font_cmnd,
//       back_cmnd: e.back_cmnd,
//       total_value: e.total_value,
//     }));
//     console.log(data);
//     return res.render("admin/account-info", {
//       title: "Account",
//       isAdmin: true,
//       data,
//     });
//   }
// };


const handleAdminUserAccount = async (req, res) => {
  const raw = await getUserAccountByStatus(0);
  const data = raw.map((e) => ({
    id: e.id,
    username: e.username,
    status: e.status,
    last_modified: formatDateTime(e.last_modified),
  }));

  return res.render("admin/account", {
    title: "Account",
    isAdmin: true,
    data,
    routerPath: "admin/account",
  });

};


const handleAdminUserAccountDetail = async (req, res) => {
  const username = req.params.username;
  console.log(username);
  if (username === undefined) {
    const raw = await getUserAccountByStatus(0);
    const data = raw.map((e) => ({
      id: e.id,
      username: e.username,
      status: e.status,
      last_modified: formatDateTime(e.last_modified),
    }));

    return res.render("admin/account", {
      title: "Account",
      isAdmin: true,
      data,
      routerPath: "admin/account",
    });
  } else {
    const raw = await getUserDetailByUsername(username);
    console.log(raw);
    const data = raw.map((e) => ({
      id: e.id,
      username: e.username,
      status:
        e.abnormal == 2 ? encodeStatusCode(4) : encodeStatusCode(e.status),
      statusCode: e.abnormal == 2 ? 4 : e.status,
      login_attempts: e.login_attempts,
      phone: e.phone,
      email: e.email,
      name: e.name,
      date_of_birth: formatDate(e.date_of_birth),
      address: e.address,
      front_cmnd: e.font_cmnd,
      back_cmnd: e.back_cmnd,
      total_value: formatMoney(e.total_value),
    }));
    console.log(data);
    return res.render("admin/account-info", {
      title: "Account",
      isAdmin: true,
      data,
    });
  }
};

const handleAccountApi = async (req, res) => {
  console.log("REceive")
  const statusArr = [0, 1, 2, 3, 4];
  let status = req.query["status"];
  console.log(status);
  if (status === undefined) {
    status = 0;
  }
  if (!statusArr.includes(+status)) {
    return res.json({
      code: 1,
      message: "Status not valid!",
    });
  } else {
    let data;
    if (status == 4) {
      const raw = await getUserAccountBlock(status);
      data = raw.map((e) => ({
        id: e.id,
        username: e.username,
        status: 4,
        last_modified: formatDateTime(e.last_modified),
      }));
    } else {
      const raw = await getUserAccountByStatus(status);
      data = raw.map((e) => ({
        id: e.id,
        username: e.username,
        status: e.status,
        last_modified: formatDateTime(e.last_modified),
      }));
    }
    res.json({
      code: 0,
      message: "Get data successful!",
      data,
    });
  }
};

const handleAccountStatus = async (req, res) => {
  const { username, action } = req.body;
  console.log(username, action)
  if (username === undefined || action === undefined) {
    return res.json({
      code: 1,
      message: "Missing input value!",
    });
  } else {
    try {
      const actions = ["verify", "cancel", "request", "unclock"];
      const actionIndex = actions.indexOf(action) + 1;
      const currentDateTime = formatDateTime2();
      if (actionIndex == 4) {
        if (await updateAbnormal(username, 0)) {
          return res.json({
            code: 0,
            message: `Update username=${username} successful!`,
          });
        }
      } else {
        if (await updateUserStatus(username, actionIndex, currentDateTime)) {
          return res.json({
            code: 0,
            message: `Update username=${username} successful!`,
          });
        } else {
          res.json({
            code: 1,
            message: "Something went wrong!",
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }
};

const getDepositMore5m = async (req, res) => {
  const raw = await handleSelectDepositMore5m(0);
  const data = raw.map((e) => ({
    id: e.id,
    phone_sender: e.phone_sender,
    phone_receiver: e.phone_receiver,
    value: e.value,
    fee: e.fee,
    feeperson: e.feeperson,
    note: e.note,
    status: e.status === 0 ? false : true,
    date: formatDateTime(e.date),
  }));
  // console.log(data);
  res.render("admin/deposit", {
    title: "Deposit",
    isAdmin: true,
    routerPath: "admin/deposit",
    data,
  });
};

const getWithdrawMore5m = async (req, res) => {
  const raw = await handleSelectDepositMore5m(0);
  const data = raw.map((e) => ({
    id: e.id,
    phone_sender: e.phone_sender,
    phone_receiver: e.phone_receiver,
    value: e.value,
    fee: e.fee,
    feeperson: e.feeperson,
    note: e.note,
    status: e.status === 0 ? false : true,
    date: formatDateTime(e.date),
  }));
  // console.log(data);
  res.render("admin/withdraw", {
    title: "Withdraw",
    isAdmin: true,
    routerPath: "admin/withdraw",
    data,
  });
};

const getWithdrawDetail = async (req, res) => {
  let id = req.params.id;

  let data = await getWithdrawById(id);

  data.date = formatDateTime(data.date);
  data.value = formatCash("" + data.value);
  data.fee = formatCash("" + data.fee);

  return res.render("admin/withdraw-detail", {
    title: "Withdraw detail",
    isAdmin: true,
    routerPath: "admin/withdraw",
    data,
  });
};

const getDepositDetail = async (req, res) => {
  let id = req.params.id;

  let data = await getDepositById(id);

  data.status = encodeTransistionCode(data.status);
  data.date = formatDateTime(data.date);
  data.value = formatMoney(data.value);
  data.fee = formatMoney(data.fee);

  return res.render("admin/deposit-detail", {
    title: "Deposit detail",
    isAdmin: true,
    routerPath: "admin/deposit",
    data,
  });
};

const getTransHistory = async (req, res) => {
  return res.render("admin/trans-history", {
    title: "Transaction History",
    isAdmin: true,
    routerPath: "admin/trans-history",
  });
};

// GET /admin/trans-history/:choice
async function apiGetTransHistory(req, res) {
  // let userData = req.userClaims;

  // if (userData.username !== "admin") {
  //   return res.json({
  //     success: false,
  //     message: "Phải là admin để sử dụng api này",
  //   });
  // }
  let choice = parseInt(req.params.choice);

  let data = null;
  switch (choice) {
    case 1:
      // Nạp tiền - recharge
      data = await getAllRecharges();

      break;
    case 2:
      // Rút tiền - withdraw
      data = await getAllWithdraws();

      break;
    case 3:
      // Chuyển tiền - deposit
      data = await getAllDepositsSender();
      break;
    case 4:
      //  Nhận tiền - deposit
      data = await getAllDepositsReceiver();
      break;
    case 5:
      // Thanh toán dịch vụ - phone_card
      data = await getAllBills();
      break;
    default:
      return res.json({
        success: false,
        message: "Không có option này",
      });
  }

  data = data.map((currVal) => {
    if(currVal.status){
      currVal.status = encodeTransistionCode(currVal.status);
    }else{
       currVal.status = encodeTransistionCode(1);
    }
    currVal.date = formatDateTime(currVal.date);
    currVal.value = formatMoney(currVal.value);
    currVal.fee = formatMoney(currVal.fee);

    return currVal;
  });
  return res.json({
    success: true,
    message: "Lấy lịch sử giao dịch thành công",
    data: data,
  });
}

// GET /admin/trans-history/:choice/:id
const getTransHistoryDetail = async (req, res) => {
  let choice = req.params.choice;
  let id = req.params.id;

  let data = null;

  let choices = [
    "isRecharge",
    "isWithdraw",
    "isDeposit",
    "isDeposit",
    "isBill",
  ];
  let type = choices[choice - 1];

  switch (choice) {
    case "1":
      // Nạp tiền - recharge
      data = await getRechargeById(id);
      break;
    case "2":
      // Rút tiền - withdraw
      data = await getWithdrawById(id);
      break;
    case "3":
      // Chuyển tiền - deposit
      data = await getDepositById(id);
      break;
    case "4":
      //  Nhận tiền - deposit
      data = await getDepositById(id);
      break;
    case "5":
      // Thanh toán dịch vụ - phone_card
      data = await getBillById(id);
      break;
    default:
      return res.json({
        success: false,
        message: "Không có option này",
      });
  }

  if (data.code) {
    let code = data.code.match(/.{1,5}/g);
    data.code = code.join(" - ");
  }

  data.status = encodeTransistionCode(data.status);
  data.value = formatMoney(data.value);
  data.fee = formatMoney(data.fee);
  return res.render("admin/trans-history-detail", {
    title: "Transaction History Detail",
    isAdmin: true,
    [type]: true,
    routerPath: "admin/trans-history-detail",
    data,
  });
};

const postRejectDeposit5m = async (req, res) => {
  let { id } = req.body;
  try {
    if (await updateStatusToCheck(-1, +id)) {
      return res.json({
        code: 0,
        message: `Reject deposit successful!`,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const postDepositMore5m = async (req, res) => {
  let { id, phone_sender, phone_receiver, value, fee, feeperson } = req.body;
  //console.log(id,phone_sender,phone_receiver,value,fee,feeperson)
  try {
    let moneyDepositFeeReceiver = value;
    if (feeperson == "receiver") {
      moneyDepositFeeReceiver = value - fee;
      // console.log(moneyDepositFeeReceiver)
    } else {
      value = +value + +fee;
    }
    await handleUpdateTotalValueOfSender(value, phone_sender);
    await handleUpdateTotalValueOfReceiver(
      moneyDepositFeeReceiver,
      phone_receiver
    );
    await updateStatusToCheck(2, +id);
    let email = await handleSelectEmailDepositMore5m(phone_receiver);
    console.log(email);

    //email to receiver
    var transporter = transporterEmail();
    // var transporter = nodemailer.createTransport({
    //   // config mail server
    //   service: "Gmail",
    //   auth: {
    //     user: "nchdang16012001@gmail.com",
    //     pass: "mlrafbeyqtvtqloe",
    //   },
    // });

    // var transporter = nodemailer.createTransport(smtpTransport({ // config mail server
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
      subject: "Confirm Deposit",
      html:
        "<p>Sender: " +
        phone_sender +
        "<br></br> Receiver: " +
        phone_receiver +
        "<br></br> Money:" +
        moneyDepositFeeReceiver +
        "</p>",
    };

    transporter.sendMail(mainOptions, async function (err, info) {
      if (err) {
        // console.log(err);
        // req.session.flash = {
        //     type: "danger",
        //     intro: "Oops!",
        //     message: "Some thing went wrong"
        // }
        return res.json({
          code: 1,
          message: `Some thing wrong`,
        });
        // return res.redirect('/deposit')
      } else {
        // req.session.flash = {
        //     type: "success",
        //     intro: "Congratulation!",
        //     message: "OTP is right. And money is deposit to receiver. Receiver please check mail!"
        // }
        return res.json({
          code: 0,
          message: `Update status successful!`,
        });
        // return res.redirect('/deposit/successDeposit')
      }
    });
    // return res.json({
    //                 code: 0,
    //                 message: `Update status successful!`,
    //             })
  } catch (error) {
    console.log(error);
  }
};

const apiGetWithdrawMore5m = async (req, res) => {
  /**
   * Api dùng để lấy withdraw cần duyệt của admin
   */
  let withdraws = await getWithdrawAdmin();

  withdraws = withdraws.map((currVal) => {
    currVal.date = formatDateTime(currVal.date);
    return currVal;
  });
  return res.json({
    success: true,
    message: "Lấy withdraws cần duyệt thành công",
    data: withdraws,
  });
};

// todo /POST /admin/withdraw
const postWithdrawMore5m = async (req, res) => {
  /**
   * Duyệt hay từ chối giao dịch của user
   */

  let userData = getDataFromToken(req);

  if (!userData) {
    return res.json({
      success: false,
      message: "Phải đăng nhập để sử dụng chức năng này",
    });
  }

  if (userData.username !== "admin") {
    return res.json({
      success: false,
      message: "Phải là admin để sử dụng chức năng này",
    });
  }
  let { id, isApproved } = req.body;

  let withdraw = await getWithdrawById(id);

  if (!withdraw) {
    return res.json({
      success: false,
      message: "Không có giao dịch rút tiền này trong hệ thống",
    });
  }

  let { username, value, fee } = withdraw;
  let totalWithdraw = parseInt(value) + parseInt(fee);

  if (isApproved === "true") {
    // Duyệt giao dịch rút tiền, cập nhật lại số dư
    await updateStatusById(id, 2);
    await updateTotalValueByDifference(totalWithdraw, username);

    return res.json({
      success: true,
      message: "Duyệt giao dịch thành công",
    });
  } else {
    // Không duyệt giao dịch rút tiền
    await updateStatusById(id, -1);

    return res.json({
      success: true,
      message: "Từ chối giao dịch thành công",
    });
  }
};

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

const handleAdminLogout = (req,res)=>{
  res.clearCookie("accessToken");
  res.redirect("/users/login");
}

module.exports = {
  getAdminHome,
  handleAdminUserAccount,
  handleAccountApi,
  handleAccountStatus,
  getDepositMore5m,
  postDepositMore5m,
  postRejectDeposit5m,
  getWithdrawMore5m,
  postWithdrawMore5m,
  apiGetWithdrawMore5m,
  getTransHistory,
  getTransHistoryDetail,
  apiGetTransHistory,
  getWithdrawDetail,
  getDepositDetail,
  handleAdminUserAccountDetail,
  handleAdminLogout
};
