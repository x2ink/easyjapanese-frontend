"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../store/index.js");
require("../../utils/request.js");
if (!Array) {
  const _easycom_wd_tabbar_item2 = common_vendor.resolveComponent("wd-tabbar-item");
  const _easycom_wd_tabbar2 = common_vendor.resolveComponent("wd-tabbar");
  (_easycom_wd_tabbar_item2 + _easycom_wd_tabbar2)();
}
const _easycom_wd_tabbar_item = () => "../../uni_modules/wot-design-uni/components/wd-tabbar-item/wd-tabbar-item.js";
const _easycom_wd_tabbar = () => "../../uni_modules/wot-design-uni/components/wd-tabbar/wd-tabbar.js";
if (!Math) {
  (StatusBar + Home + Community + Learn + Self + _easycom_wd_tabbar_item + _easycom_wd_tabbar)();
}
const StatusBar = () => "../../components/statusBar.js";
const Community = () => "./tabbar/community.js";
const Home = () => "./tabbar/home.js";
const Learn = () => "./tabbar/learn.js";
const Self = () => "./tabbar/self.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const tabbar = common_vendor.ref(0);
    common_vendor.onMounted(() => {
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: tabbar.value === 0
      }, tabbar.value === 0 ? {} : tabbar.value === 1 ? {} : tabbar.value === 2 ? {} : tabbar.value === 3 ? {} : {}, {
        b: tabbar.value === 1,
        c: tabbar.value === 2,
        d: tabbar.value === 3,
        e: common_vendor.p({
          title: "首页",
          icon: "home"
        }),
        f: common_vendor.p({
          title: "交流",
          icon: "chat"
        }),
        g: common_vendor.p({
          title: "学习",
          icon: "video1"
        }),
        h: common_vendor.p({
          title: "我的",
          icon: "user"
        }),
        i: common_vendor.o(($event) => tabbar.value = $event),
        j: common_vendor.p({
          shape: "round",
          fixed: true,
          safeAreaInsetBottom: true,
          placeholder: true,
          modelValue: tabbar.value
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
