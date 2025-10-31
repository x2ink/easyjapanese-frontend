"use strict";
const api_user = require("./user.js");
const api_word = require("./word.js");
const api_common = require("./common.js");
const $http = {
  user: api_user.user,
  word: api_word.word,
  common: api_common.common
};
exports.$http = $http;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/index.js.map
