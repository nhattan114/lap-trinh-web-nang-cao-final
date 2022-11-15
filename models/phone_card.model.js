const connect = require("../config/db");

const getNetworkProvider = () =>
  new Promise((resolve, reject) => {
    connect.query("select * from network_provider", (err, result) => {
      if (err) reject(err.message);
      else {
        resolve(result);
      }
    });
  });

const createBill = (username, provider_number, code, price, quantity) =>
  new Promise((resolve, reject) => {
    connect.query(
      "insert into bill(username, provider_number,code, price, quantity) values(?,?,?,?,?)",
      [username, provider_number, code, price, quantity],
      (err, result) => {
        if (err) reject(err.message);
        resolve(result);
      }
    );
  });

async function getAllBills() {
  /**
   * Lấy tất cả giao dịch thanh toán dịch vụ
   * Input: None
   * Output: list of giao dịch
   */
  const sql = "SELECT * FROM bill";

  return new Promise((resolve, reject) => {
    connect.query(sql, (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
}

async function getBillById(id) {
  /* Lấy bill bằng id
    Input: id, String
    Output: found user
    */
  const sql = "SELECT * FROM bill WHERE id = ?";
  const value = [id];

  return new Promise((resolve, reject) => {
    connect.query(sql, value, async (err, result) => {
      if (err) throw err;
      resolve(result[0]);
    });
  });
}

const getPhoneCardListByUser = (username) => new Promise((resolve, reject) => {
  connect.query("SELECT * from bill where username=? order by date desc", [username], (err, result) => {
    if (err) reject(err)
    resolve(result)
  })
});

const getNetworkFeeByCode = (code) => new Promise((resolve, reject) => {
  connect.query("SELECT fee from network_provider where provider_number=?", [code], (err, result) => {
    if (err) reject(err)
    resolve(result)
  })
});

module.exports = {
  getNetworkProvider,
  createBill,
  getAllBills,
  getBillById,
  getPhoneCardListByUser,
  getNetworkFeeByCode
};
