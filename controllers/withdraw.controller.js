const jwt = require("jsonwebtoken");

const { validationResult } = require("express-validator");
const {
  createWithdraw,
  getTodayWithdraw,
  getWithdrawAdmin,
  getWithdrawListByUsername,
} = require("../models/withdraw.model");
const { getCardByAll } = require("../models/credit_card.model");
const {
  getUserByUsername,
  getUserDetailByUserName,
  updateTotalValue,
  updateTotalValueByDifference,
} = require("../models/user.model");
const { formatDateTime, encodeStatusCode, encodeTransistionCode, formatMoney } = require("../config/helper");

// GET /withdraw
function renderWithdraw(req, res) {
  res.render("exchange/withdraw", { title: "Withdraw" });
}

// POST /withdraw
// todo xử lý logic rút tiền
async function handleWithdraw(req, res) {
  let errors = validationResult(req).errors;
  let error = errors[0];

  if (error) {
    return res.json({
      succes: false,
      message: error.msg,
    });
  }

  let { cardNumber, expireDate, cvv, amount, note } = req.body;

  let userData = req.userClaims;

  if (!userData) {
    return res.json({
      succes: false,
      message: "Vui lòng đăng nhập để thực hiện việc rút tiền",
    });
  }

  // * Credit card exist validation
  let creditCard = await getCardByAll({ cardNumber, expireDate, cvv });

  if (!creditCard) {
    return res.json({
      succes: false,
      message: "Thẻ không hợp lệ",
    });
  }

  // * Multiplicity of 50000 validation
  if (amount % 50000 !== 0) {
    return res.json({
      succes: false,
      message: "Số tiền phải là bội số của 50,000 đồng!",
    });
  }

  // * Maximum 2 transactions a day validation
  const result = await getTodayWithdraw();

  if (result.length >= 2) {
    return res.json({
      succes: false,
      message: "Một ngày chỉ được tạo tối đa 2 giao dịch rút tiền!",
    });
  }

  let fee = amount * 0.05;
  let totalWithdraw = parseInt(amount) + parseInt(fee);

  let currentUserDetail = await getUserDetailByUserName(userData.username);
  let total = currentUserDetail["total_value"];

  if (total < totalWithdraw) {
    return res.json({
      succes: false,
      message: "Số dư hiện tại không đủ!",
    });
  }

  // Main

  let status = amount > 5000000 ? 0 : 1;
  let withdraw = {
    username: userData.username,
    cardNumber: cardNumber,
    date: new Date(Date.now()),
    value: parseInt(amount),
    status: status,
    fee: parseInt(fee),
    note: note,
  };

  console.log(withdraw);
  await createWithdraw(withdraw);
  if (status) {
    // Thành công
    await updateTotalValueByDifference(totalWithdraw, userData.username);

    return res.json({
      success: true,
      message: "Tiền đã được rút về thẻ thành công",
    });
  } else {
    // Chờ duyệt
    return res.json({
      success: true,
      message: "Số tiền vượt quá 5tr sẽ phải chờ admin duyệt",
    });
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

const getWithdrawByUser = async (req, res) => {
  const myUsername = req.query["username"]
  console.log(myUsername)
  let username

  if(myUsername!==undefined){
      username = myUsername
  }else{
      const userData = req.userClaims
      username = userData.username;
  }

  let data;
  try {
    console.log(username)
    const rawData = await getWithdrawListByUsername(username);
    data = rawData.map((e) => ({
      id: e.id,
      card_number: e.card_number,
      date: formatDateTime(e.date),
      value: formatMoney(e.value),
      status: encodeTransistionCode(e.status),
      statusCode: e.status,
      fee: e.fee,
      note: e.note,
    }));

    return res.json({
      code: 0,
      message: "Get withdraw data successful",
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
  renderWithdraw,
  handleWithdraw,
  getWithdrawByUser,
};

// 78RYZh
// 5532778774
