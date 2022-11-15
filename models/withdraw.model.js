const connect = require("../config/db");

async function getWithdrawById(id) {
  /**
   * Lấy giao dịch bằng id
   * Input: id
   * Output: giao dịch cần tìm bằng id
   */
  const sql = "SELECT * FROM withdraw WHERE id = ?";
  const value = [id];
  return new Promise((resolve, reject) => {
    connect.query(sql, value, (err, result) => {
      if (err) throw err;
      resolve(result[0]);
    });
  });
}
async function getTodayWithdraw() {
  /**
   * Lấy các giao dịch trong ngày (dùng check dk tối đa 2 gdich 1 ngày)
   * Input: None
   * Output: list of giao dịch trong ngày
   */
  const sql = "SELECT * FROM withdraw WHERE DATE(date) = CURDATE()";

  return new Promise((resolve, reject) => {
    connect.query(sql, (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
}

async function getAllWithdraws() {
  /**
   * Lấy tất cả giao dịch rút tiền
   * Input: None
   * Output: list of giao dịch
   */
  const sql = "SELECT * FROM withdraw";

  return new Promise((resolve, reject) => {
    connect.query(sql, (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
}
async function getWithdrawAdmin() {
  /**
   * Lấy các giao dịch mà admin cần phải duyệt
   * Input: None
   * Output: list of giao dịch
   */
  const sql = "SELECT * FROM withdraw WHERE status = 0";

  return new Promise((resolve, reject) => {
    connect.query(sql, (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
}

async function createWithdraw(withdraw) {
  /* Tạo một giao dịch rút tiền trên bảng withdraw
    Input: withdraw object {username, date, status, fee}
    Output: Đã tạo thành công
    */

    console.log(withdraw);
  const sql =
    "INSERT INTO withdraw(username,card_number,date,value,status,fee,note) values(?,?,?,?,?,?,?)";
  const value = [...Object.values(withdraw)];

  return new Promise((resolve, reject) => {
    connect.query(sql, value, (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
}

async function updateStatusById(id, status) {
  /**
   * Cập nhật status của một giao dịch bằng id
   * Input: id - String, status - Integer
   * Output: true nếu thành công, false ngược lại
   */
  const sql = "UPDATE withdraw SET status = ? WHERE id = ?";
  const value = [status, id];

  return new Promise((resolve, reject) => {
    connect.query(sql, value, (err) => {
      if (err) reject(false);
    });
    resolve(true);
  });
}

const getWithdrawListByUsername = (username)=>new Promise((resolve,reject)=>{
  connect.query('select * from withdraw where username=? order by date desc', [username], (err,result)=>{
    if (err) reject(err);
    resolve(result);
  })
})


module.exports = {
  createWithdraw,
  getTodayWithdraw,
  getWithdrawAdmin,
  updateStatusById,
  getWithdrawById,
  getWithdrawListByUsername,
  getAllWithdraws,
};
