const { check } = require("express-validator");
const connect = require("../config/db");
const bcrypt = require("bcrypt");
// Validator
// ***************
const registerValidator = [
  check("name")
    .exists()
    .withMessage("Please enter your name")
    .notEmpty()
    .withMessage("Name can not be empty"),
  check("email")
    .exists()
    .withMessage("Please enter your email")
    .notEmpty()
    .withMessage("Email can not be empty")
    .isEmail()
    .withMessage("This email is not valid")
    .custom((value) => {
      // Check email already exists in database
      return new Promise((resolve, reject) => {
        connect.query(
          "select * from customer where email=?",
          [value],
          (err, result) => {
            if (err) reject(new Error(err.message));
            else if (result.length > 0)
              reject(
                new Error(
                  "Email already exists. Login now or use another email to register"
                )
              );
            else resolve(true);
          }
        );
      });
    }),
  check("password")
    .exists()
    .withMessage("Please enter your password")
    .notEmpty()
    .withMessage("Password can not be empty")
    .isLength({ min: 8 })
    .withMessage("Password at least 8 letters "),
  check("rePassword")
    .exists()
    .withMessage("Please enter your re-password")
    .custom((value, { req }) => {
      // Check password and re-password are match
      if (value !== req.body.password) throw new Error("Re-password not match");
      return true;
    }),
];

const loginValidator = [
  check("username")
    .exists()
    .withMessage("Please enter your username")
    .notEmpty()
    .withMessage("Username can not be empty"),

  check("password")
    .exists()
    .withMessage("Please enter your password")
    .bail()
    .notEmpty()
    .withMessage("Password can not be empty")
    .bail()
    .isLength((min = 6))
    .withMessage("Password can not be less than 6 characters"),
];

const loginAdminValidator = [
  check("email")
    .exists()
    .withMessage("Please enter your email")
    .notEmpty()
    .withMessage("Email can not be empty")
    .isEmail()
    .withMessage("This email is not valid")
    .custom((value) => {
      // Check email already exists in database
      return new Promise((resolve, reject) => {
        connect.query(
          "select * from account where email=?",
          [value],
          (err, result) => {
            if (err) reject(new Error(err.message));
            else if (result.length === 0)
              reject(new Error("This email has not been registered yet."));
            resolve(true);
          }
        );
      });
    }),
  check("password")
    .exists()
    .withMessage("Please enter your password")
    .notEmpty()
    .withMessage("Password can not be empty")
    .custom(
      (value, { req }) =>
        new Promise((resolve, reject) => {
          // Check password is match
          connect.query(
            "select * from account where email=?",
            [req.body.email],
            (err, result) => {
              if (err) reject(new Error("Something went wrong!"));
              else if (!result.length)
                reject(new Error("Something went wrong!"));
              else {
                const accPass = result[0].password;
                userSession = result[0].name;
                const isMatch = bcrypt.compareSync(value, accPass);
                if (!isMatch)
                  reject("Your email address or password are not match");
                resolve(isMatch);
              }
            }
          );
        })
    ),
];

const changePassValidator = [
  check("currentPass")
    .exists()
    .withMessage("Please enter your current password")
    .bail()
    .notEmpty()
    .withMessage("Current password can not be empty")
    .bail()
    .isLength((min = 6))
    .withMessage("Password can not be less than 6 characters"),

  check("newPass")
    .exists()
    .withMessage("Please enter your new password")
    .bail()
    .notEmpty()
    .withMessage("New password can not be empty")
    .bail()
    .isLength((min = 6))
    .withMessage("Password can not be less than 6 characters"),

  check("renewPass")
    .exists()
    .withMessage("Please enter your confirm password")
    .bail()
    .notEmpty()
    .withMessage("Your confirm password can not be empty")
    .bail()
    .isLength((min = 6))
    .withMessage("Password can not be less than 6 characters"),
];

const firstLoginValidator = [
  check("newPass")
    .exists()
    .withMessage("Please enter your new password")
    .bail()
    .notEmpty()
    .withMessage("New password can not be empty")
    .bail()
    .isLength((min = 6))
    .withMessage("Password can not be less than 6 characters"),
  check("renewPass")
    .exists()
    .withMessage("Please enter your confirm password")
    .bail()
    .notEmpty()
    .withMessage("Your confirm password can not be empty")
    .bail()
    .isLength((min = 6))
    .withMessage("Password can not be less than 6 characters"),
];

const requestOtpToMailValidator = [
  check("email")
    .exists()
    .withMessage("Please enter email")
    .notEmpty()
    .withMessage("Email can not be empty"),
  
];

const withdrawValidator = [
  check("cardNumber")
    .exists()
    .withMessage("Please enter your card number")
    .bail()
    .notEmpty()
    .withMessage("Card number can not be empty"),

  check("expireDate")
    .exists()
    .withMessage("Please enter your credit card's expire date")
    .bail()
    .notEmpty()
    .withMessage("Expire date can not be empty")
    .bail()
    .isDate()
    .withMessage("expireDate must be a Date type"),

  check("cvv")
    .exists()
    .withMessage("Please enter your CVV")
    .notEmpty()
    .withMessage("CVV can not be empty")
    .bail()
    .isNumeric()
    .withMessage("CVV can only contains numbers"),

  check("amount")
    .exists()
    .withMessage("Please enter your amount")
    .notEmpty()
    .withMessage("Amount of withdrawal can not be empty")
    .isNumeric()
    .withMessage("Amount can only contains numbers"),

  check("note")
    .exists()
    .withMessage("Please enter your Note")
    .notEmpty()
    .withMessage("User's note can not be empty"),
];

const rechargeValidator = [
  check("card_number")
    .exists()
    .withMessage("Please enter your card number")
    .bail()
    .notEmpty()
    .withMessage("Card number can not be empty"),

  check("expire_date")
    .exists()
    .withMessage("Please enter your credit card's expire date")
    .bail()
    .notEmpty()
    .withMessage("Expire date can not be empty")
    .bail()
    .isDate()
    .withMessage("expireDate must be a Date type"),

  check("cvv")
    .exists()
    .withMessage("Please enter your CVV")
    .notEmpty()
    .withMessage("CVV can not be empty")
    .bail()
    .isNumeric()
    .withMessage("CVV can only contains numbers"),

  check("money")
    .exists()
    .withMessage("Please enter your amount")
    .notEmpty()
    .withMessage("Amount of withdrawal can not be empty")
    .isNumeric()
    .withMessage("Amount can only contains numbers"),
];

const adminWithdrawValidator = [
  check("id")
    .exists()
    .withMessage("Please enter withdraw's id")
    .bail()
    .notEmpty()
    .withMessage("withdraw's id can not be empty")
    .bail()
    .isNumeric()
    .withMessage("withdraw's id must be of Integer type"),

  check("isApproved")
    .exists()
    .withMessage("Please enter isApproved")
    .bail()
    .notEmpty()
    .withMessage("isApproved can't be emtpy")
    .bail(),
];
module.exports = {
  registerValidator,
  loginValidator,
  loginAdminValidator,
  changePassValidator,
  firstLoginValidator,
  requestOtpToMailValidator,
  withdrawValidator,
  adminWithdrawValidator,
  rechargeValidator,
};
