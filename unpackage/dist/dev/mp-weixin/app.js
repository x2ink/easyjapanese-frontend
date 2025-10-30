"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const uni_modules_piniaPluginUnistorage_index = require("./uni_modules/pinia-plugin-unistorage/index.js");
if (!Math) {
  "./pages/index/index/index.js";
  "./pages/login/login.js";
  "./pages/word/thesaurus/thesaurus.js";
  "./pages/word/search/search.js";
  "./pages/learn/learn/learn.js";
  "./pages/word/worddetail/worddetail.js";
  "./pages/word/writefrommemory/writefrommemory.js";
  "./pages/tools/verbtransfiguration/verbtransfiguration.js";
  "./pages/tools/fiftysounds/fiftysounds.js";
  "./pages/tools/grammar/grammar.js";
  "./pages/tools/grammardetail/grammardetail.js";
  "./pages/tools/commonwords/commonwords.js";
  "./pages/word/mybookswordlist/mybookswordlist.js";
  "./pages/tools/translate/translate.js";
  "./pages/word/followread/followread.js";
  "./pages/word/edit/edit.js";
  "./pages/other/feedback/feedback.js";
  "./pages/other/about/about.js";
  "./pages/tools/notedetail/notedetail.js";
  "./pages/tools/notes/notes.js";
  "./pages/learn/review/review.js";
  "./pages/other/browse/browse.js";
  "./pages/other/setplan/setplan.js";
  "./pages/word/review/review.js";
  "./pages/word/dictation/dictation.js";
  "./pages/test/test.js";
}
const _sfc_main = {
  onShareAppMessage() {
    return {
      title: "邀新打榜赢全年护肤大礼包",
      path: "/pages/index/index/index"
    };
  },
  methods: {
    globalShare() {
      common_vendor.index.onAppRoute((res) => {
        const pages = getCurrentPages();
        const view = pages[pages.length - 1];
        if (view) {
          common_vendor.index.showShareMenu({
            withShareTicket: true,
            menus: ["shareAppMessage", "shareTimeline"]
          });
          let data = {
            title: "邀新打榜赢全年护肤大礼包",
            path: "pages/index/index/index"
          };
          view.onShareTimeline = () => {
            return data;
          };
          view.onShareAppMessage = () => {
            return data;
          };
        }
      });
    }
  },
  onLaunch: function() {
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:40", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:43", "App Hide");
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
