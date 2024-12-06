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
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
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
