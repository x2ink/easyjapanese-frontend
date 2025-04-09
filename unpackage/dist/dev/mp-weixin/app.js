"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const uni_modules_piniaPluginUnistorage_index = require("./uni_modules/pinia-plugin-unistorage/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/login/login.js";
  "./pages/word/thesaurus/thesaurus.js";
  "./pages/word/search/search.js";
  "./pages/word/wordlist/wordlist.js";
  "./pages/word/learn/learn.js";
  "./pages/word/worddetail/worddetail.js";
  "./pages/fastmode/fastmode.js";
  "./pages/word/writefrommemory/writefrommemory.js";
  "./pages/todaylearn/todaylearn.js";
  "./pages/review/review.js";
  "./pages/todayreview/todayreview.js";
  "./pages/tools/verbtransfiguration/verbtransfiguration.js";
  "./pages/tools/fiftysounds/fiftysounds.js";
  "./pages/tools/grammar/grammar.js";
  "./pages/tools/grammardetail/grammardetail.js";
  "./pages/tools/commonwords/commonwords.js";
  "./pages/word/mybooks/mybooks.js";
  "./pages/word/mybookswordlist/mybookswordlist.js";
  "./pages/tools/translate/translate.js";
  "./pages/msg/noticedetail/noticedetail.js";
  "./pages/msg/like/like.js";
  "./pages/msg/comment/comment.js";
  "./pages/word/followread/followread.js";
  "./pages/word/edit/edit.js";
  "./pages/test/test.js";
  "./pages/word/lookwords/lookwords.js";
  "./pages/other/feedback/feedback.js";
  "./pages/other/about/about.js";
  "./pages/tools/notedetail/notedetail.js";
  "./pages/tools/notes/notes.js";
  "./trendpages/addtrend/addtrend.js";
  "./trendpages/trenddetail/trenddetail.js";
  "./trendpages/mytrend/mytrend.js";
  "./userpages/userinfo/userinfo.js";
  "./userpages/repwd/repwd.js";
  "./userpages/reemail/reemail.js";
  "./otherpages/ranking/ranking.js";
  "./otherpages/browse/browse.js";
  "./otherpages/share/share.js";
  "./otherpages/setting/setting.js";
  "./otherpages/setplan/setplan.js";
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
