"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const uni_modules_piniaPluginUnistorage_index = require("./uni_modules/pinia-plugin-unistorage/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/login/login.js";
  "./pages/register/register.js";
  "./pages/thesaurus/thesaurus.js";
  "./pages/word/search/search.js";
  "./pages/wordlist/wordlist.js";
  "./pages/learn/learn.js";
  "./pages/word/worddetail/worddetail.js";
  "./pages/fastmode/fastmode.js";
  "./pages/writefrommemory/writefrommemory.js";
  "./pages/todaylearn/todaylearn.js";
  "./pages/review/review.js";
  "./pages/articledetail/articledetail.js";
  "./pages/todayreview/todayreview.js";
  "./pages/verbtransfiguration/verbtransfiguration.js";
  "./pages/fiftysounds/fiftysounds.js";
  "./pages/grammar/grammar.js";
  "./pages/grammardetail/grammardetail.js";
  "./pages/radiostation/radiostation.js";
  "./pages/player/player.js";
  "./pages/commonwords/commonwords.js";
  "./pages/word/mybooks/mybooks.js";
  "./pages/word/mybookswordlist/mybookswordlist.js";
  "./pages/translate/translate.js";
  "./pages/noticedetail/noticedetail.js";
  "./pages/msg/like/like.js";
  "./pages/msg/comment/comment.js";
  "./pages/ranking/ranking.js";
  "./pages/repwd/repwd.js";
  "./pages/word/followread/followread.js";
  "./pages/word/edit/edit.js";
  "./pages/word/edithistory/edithistory.js";
  "./trendpages/addtrend/addtrend.js";
  "./trendpages/trenddetail/trenddetail.js";
  "./trendpages/mytrend/mytrend.js";
  "./userpages/userinfo/userinfo.js";
  "./otherpages/browse/browse.js";
  "./otherpages/about/about.js";
  "./otherpages/share/share.js";
  "./otherpages/feedback/feedback.js";
  "./otherpages/setting/setting.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:7", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:10", "App Hide");
  }
};
function createApp() {
  const pinia = common_vendor.createPinia();
  pinia.use(uni_modules_piniaPluginUnistorage_index.createUnistorage());
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(pinia);
  return {
    app,
    pinia
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
