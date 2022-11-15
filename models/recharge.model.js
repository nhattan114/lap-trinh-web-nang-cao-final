const connect = require("../config/db");

async function getAllRecharges() {
  /**
   * Lấy tất cả giao dịch nạp tiền
   * Input: None
   * Output: list of giao dịch
   */
  const sql = "SELECT * FROM recharge";

  return new Promise((resolve, reject) => {
    connect.query(sql, (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
}

async function getRechargeById(id) {
  /* Lấy recharge bằng id
    Input: username, String
    Output: found user
    */
  const sql = "SELECT * FROM recharge WHERE id = ?";
  const value = [id];

  return new Promise((resolve, reject) => {
    connect.query(sql, value, async (err, result) => {
      if (err) throw err;
      resolve(result[0]);
    });
  });
}

const getRechargeListByUser = (username)=> new Promise((resolve,reject)=>{
  connect.query("select * from recharge where username=? order by date desc",[username],(err,result)=>{
    if(err) reject(err)
    resolve(result)
  })
})

module.exports = {
  getAllRecharges,
  getRechargeById,
  getRechargeListByUser
};
