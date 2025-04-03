"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../utils/request.js");
const stores_index = require("../../stores/index.js");
if (!Math) {
  (Home + Word + Self)();
}
const Home = () => "./pages/home/home.js";
const Word = () => "./pages/word/word.js";
const Self = () => "./pages/self/self.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const tabbar = common_vendor.ref(0);
    common_vendor.onMounted(() => {
      stores_index.userStore().setUserInfo();
    });
    return (_ctx, _cache) => {
      return {
        a: tabbar.value === 0,
        b: tabbar.value === 1,
        c: tabbar.value === 2,
        d: common_vendor.o(($event) => tabbar.value = 0),
        e: tabbar.value == 0 ? 1 : "",
        f: common_vendor.o(($event) => tabbar.value = 1),
        g: tabbar.value == 1 ? 1 : "",
        h: common_vendor.o(($event) => tabbar.value = 2),
        i: tabbar.value == 2 ? 1 : ""
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
