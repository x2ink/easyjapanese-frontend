"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const stores_index = require("../../../stores/index.js");
if (!Array) {
  const _easycom_uv_avatar2 = common_vendor.resolveComponent("uv-avatar");
  const _easycom_wd_icon2 = common_vendor.resolveComponent("wd-icon");
  (_easycom_uv_avatar2 + _easycom_wd_icon2)();
}
const _easycom_uv_avatar = () => "../../../uni_modules/uv-avatar/components/uv-avatar/uv-avatar.js";
const _easycom_wd_icon = () => "../../../uni_modules/wot-design-uni/components/wd-icon/wd-icon.js";
if (!Math) {
  (_easycom_uv_avatar + _easycom_wd_icon)();
}
const _sfc_main = {
  __name: "self",
  setup(__props) {
    const getUserInfoSimple = async () => {
      try {
        const res = await api_index.$http.user.getUserInfoSimple();
        userInfo.value = res.data;
        stores_index.userStore().setUserInfo(userInfo.value);
      } catch (err) {
        common_vendor.index.__f__("log", "at pages/index/tabbar/self.vue:104", "登录错误", err);
      }
    };
    const goPage = (path, params) => {
      if (params) {
        common_vendor.index.navigateTo({
          url: `/pages/${path}/${path}${params}`
        });
      } else {
        common_vendor.index.navigateTo({
          url: `/pages/${path}/${path}`
        });
      }
    };
    const userInfo = common_vendor.ref({
      address: "",
      avatar: "",
      nickname: "",
      role: "",
      email: ""
    });
    common_vendor.onMounted(() => {
      getUserInfoSimple();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          size: "60",
          src: userInfo.value.avatar
        }),
        b: common_vendor.t(userInfo.value.nickname),
        c: common_vendor.t(userInfo.value.email),
        d: common_vendor.o(($event) => goPage("userinfo")),
        e: common_vendor.p({
          name: "arrow-right",
          size: "20px"
        }),
        f: common_vendor.o(($event) => goPage("mytrend")),
        g: common_vendor.p({
          name: "arrow-right",
          size: "20px"
        }),
        h: common_vendor.o(($event) => goPage("mybooks")),
        i: common_vendor.p({
          name: "arrow-right",
          size: "20px"
        }),
        j: common_vendor.o(($event) => goPage("ranking")),
        k: common_vendor.p({
          name: "arrow-right",
          size: "20px"
        }),
        l: common_vendor.o(($event) => goPage("setting")),
        m: common_vendor.p({
          name: "arrow-right",
          size: "20px"
        }),
        n: common_vendor.o(($event) => goPage("feedback")),
        o: common_vendor.p({
          name: "arrow-right",
          size: "20px"
        }),
        p: common_vendor.o(($event) => goPage("about")),
        q: common_vendor.p({
          name: "arrow-right",
          size: "20px"
        }),
        r: common_vendor.o(($event) => goPage("share"))
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-97502f50"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/index/tabbar/self.js.map
