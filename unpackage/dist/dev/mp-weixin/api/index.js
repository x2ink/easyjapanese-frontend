"use strict";
const api_user = require("./user.js");
const api_word = require("./word.js");
const api_trend = require("./trend.js");
const api_common = require("./common.js");
const api_comment = require("./comment.js");
const api_article = require("./article.js");
const $http = {
  user: api_user.user,
  word: api_word.word,
  trend: api_trend.trend,
  common: api_common.common,
  comment: api_comment.comment,
  article: api_article.article
};
exports.$http = $http;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/index.js.map
