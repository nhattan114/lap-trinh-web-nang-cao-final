const { validationResult } = require("express-validator");
const {
  getCardByNumber,
  addCardByUsername,
} = require("../models/credit_card.model");

const {
  updateTotalValue,
  getUserDetailByUserName,
} = require("../models/user.model");

// GET /recharge
function renderRecharge(req, res) {
  res.render("exchange/recharge", { title: "Recharge" });
}

// POST /recharge
async function handleRecharge(req, res) {
  let errors = validationResult(req).errors;
  let error = errors[0];

  if (error) {
    return res.json({
      success: false,
      message: error.msg,
    });
  }

  var recharge_date = Date.now();

  console.log(recharge_date)
  let userData = req.userClaims;
  let { money, card_number, expire_date, cvv } = req.body;

  const raw = await getCardByNumber(card_number);

  money = +money;
  if (!raw) {
    return res.json({
      success: false,
      message: "Credit card is not supported.",
    });
  }

  let inputDate = formatDateTimeToCompare(expire_date);
  let foundDate = formatDateTimeToCompare(raw.expire_date);

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

  if (raw.card_number === 222222 && money > 1000000) {
    return res.json({
      success: false,
      message: "Thẻ này chỉ hỗ trợ nạp tiền tối đa là 1 triệu",
    });
  }

  if (raw.card_number === 333333) {
    return res.json({
      success: false,
      message: "Thẻ này đã hết tiền",
    });
  }

  await addCardByUsername({
    username: userData.username,
    card_number,
    money,
  });

  let userDetail = await getUserDetailByUserName(userData.username);

  await updateTotalValue(userDetail.total_value + money, userData.username);
  return res.json({
    success: true,
    message: "You have recharged your card successfully",
  });
}

function formatDateTimeToCompare(time) {
  let change = new Date(time);

  return `${change.getFullYear()}-${change.getMonth()}-${change.getDate()}`;
}

module.exports = {
  renderRecharge,
  handleRecharge,
};
