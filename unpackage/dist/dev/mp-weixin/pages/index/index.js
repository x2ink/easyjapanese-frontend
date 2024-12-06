"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../utils/request.js");
require("../../stores/release/user.js");
require("../../stores/test/user.js");
if (!Array) {
  const _easycom_wd_icon2 = common_vendor.resolveComponent("wd-icon");
  const _easycom_wd_badge2 = common_vendor.resolveComponent("wd-badge");
  const _easycom_wd_fab2 = common_vendor.resolveComponent("wd-fab");
  (_easycom_wd_icon2 + _easycom_wd_badge2 + _easycom_wd_fab2)();
}
const _easycom_wd_icon = () => "../../uni_modules/wot-design-uni/components/wd-icon/wd-icon.js";
const _easycom_wd_badge = () => "../../uni_modules/wot-design-uni/components/wd-badge/wd-badge.js";
const _easycom_wd_fab = () => "../../uni_modules/wot-design-uni/components/wd-fab/wd-fab.js";
if (!Math) {
  (StatusBar + Home + Community + Learn + Self + Tabbar + _easycom_wd_icon + _easycom_wd_badge + _easycom_wd_fab)();
}
const StatusBar = () => "../../components/statusBar.js";
const Community = () => "./tabbar/community.js";
const Home = () => "./tabbar/home.js";
const Learn = () => "./tabbar/learn.js";
const Self = () => "./tabbar/self.js";
const Tabbar = () => "../../components/tabbar.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const tabbar = common_vendor.ref(0);
    const tabbarChange = (e) => {
      tabbar.value = e.value;
    };
    common_vendor.onMounted(() => {
    });
    return (_ctx, _cache) => {
      return {
        a: tabbar.value === 0,
        b: tabbar.value === 1,
        c: tabbar.value === 2,
        d: tabbar.value === 3,
        e: common_vendor.o(tabbarChange),
        f: common_vendor.p({
          name: "mail",
          size: "25px",
          color: "#ffffff"
        }),
        g: common_vendor.p({
          max: 10,
          ["is-dot"]: true,
          modelValue: "12"
        }),
        h: common_vendor.p({
          type: "warning",
          position: "right-bottom"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
