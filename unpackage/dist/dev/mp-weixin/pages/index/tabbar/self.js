"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_uv_avatar2 = common_vendor.resolveComponent("uv-avatar");
  const _easycom_wd_icon2 = common_vendor.resolveComponent("wd-icon");
  const _easycom_wd_progress2 = common_vendor.resolveComponent("wd-progress");
  (_easycom_uv_avatar2 + _easycom_wd_icon2 + _easycom_wd_progress2)();
}
const _easycom_uv_avatar = () => "../../../uni_modules/uv-avatar/components/uv-avatar/uv-avatar.js";
const _easycom_wd_icon = () => "../../../uni_modules/wot-design-uni/components/wd-icon/wd-icon.js";
const _easycom_wd_progress = () => "../../../uni_modules/wot-design-uni/components/wd-progress/wd-progress.js";
if (!Math) {
  (Statusbar + _easycom_uv_avatar + _easycom_wd_icon + _easycom_wd_progress)();
}
const Statusbar = () => "../../../components/statusbar2.js";
const _sfc_main = {
  __name: "self",
  setup(__props) {
    common_vendor.onMounted(() => {
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          size: "60",
          text: "李"
        }),
        b: common_vendor.p({
          name: "add-circle",
          size: "20px"
        }),
        c: common_vendor.p({
          percentage: 30
        }),
        d: common_vendor.p({
          name: "add-circle",
          size: "20px"
        }),
        e: common_vendor.p({
          name: "add-circle",
          size: "20px"
        }),
        f: common_vendor.p({
          name: "arrow-right",
          size: "22px"
        }),
        g: common_vendor.p({
          name: "arrow-right",
          size: "22px"
        }),
        h: common_vendor.p({
          name: "arrow-right",
          size: "22px"
        }),
        i: common_vendor.p({
          name: "arrow-right",
          size: "22px"
        }),
        j: common_vendor.p({
          name: "arrow-right",
          size: "22px"
        }),
        k: common_vendor.p({
          name: "arrow-right",
          size: "22px"
        }),
        l: common_vendor.p({
          name: "arrow-right",
          size: "22px"
        }),
        m: common_vendor.p({
          name: "arrow-right",
          size: "22px"
        }),
        n: common_vendor.p({
          name: "arrow-right",
          size: "22px"
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-97502f50"]]);
wx.createComponent(Component);
