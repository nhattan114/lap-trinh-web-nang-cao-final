const connect = require("../config/db");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const handlePostOTP = (email, otpcode, expired) =>
  new Promise((resolve, reject) => {
    const sql = "insert into otp(email,otpcode,expired) values(?,?,?)";
    const value = [email, otpcode, expired];
    connect.query(sql, value, (err) => {
      if (err) reject(false);
      else {
        resolve(true);
      }
    });
  });

const handleSelectFrontCMND = (username) =>
  new Promise((resolve, reject) => {
    connect.query(
      "select font_cmnd from user_detail where username = ?",
      [username],
      (err, result) => {
        if (err) reject(err);
        else {
          resolve(result);
        }
      }
    );
  });

const handleSelectBackCMND = (username) =>
  new Promise((resolve, reject) => {
    connect.query(
      "select back_cmnd from user_detail where username = ?",
      [username],
      (err, result) => {
        if (err) reject(err);
        else {
          resolve(result);
        }
      }
    );
  });

const handleUpdateFrontCMND = (font_cmnd, username) =>
  new Promise((resolve, reject) => {
    connect.query(
      "update user_detail set font_cmnd = ? where username = ?",
      [font_cmnd, username],
      (err, result) => {
        if (err) reject(err);
        else {
          resolve(true);
        }
      }
    );
  });

const handleUpdateBackCMND = (back_cmnd, username) =>
  new Promise((resolve, reject) => {
    connect.query(
      "update user_detail set back_cmnd = ? where username = ?",
      [back_cmnd, username],
      (err, result) => {
        if (err) reject(err);
        else {
          resolve(true);
        }
      }
    );
  });

const handleSelectOTP = (email) =>
  new Promise((resolve, reject) => {
    const sql =
      "select * from otp where email = ? order by expired desc limit 1";
    const value = email;
    connect.query(sql, value, (err, result) => {
      if (err) reject(false);
      else {
        resolve(result[0]);
      }
    });
  });

const createAnAccount = (
  username,
  phone,
  email,
  name,
  date_of_birth,
  address,
  font_cmnd,
  back_cmnd
) =>
  new Promise((resolve, reject) => {
    const sql =
      "insert into user_detail(username, phone, email, name, date_of_birth, address,font_cmnd,back_cmnd) values(?,?,?,?,?,?,?,?)";
    const value = [username, phone, email, name, date_of_birth, address,font_cmnd,back_cmnd];
    connect.query(sql, value, (err) => {
      if (err) reject(err.message);
      resolve(true);
    });
  });

const putAccCreatedIntoUser = (username, password) =>
  new Promise((resolve, reject) => {
    const sql = "insert into user(username, password) values(?,?)";
    const value = [username, password];
    connect.query(sql, value, (err) => {
      if (err) reject(err.message);
      resolve(true);
    });
  });

const handleChangePass = (newpass, email) =>
  new Promise((resolve, reject) => {
    const sql = "UPDATE user SET password = ? where username = ?";
    bcrypt.hash(newpass, saltRounds, (err, hash) => {
      const value = [hash, email];
      connect.query(sql, value, (err) => {
        if (err) reject(false);
      });
    });
    resolve(true);
  });

async function getUserIntervalOneMinute(username) {
  /**
   * Lấy tài khoản có login_date trong vòng 1 phút bằng username
   * Input: username - String (Lấy từ userClaims)
   * Output: user Object
   */
  const sql =
    "SELECT * FROM user WHERE username = ? AND login_date BETWEEN NOW() - INTERVAL 1 MINUTE AND NOW()";
  const value = [username];

  return new Promise((resolve, reject) => {
    connect.query(sql, value, async (err, result) => {
      if (err) throw err;
      resolve(result[0]);
    });
  });
}
async function increaseLoginAttemptsByUsername(username) {
  /**
   * +1 login_attemps trong bảng user bằng username
   * Input: username - String (Lấy từ userClaims)
   * Output: Value have been updated
   */
  const sql =
    "UPDATE user SET login_attempts = login_attempts + 1 WHERE username = ?";
  const value = [username];

  return new Promise((resolve, reject) => {
    connect.query(sql, value, async (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
}

async function updateAbnormal(username, abnormal = 1) {
  /**
   * Cập nhật abnormal khi user đăng nhập bất thường
   * Input: abnormal - Integer, username - String (Lấy từ accessToken)
   * Output: abnormal được cập nhật
   */
  const sql = "UPDATE user SET abnormal = ? WHERE username = ?";
  const value = [abnormal, username];

  return new Promise((resolve, reject) => {
    connect.query(sql, value, async (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
}

async function updateLoginDateToCurrent(username) {
  /**
   * Cập nhật thời gian hiện tại vào bảng login date bằng username
   * Input: username - String (Lấy từ accessToken)
   * Output: login_date đã được cập nhật
   */
  const sql = "UPDATE user SET login_date = now() WHERE username = ?";
  const value = [username];

  return new Promise((resolve, reject) => {
    connect.query(sql, value, async (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
}

async function updateTotalValue(totalValue, username) {
  /**
   * Cập nhật lại số dư trong tài khoản bằng username
   * Input: total_value - Integer, username - String (Lấy từ accessToken)
   * Output: Value have been updated
   */
  const sql = "UPDATE user_detail SET total_value = ? WHERE username = ?";
  const value = [totalValue, username];

  return new Promise((resolve, reject) => {
    connect.query(sql, value, async (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
}

async function updateTotalValueByDifference(totalWithdraw, username) {
  /**
   * Cập nhật lại số dư trong tài khoản bằng username
   * Input: total_value - Integer, username - String (Lấy từ accessToken)
   * Output: Value have been updated
   */
  const sql =
    "UPDATE user_detail SET total_value = total_value - ? WHERE username = ?";
  const value = [totalWithdraw, username];

  return new Promise((resolve, reject) => {
    connect.query(sql, value, async (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
}

async function getUserByUsername(username) {
  /* Lấy account bằng username
    Input: username, String
    Output: found user
    */
  const sql = "SELECT * FROM user WHERE username = ?";
  const value = [username];

  return new Promise((resolve, reject) => {
    connect.query(sql, value, async (err, result) => {
      if (err) throw err;
      resolve(result[0]);
    });
  });
}

async function getUserNameByPhoneNumber(phone) {
  /* Lấy username bằng số điện thoại
    Input: username, String
    Output: found username - String
    */
  const sql = "SELECT username FROM user_detail WHERE phone = ?";
  const value = [phone];

  return new Promise((resolve, reject) => {
    connect.query(sql, value, async (err, result) => {
      if (err) throw err;
      resolve(result[0]?.username);
    });
  });
}

async function getUserDetailByUserName(username) {
  /* Lấy account detail bằng username
    Input: username, String
    Output: found user detail
    */
  const sql = "SELECT * FROM user_detail WHERE username = ?";
  const value = [username];

  return new Promise((resolve, reject) => {
    connect.query(sql, value, async (err, result) => {
      if (err) throw err;
      resolve(result[0]);
    });
  });
}

const getUserStatusByUserName = (username) => {
  const sql = "SELECT status FROM user WHERE username = ?";
  const value = [username];

  return new Promise((resolve, reject) => {
    connect.query(sql, value, async (err, result) => {
      if (err) throw err;
      resolve(result[0]);
    });
  });
}

const getTranSHistoryByUsername = (username) =>
  new Promise((resolve, reject) => {
    connect.query(
      "SELECT * FROM bill a, user_detail b, withdraw c where a.username=b.username and a.username=c.username and a.username=?",
      [username],
      (err, result) => {
        if (err) reject(false);
        else {
          resolve(result);
        }
      }
    );
  });

async function updatePasswordById(id, newPass) {
  /**
   * Cập nhật password của một tài khoản bằng id
   * Input: id - String, newPass - String
   * Output: true nếu thành công, false ngược lại
   */
  const sql = "UPDATE user SET password = ? WHERE id = ?";
  const value = [newPass, id];

  return new Promise((resolve, reject) => {
    connect.query(sql, value, (err) => {
      if (err) reject(false);
    });
    resolve(true);
  });
}

async function updateStatusById(id, status) {
  /**
   * Cập nhật status của một tài khoản bằng id
   * Input: id - String, status - Integer
   * Output: true nếu thành công, false ngược lại
   */
  const sql = "UPDATE user SET status = ? WHERE id = ?";
  const value = [status, id];

  return new Promise((resolve, reject) => {
    connect.query(sql, value, (err) => {
      if (err) reject(false);
    });
    resolve(true);
  });
}

async function updateStatusByUsername(username, status) {
  /**
   * Cập nhật status của một tài khoản bằng Username
   * Input: Username - String, status - Integer
   * Output: true nếu thành công, false ngược lại
   */
  const sql = "UPDATE user SET status = ? WHERE username = ?";
  const value = [status, username];

  return new Promise((resolve, reject) => {
    connect.query(sql, value, (err) => {
      if (err) reject(false);
    });
    resolve(true);
  });
}

async function updateStatusAndLastModifiedByUsername(username, status,now) {
  const sql = "UPDATE user SET status = ?, last_modified = ? WHERE username = ?";
  const value = [status,now, username];

  return new Promise((resolve, reject) => {
    connect.query(sql, value, (err) => {
      if (err) reject(false);
    });
    resolve(true);
  });
}

const getUsernameByEmail = (email) => new Promise((resolve,reject) =>{
  connect.query('select username from user_detail where email = ?',[email],(err,result) =>{
    if(err) reject(err)
    else{
      resolve(result[0].username)
    }
  })
})

const getEmailPhoneExistOrNot = (email,phone)=> new Promise((resolve,reject) =>{
  connect.query('select email,phone from user_detail where email = ? or phone = ?',[email,phone],(err,result) =>{
    if(err) reject(err)
    else{
      
      resolve(result[0])
    }
  })
})
module.exports = {
  handlePostOTP,
  handleSelectFrontCMND,
  handleUpdateFrontCMND,
  handleSelectBackCMND,
  handleUpdateBackCMND,
  handleSelectOTP,
  handleChangePass,
  getUserByUsername,
  getUserDetailByUserName,
  getUserIntervalOneMinute,
  getTranSHistoryByUsername,
  createAnAccount,
  putAccCreatedIntoUser,
  updatePasswordById,
  updateStatusById,
  updateStatusByUsername,
  updateLoginDateToCurrent,
  updateTotalValue,
  updateTotalValueByDifference,
  increaseLoginAttemptsByUsername,
  updateAbnormal,
  getUserNameByPhoneNumber,
  getUserStatusByUserName,
  updateStatusAndLastModifiedByUsername,
  getUsernameByEmail,
  getEmailPhoneExistOrNot,

};
