"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_wd_icon2 = common_vendor.resolveComponent("wd-icon");
  const _easycom_wd_button2 = common_vendor.resolveComponent("wd-button");
  (_easycom_wd_icon2 + _easycom_wd_button2)();
}
const _easycom_wd_icon = () => "../../../uni_modules/wot-design-uni/components/wd-icon/wd-icon.js";
const _easycom_wd_button = () => "../../../uni_modules/wot-design-uni/components/wd-button/wd-button.js";
if (!Math) {
  (Statusbar + _easycom_wd_icon + _easycom_wd_button)();
}
const Statusbar = () => "../../../components/statusbar2.js";
const _sfc_main = {
  __name: "learn",
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          name: "search",
          size: "22px",
          color: "#979797"
        }),
        b: common_vendor.p({
          color: "#999",
          name: "arrow-right",
          size: "16px"
        }),
        c: common_vendor.f(10, (_, k0, i0) => {
          return {};
        }),
        d: common_vendor.f(10, (_, k0, i0) => {
          return {
            a: common_vendor.f(5, (_2, k1, i1) => {
              return {
                a: "5e4418dc-3-" + i0 + "-" + i1
              };
            })
          };
        }),
        e: common_vendor.p({
          ["custom-class"]: "btn",
          size: "small"
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5e4418dc"]]);
wx.createComponent(Component);
