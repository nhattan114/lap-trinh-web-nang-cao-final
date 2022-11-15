const jwt = require("jsonwebtoken");

const permissionNotNeededRoutes = [
  "GET /users/login",
  "POST /users/login",
  "GET /users/register",
  "POST /users/register",
  "GET /users/logout",

  "GET /users/account/resetpassword",
  "POST /users/account/resetpassword",
  "GET /users/account/resetpassword/sendOtp",
  "POST /users/account/resetpassword/sendOtpPost",
  "GET /users/account/resetpassword/changepassword",
  "POST /users/account/resetpassword/changepassword",
  "POST /users/account/resetpassword/resendOtpPost",
];

class AuthenticationController {
  async authenticateUser(req, res, next) {
    const token = req.cookies.accessToken;

    const routeKey = getRouteKey(req);
    const isAuthNotNeededRoute = permissionNotNeededRoutes.includes(routeKey);

    if (token) {
      // Đã đăng nhập
      req.userClaims = jwt.verify(token, process.env.TOKEN_KEY);

      if (req.userClaims.username === "admin") {
        let regex1 = /admin/;
        let regex2 = /api/;
        if (regex1.test(routeKey)||regex2.test(routeKey)) {
          next();
        } else {
          res.redirect("/admin");
        }
      } else {
        // Đăng nhập lần đầu thì chỉ cho vào đổi mật khẩu
        if (req.userClaims.status === -1) {
          let permissionFirstLoginRoutes = [
            "GET /users/first-login",
            "POST /users/first-login",
            "GET /users/logout",
          ];

          const isFirstLoginRoute =
            permissionFirstLoginRoutes.includes(routeKey);

          isFirstLoginRoute ? next() : res.redirect("/users/first-login");
        } else if (req.userClaims.status === 0) {
          // Chưa xác minh thì chỉ cho xem thông tin cá nhân và đổi mật khẩu

          let permissionNotConfirmRoutes = [
            "GET /users/change-password",
            "POST /users/change-password",
            "GET /users/logout",
            "GET /users/profile",
            "POST /users/profile",
          ];

          const isNotConfirmLoginRoute =
            permissionNotConfirmRoutes.includes(routeKey);

          isNotConfirmLoginRoute ? next() : res.redirect("/users/profile");
        } else {
          next();
        }
      }
    } else {
      isAuthNotNeededRoute ? next() : res.redirect("/users/login");
    }
  }

  async authenticateAdmin(req, res, next) {
    // Chỉ cho admin truy cập vào trang admin
    req?.userClaims.username === "admin" ? next() : res.redirect("/");
  }
}

function getRouteKey(req) {
  return `${req.method} ${req._parsedUrl.pathname}`;
}
module.exports = new AuthenticationController();
