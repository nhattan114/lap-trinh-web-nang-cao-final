const { handlePostDeposit,
    getUserDepositInfo,
    handleSelectDepositByPhone,
    handleUpdateTotalValueOfSender,
    handleUpdateTotalValueOfReceiver,
    selectReceiverValue, selectReceiverName,
    handleUpdateStatusDeposit5m,
    handleSelectUserDetail, 
    getSenderListByUser,
    getRecieverListByUser} = require('../models/deposit.model');
const { handlePostOTP, handleSelectOTP } = require('../models/user.model');
const { validationResult } = require('express-validator');
var nodemailer = require('nodemailer'); // khai báo sử dụng module nodemailer
var smtpTransport = require('nodemailer-smtp-transport');
const { dataProcess, formatDateTime, encodeStatusCode, encodeTransistionCode, formatMoney } = require('../config/helper');
const { transporterEmail } = require('../config/email_setup');

// handleSelectUserDetail(req.userClaims);

const PostDeposit = async (req, res) => {
  let result = validationResult(req);
  if (result.errors.length === 0) {
    let { phone_receiver, money, feeperson, note } = req.body;
    // const phone = req.session.phone;
    // const phone = '0908123456';
    const username = req.userClaims.username;
    const phone = (await getUserDepositInfo(username)).phone;

    let status = 1;
    let fee = money * 0.05;

    let date = new Date();
    // const email = 'tdtnguyendang@gmail.com';

    const email = (await getUserDepositInfo(username)).email;
    const otp = Math.floor(100000 + Math.random() * 900000);

        var transporter = transporterEmail();
        // var transporter = nodemailer.createTransport({
        //     // config mail server
        //     service: "Gmail",
        //     auth: {
        //         user: "nchdang16012001@gmail.com",
        //         pass: "mlrafbeyqtvtqloe",
        //     },
        // });

    var mainOptions = {
      // thiết lập đối tượng, nội dung gửi mail
      from: "sinhvien@phongdaotao.com",
      to: email,
      subject: "OTP code",
      html:
        "<p>You have got a code: " +
        otp +
        "<br></br> Code will expired in 1 minute </p>",
    };

    transporter.sendMail(mainOptions, async function (err, info) {
      if (err) {
        // console.log(err);
        req.session.flash = {
          type: "danger",
          intro: "Oops!",
          message: "Some thing went wrong",
        };

        return res.redirect("/deposit");
      } else {
        //lưu vào db
        let time = Date.now() + 60000;
        let day = new Date(time);
        // let email = req.session.email;
        await handlePostOTP(email, otp, day);
        await handlePostDeposit(
          phone,
          phone_receiver,
          money,
          fee,
          feeperson,
          note,
          status,
          date
        );
        req.session.flash = {
          type: "success",
          intro: "Congratulation!",
          message: "Please check OTP in your email",
        };
        return res.redirect("/deposit/sendOtp");
      }
    });
  } else {
    const errors = result.mapped();
    let errorMessage = errors[Object.keys(errors)[0]].msg;
    req.session.flash = {
      type: "danger",
      intro: "Oops!",
      message: errorMessage,
    };
    res.redirect("/deposit");
  }
};

const getDeposit = async (req, res) => {
  // const username = req.session.username
  const username = req.userClaims.username;
  let data = await getUserDepositInfo(username);
  data = {
    id: data.id,
    username: data.username,
    phone: data.phone,
    email: data.email,
    name: data.name,
    date_of_birth: formatDateTime(data.date_of_birth),
    address: data.address,
    front_cmnd: data.front_cmnd,
    back_cmnd: data.back_cmnd,
    total_value: formatMoney(data.total_value)
  }
  console.log(data)
  //console.log(data)
  res.render("exchange/deposit", { title: "Deposit", data });
};

const sendOtp = (req, res) => {
  res.render("exchange/sendOtp", { title: "sendOtp" });
};

const sendOtpPost = async (req, res) => {
  // let email = req.session.email;

  const username = req.userClaims.username;
  const email = (await getUserDepositInfo(username)).email;
  let { otpcode } = req.body;
  let otpdatabase = await handleSelectOTP(email);
  const result = Object.values(JSON.parse(JSON.stringify(otpdatabase)));
  let rightnow = new Date(Date.now()).getTime();
  let expiredtime = new Date(result[3]).getTime();

  // const phone = req.session.phone;
  // const phone = '0908123456';
  const phone = (await getUserDepositInfo(username)).phone;
  console.log(phone);
  let depositByPhone = await handleSelectDepositByPhone(phone);
  // console.log(depositByPhone.value);
  if (otpcode === result[2] && expiredtime > rightnow) {
    if (depositByPhone.value < 5000000) {
      let moneyDepositFeeReceiver = depositByPhone.value;
      if (depositByPhone.feeperson == "receiver") {
        moneyDepositFeeReceiver = depositByPhone.value - depositByPhone.fee;
        // console.log(moneyDepositFeeReceiver)
      } else {
        depositByPhone.value = +depositByPhone.value + +depositByPhone.fee;
      }
      await handleUpdateTotalValueOfSender(
        depositByPhone.value,
        depositByPhone.phone_sender
      );
      await handleUpdateTotalValueOfReceiver(
        moneyDepositFeeReceiver,
        depositByPhone.phone_receiver
      );
      let email_receiver = await selectReceiverName(
        depositByPhone.phone_receiver
      );

            //email to receiver
            var transporter = transporterEmail();
            // var transporter = nodemailer.createTransport({
            //     // config mail server
            //     service: "Gmail",
            //     auth: {
            //         user: "nchdang16012001@gmail.com",
            //         pass: "mlrafbeyqtvtqloe",
            //     },
            // });

      // var transporter = nodemailer.createTransport(smtpTransport({ // config mail server
      //     tls: {
      //         rejectUnauthorized: false
      //     },
      //     host: 'mail.phongdaotao.com',
      //     port: 25,
      //     secureConnection: false,
      //     auth: {
      //         user: 'sinhvien@phongdaotao.com',
      //         pass: 'svtdtu'
      //     }
      // }));

      var mainOptions = {
        // thiết lập đối tượng, nội dung gửi mail
        from: "sinhvien@phongdaotao.com",
        to: email_receiver,
        subject: "Confirm Deposit",
        html:
          "<p>Sender: " +
          depositByPhone.phone_sender +
          "<br></br> Receiver: " +
          depositByPhone.phone_receiver +
          "<br></br> Money:" +
          moneyDepositFeeReceiver +
          "</p>",
      };

      transporter.sendMail(mainOptions, async function (err, info) {
        if (err) {
          // console.log(err);
          req.session.flash = {
            type: "danger",
            intro: "Oops!",
            message: "Some thing went wrong",
          };

          return res.redirect("/deposit");
        } else {
          req.session.flash = {
            type: "success",
            intro: "Congratulation!",
            message:
              "OTP is right. And money is deposit to receiver. Receiver please check mail!",
          };
          return res.redirect("/deposit/successDeposit");
        }
      });
    } else {
      if (depositByPhone.value > 5000000) {
        await handleUpdateStatusDeposit5m(phone);
        req.session.flash = {
          type: "success",
          intro: "Congratulation!",
          message:
            "OTP is right. And money is pending by admin because value is bigger than 5m",
        };
        res.redirect("/deposit/pendingDeposit");
      }
    }
  } else {
    req.session.flash = {
      type: "danger",
      intro: "Oops!",
      message: "Your OTP not match or OTP expired",
    };
    res.redirect("/deposit/sendotp");
  }
};

const getSuccessDeposit = (req, res) => {
  res.render("exchange/successDeposit", { title: "Deposit successfully" });
};

const getPendingDeposit = (req, res) => {
  res.render("exchange/pendingDeposit", { title: "Deposit successfully" });
};

const getUserInfomation = async (req, res) => {
  // const username = req.session.username
  const phone = req.body.phone;
  console.log(phone);
  if (phone.length != 10) {
    return res.json({
      code: 1,
      message: "Phone must have 10 number",
    });
  } else {
    try {
      // console.log(phone)
      let data = await selectReceiverValue(phone);
      // console.log(data);
      if (data == undefined) {
        return res.json({
          code: 1,
          message: "Phone not valid please try again",
        });
      } else {
        data = {
          username: data.username,
          phone: data.phone,
          email: data.email,
          name: data.name,
          date_of_birth: data.date_of_birth,
          address: data.address,
          total_value: data.total_value,
        };
        return res.json({
          code: 0,
          message: "Get data successful!",
          data,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  }
};

const getUserInfo = async (req, res) => {
  // const username = req.session.username
  // const username = 'haidang'
  const username = req.userClaims.username;
  let data = await getUserDepositInfo(username);
  data = {
    username: data.username,
    phone: data.phone,
    email: data.email,
    name: data.name,
    date_of_birth: data.date_of_birth,
    address: data.address,
    total_value: data.total_value,
  };
  res.json({
    code: 0,
    message: "Get data successful!",
    data,
  });
};

const getSenderByUser = async (req, res) => {
    const myUsername = req.query["username"]
    let username
    if(myUsername!==undefined){
        username = myUsername
    }else{
        const userData = req.userClaims
        username = userData.username;
    }
    try {
        const rawData = await getSenderListByUser(username)
        console.log(rawData)
        data = rawData.map(e => ({
            id: e.id,
            phone_receiver: e.phone_receiver,
            value: formatMoney(e.value),
            fee: formatMoney(e.fee),
            feeperson: e.feeperson,
            note: e.note,
            status: encodeTransistionCode(e.status),
            statusCode: e.status,
            date: formatDateTime(e.date),
        }))
        return res.json({
            code: 0,
            message: "Get sender data successful",
            data
        })
    } catch (error) {
        return res.json({
            code: 1,
            message: error.message,
        })
    }
}

const getReceiverByUser = async (req,res)=>{
    const myUsername = req.query["username"]
    let username
    if(myUsername!==undefined){
        username = myUsername
    }else{
        const userData = req.userClaims
        username = userData.username;
    }
    try {
        const rawData = await getRecieverListByUser(username)
        console.log(rawData)
        data = rawData.map(e => ({
            id: e.id,
            phone_sender: e.phone_sender,
            value: formatMoney(e.value),
            fee: formatMoney(e.fee),
            feeperson: e.feeperson,
            note: e.note,
            status: encodeTransistionCode(e.status),
            statusCode: e.status,
            date: formatDateTime(e.date),
        }))
        return res.json({
            code: 0,
            message: "Get receiver data successful",
            data
        })
    } catch (error) {
        return res.json({
            code: 1,
            message: error.message,
        })
    }
}

module.exports = {
  PostDeposit,
  sendOtp,
  getDeposit,
  getUserInfo,
  sendOtpPost,
  getSuccessDeposit,
  getPendingDeposit,
  getUserInfomation,
  getSenderByUser,
  getReceiverByUser,
};
