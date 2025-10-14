"use strict";
const utils_request = require("../utils/request.js");
const user = {
  setUserInfo(data) {
    return utils_request.http.post(`user/info`, data);
  },
  wxLogin(data) {
    return utils_request.http.post(`wxlogin`, data);
  },
  getUserInfoSimple() {
    return utils_request.http.get(`user/info`);
  },
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
  getConfig() {
    return utils_request.http.get(`config`);
  },
  updateConfig(data) {
    return utils_request.http.post(`config`, data);
  },
  ranking() {
    return utils_request.http.get(`ranking`);
  },
  repwd(data) {
    return utils_request.http.post(`repwd`, data);
  },
  reemail(data) {
    return utils_request.http.post(`reemail`, data);
  }
};
exports.user = user;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/user.js.map
