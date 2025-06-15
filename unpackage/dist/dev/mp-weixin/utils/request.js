"use strict";
const common_vendor = require("../common/vendor.js");
const api_index = require("../api/index.js");
const stores_index = require("../stores/index.js");
var baseUrl;
{
  common_vendor.index.__f__("log", "at utils/request.js:3", "开发环境");
  baseUrl = "http://192.168.0.102:8080/";
}
const http = {
  baseUrl,
  request(config) {
    config = beforeRequest(config);
    config.url = this.baseUrl + config.url;
    return new Promise((resolve, reject) => {
      common_vendor.index.request(config).then((res) => {
        const response = beforeResponse(config, res);
        resolve(response);
      }).catch((err) => {
        errorHandle();
        reject(err);
      });
    });
  },
  get(url, params) {
    return this.request({
      url,
      params,
      method: "GET"
    });
  },
  post(url, data) {
    return this.request({
      url,
      data,
      method: "POST"
    });
  },
  put(url, data) {
    return this.request({
      url,
      data,
      method: "PUT"
    });
  },
  delete(url, data) {
    return this.request({
      url,
      data,
      method: "DELETE"
    });
  }
};
const beforeRequest = (config) => {
  let token = stores_index.userStore().token;
  config.header = {
    "Authorization": token
  };
  return config;
};
const beforeResponse = async (config, response) => {
  const {
    statusCode,
    data
  } = response;
  if (statusCode >= 400 && statusCode < 500) {
    if (statusCode == 401) {
      if (data.code === 4001) {
        try {
          const tokenRes = await api_index.$http.common.retoken(stores_index.userStore().userInfo.id);
          common_vendor.index.__f__("log", "at utils/request.js:76", tokenRes);
          stores_index.userStore().setToken(tokenRes.data);
          config.header = {
            "Authorization": tokenRes.data
          };
          config.url = config.url.replace(http.baseUrl, "");
          const res = await http.request(config);
          return new Promise((resolve, reject) => {
            resolve(res);
          });
        } catch (err) {
          common_vendor.index.navigateTo({
            url: "/pages/login/login"
          });
          return new Promise((resolve, reject) => {
            reject(response.data);
          });
        }
      } else {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
        return new Promise((resolve, reject) => {
          reject(response.data);
        });
      }
    } else {
      return new Promise((resolve, reject) => {
        reject(response.data);
      });
    }
  } else if (statusCode >= 500) {
    return new Promise((resolve, reject) => {
      reject(response.data);
    });
  } else {
    return new Promise((resolve, reject) => {
      resolve(response.data);
    });
  }
};
const errorHandle = (err) => {
  common_vendor.index.__f__("log", "at utils/request.js:119", "网络异常,", err);
};
exports.http = http;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
