const connect = require("../config/db");

const getTranSHistoryByUsername = (username) =>
  new Promise((resolve, reject) => {
    connect.query(
      "SELECT * FROM withdraw a, user_detail b where a.username=b.username and a.username=?",
      [username],
      (err, result) => {
        if (err) reject(false);
        else {
          resolve(result);
        }
      }
    );
  });

module.exports = {
  getTranSHistoryByUsername,
};
