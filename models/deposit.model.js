const connect = require("../config/db");

const handlePostDeposit = (
  phone_sender,
  phone_receiver,
  value,
  fee,
  feeperson,
  note,
  status,
  date
) =>
  new Promise((resolve, reject) => {
    const sql =
      "insert into deposit(phone_sender,phone_receiver,value,fee,feeperson,note,status,date) values(?,?,?,?,?,?,?,?)";
    const values = [
      phone_sender,
      phone_receiver,
      value,
      fee,
      feeperson,
      note,
      status,
      date,
    ];
    connect.query(sql, values, (err) => {
      if (err) reject(false);
      else {
        resolve(true);
      }
    });
  });

const selectReceiverValue = (phone_receiver) =>
  new Promise((resolve, reject) => {
    const sql = "select * from user_detail where phone = ?";
    const values = [phone_receiver];
    connect.query(sql, values, (err, result) => {
      if (err) reject(err);
      else {
        resolve(result[0]);
      }
    });
  });

const selectReceiverName = (phone_receiver) =>
  new Promise((resolve, reject) => {
    const sql = "select * from user_detail where phone = ?";
    const values = [phone_receiver];
    connect.query(sql, values, (err, result) => {
      if (err) reject(false);
      else {
        resolve(result[0].email);
      }
    });
  });

const handleSelectDepositByPhone = (phone) =>
  new Promise((resolve, reject) => {
    connect.query(
      "select * from deposit where phone_sender=? order by date desc limit 1",
      [phone],
      (err, result) => {
        if (err) reject(err);
        resolve(result[0]);
      }
    );
  });

const handleUpdateStatusDeposit5m = (phone) =>
  new Promise((resolve, reject) => {
    connect.query(
      "update deposit set status = 0 where phone_sender=? order by date desc limit 1",
      [phone],
      (err, result) => {
        if (err) reject(err);
        resolve(true);
      }
    );
  });

const handleUpdateTotalValueOfSender = (moneyDepositFeeSender, phone) =>
  new Promise((resolve, reject) => {
    // console.log(moneyDepositFeeSender);
    const sql =
      "update user_detail set total_value = total_value - ? where phone = ?";
    const values = [moneyDepositFeeSender, phone];
    connect.query(sql, values, (err) => {
      if (err) reject(false);
      else {
        resolve(true);
      }
    });
  });
const handleUpdateTotalValueOfReceiver = (moneyDepositFeeReceiveer, phone) =>
  new Promise((resolve, reject) => {
    const sql =
      "update user_detail set total_value = total_value + ? where phone = ?";
    const values = [moneyDepositFeeReceiveer, phone];
    connect.query(sql, values, (err) => {
      if (err) reject(false);
      else {
        resolve(true);
      }
    });
  });

const getUserDepositInfo = (username) =>
  new Promise((resolve, reject) => {
    connect.query(
      "select * from user_detail where username=?",
      [username],
      (err, result) => {
        if (err) reject(err);
        resolve(result[0]);
      }
    );
  });

async function getDepositById(id) {
  /* Lấy deposit bằng id
    Input: id, String
    Output: found user
    */
  const sql = "SELECT * FROM deposit WHERE id = ?";
  const value = [id];

  return new Promise((resolve, reject) => {
    connect.query(sql, value, async (err, result) => {
      if (err) throw err;
      resolve(result[0]);
    });
  });
}

async function getAllDepositsSender() {
  /**
   * Lấy tất cả giao dịch chuyển tiền
   * Input: None
   * Output: list of giao dịch
   */
  const sql =
    "select a.* , b.username from deposit a left join user_detail b on a.phone_sender=b.phone order by date desc";

  return new Promise((resolve, reject) => {
    connect.query(sql, (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
}

async function getAllDepositsReceiver() {
  /**
   * Lấy tất cả giao dịch nhận tiền
   * Input: None
   * Output: list of giao dịch
   */
  const sql =
    "select a.* , b.username from deposit a left join user_detail b on a.phone_receiver=b.phone order by date desc";

  return new Promise((resolve, reject) => {
    connect.query(sql, (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
}

async function getAllDeposits() {
  /**
   * Lấy tất cả giao dịch chuyển tiền
   * Input: None
   * Output: list of giao dịch
   */
  const sql = "SELECT * FROM deposit";

  return new Promise((resolve, reject) => {
    connect.query(sql, (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
}


const getSenderListByUser = (username)=> new Promise((resolve,reject)=>{
    connect.query("SELECT b.* FROM user_detail a, deposit b where a.phone=b.phone_sender and a.username=? order by date desc",[username],(err,result)=>{
        if(err) reject(err)
        resolve(result)
    })
})

const getRecieverListByUser = (username)=> new Promise((resolve,reject)=>{
    connect.query("SELECT b.* FROM user_detail a, deposit b where a.phone=b.phone_receiver and a.username=? order by date desc",[username],(err,result)=>{
        if(err) reject(err)
        resolve(result)
    })
})



module.exports = {
  handlePostDeposit,
  selectReceiverValue,
  getUserDepositInfo,
  handleSelectDepositByPhone,
  handleUpdateTotalValueOfSender,
  handleUpdateTotalValueOfReceiver,
  selectReceiverName,
  handleUpdateStatusDeposit5m,
  getAllDeposits,
  getAllDepositsSender,
  getAllDepositsReceiver,
  getDepositById,
  getSenderListByUser,
  getRecieverListByUser
};
