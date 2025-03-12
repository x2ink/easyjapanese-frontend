"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const uni_modules_piniaPluginUnistorage_index = require("./uni_modules/pinia-plugin-unistorage/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/login/login.js";
  "./pages/register/register.js";
  "./pages/thesaurus/thesaurus.js";
  "./pages/search/search.js";
  "./pages/wordlist/wordlist.js";
  "./pages/learn/learn.js";
  "./pages/worddetail/worddetail.js";
  "./pages/addtrend/addtrend.js";
  "./pages/trenddetail/trenddetail.js";
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
  "./pages/feedback/feedback.js";
  "./pages/mybooks/mybooks.js";
  "./pages/mybookswordlist/mybookswordlist.js";
  "./pages/translate/translate.js";
  "./pages/browse/browse.js";
  "./pages/noticedetail/noticedetail.js";
  "./pages/likemsg/likemsg.js";
  "./pages/commentmsg/commentmsg.js";
  "./pages/userinfo/userinfo.js";
  "./pages/ranking/ranking.js";
  "./pages/share/share.js";
  "./pages/about/about.js";
  "./pages/setting/setting.js";
  "./pages/mytrend/mytrend.js";
  "./pages/repwd/repwd.js";
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
