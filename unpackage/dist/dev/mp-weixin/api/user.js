"use strict";
const utils_request = require("../utils/request.js");
const user = {
  getChartList() {
    return utils_request.http.get("note/info");
  },
  getCaptcha(type, email) {
    return utils_request.http.get(`captcha/${type}/${email}`);
  },
  register(data) {
    return utils_request.http.post(`register`, data);
  },
  login(type, data) {
    return utils_request.http.post(`login/${type}`, data);
  },
  wxLogin(data) {
    return utils_request.http.post(`wxlogin`, data);
  },
  getUserInfoSimple() {
    return utils_request.http.get(`user/info/simple`);
  },
  getConfig() {
    return utils_request.http.get(`config`);
  },
  updateConfig(data) {
    return utils_request.http.post(`config`, data);
  },
  setUserInfo(data) {
    return utils_request.http.post(`user/info`, data);
  },
  ranking() {
    return utils_request.http.get(`ranking`);
  },
  repwd(data) {
    return utils_request.http.post(`repwd`, data);
  }
};
exports.user = user;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/user.js.map
