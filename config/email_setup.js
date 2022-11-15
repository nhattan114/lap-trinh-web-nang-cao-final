var nodemailer = require('nodemailer'); // khai báo sử dụng module nodemailer
const transporterEmail = () => {
    //nếu = mail thầy không được thì xài mail này
    // return (nodemailer.createTransport({
    //   // config mail server
    //   service: "Gmail",
    //   auth: {
    //     user: "nchdang16012001@gmail.com",
    //     pass: "mlrafbeyqtvtqloe",
    //   },
    // }));
      
    // config mail server = mail thầy
   return(nodemailer.createTransport(smtpTransport({
        tls: {
            rejectUnauthorized: false
        },
        host: 'mail.phongdaotao.com',
        port: 25,
        secureConnection: false,
        auth: {
            user: 'sinhvien@phongdaotao.com',
            pass: 'svtdtu'
        }
    })));
  }

  module.exports = {
    transporterEmail,
  }