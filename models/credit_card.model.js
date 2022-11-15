const connect = require("../config/db");

async function getCardByAll({ cardNumber, expireDate, cvv }) {
  /**
   * Kiểm tra thông tin một thẻ có hợp lệ hay không
   * Input: cardNumber - String, expireDate - Date, cvv - Number
   */

  const sql =
    "SELECT * FROM credit_card WHERE card_number = ? AND expire_date = ? AND cvv = ?";
  const value = [cardNumber, expireDate, cvv];

  return new Promise((resolve, reject) => {
    connect.query(sql, value, async (err, result) => {
      if (err) throw err;
      resolve(result[0]);
    });
  });
}

async function getCardByNumber(cardNumber) {
  /**
   * Kiểm tra thông tin một thẻ có hợp lệ hay không bằng number
   * Input: cardNumber - String,
   */

  const sql = "SELECT * FROM credit_card WHERE card_number = ?";
  const value = [cardNumber];

  return new Promise((resolve, reject) => {
    connect.query(sql, value, async (err, result) => {
      if (err) throw err;
      resolve(result[0]);
    });
  });
}

async function getCardByUsername(username) {
  /**
   * Kiểm tra thông tin một thẻ có hợp lệ hay không bằng number
   * Input: username - String,
   */

  const sql = "SELECT * FROM recharge WHERE username = ?";
  const value = [username];

  return new Promise((resolve, reject) => {
    connect.query(sql, value, async (err, result) => {
      if (err) throw err;
      resolve(result[0]);
    });
  });
}

async function addCardByUsername({
  username,
  card_number,
  money,
}) {
  /**
   * Kiểm tra thông tin một thẻ có hợp lệ hay không bằng number
   * Input: username - String,
   */

  const sql =
    "INSERT INTO recharge (username, card_number, value) VALUES (?,?,?)";
  const value = [username, card_number, money];

  return new Promise((resolve, reject) => {
    connect.query(sql, value, async (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
}

async function getQuantityCardByUsername(username) {
  /**
   * Kiểm tra thông tin một thẻ có hợp lệ hay không bằng number
   * Input: username - String,
   */

  const sql =
    "SELECT count(*) FROM recharge WHERE username = ? and card_number = '222222'";
  const value = [username];

  return new Promise((resolve, reject) => {
    connect.query(sql, value, async (err, result) => {
      if (err) throw err;
      resolve(result[0]);
    });
  });
}

module.exports = {
  getCardByAll,
  getCardByNumber,
  getCardByUsername,
  addCardByUsername,
  getQuantityCardByUsername,
};
