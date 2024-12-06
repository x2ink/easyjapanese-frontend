"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_wd_icon2 = common_vendor.resolveComponent("wd-icon");
  const _easycom_wd_progress2 = common_vendor.resolveComponent("wd-progress");
  const _easycom_wd_button2 = common_vendor.resolveComponent("wd-button");
  const _easycom_uv_scroll_list2 = common_vendor.resolveComponent("uv-scroll-list");
  const _easycom_uv_avatar2 = common_vendor.resolveComponent("uv-avatar");
  (_easycom_wd_icon2 + _easycom_wd_progress2 + _easycom_wd_button2 + _easycom_uv_scroll_list2 + _easycom_uv_avatar2)();
}
const _easycom_wd_icon = () => "../../../uni_modules/wot-design-uni/components/wd-icon/wd-icon.js";
const _easycom_wd_progress = () => "../../../uni_modules/wot-design-uni/components/wd-progress/wd-progress.js";
const _easycom_wd_button = () => "../../../uni_modules/wot-design-uni/components/wd-button/wd-button.js";
const _easycom_uv_scroll_list = () => "../../../uni_modules/uv-scroll-list/components/uv-scroll-list/uv-scroll-list.js";
const _easycom_uv_avatar = () => "../../../uni_modules/uv-avatar/components/uv-avatar/uv-avatar.js";
if (!Math) {
  (Statusbar + _easycom_wd_icon + _easycom_wd_progress + _easycom_wd_button + _easycom_uv_scroll_list + _easycom_uv_avatar + Setplan)();
}
const Statusbar = () => "../../../components/statusbar2.js";
const Setplan = () => "../../../components/setplan.js";
const _sfc_main = {
  __name: "home",
  setup(__props) {
    const goPage = (path) => {
      common_vendor.index.navigateTo({
        url: `/pages/${path}/${path}`
      });
    };
    const setPlanRef = common_vendor.ref(null);
    const openPlan = () => {
      setPlanRef.value.show = true;
    };
    const toolList = common_vendor.ref([{
      name: "动词变形",
      image: "../../static/duo-icons--palette.png"
    }, {
      name: "考试宝典",
      image: "../../static/duo-icons--book-2.png"
    }, {
      name: "口语练习",
      image: "../../static/duo-icons--user.png"
    }, {
      name: "听力突破",
      image: "../../static/duo-icons--disk.png"
    }, {
      name: "情景对话",
      image: "../../static/duo-icons--message-3.png"
    }, {
      name: "漫画日语",
      image: "../../static/duo-icons--book.png"
    }, {
      name: "免费动漫",
      image: "../../static/duo-icons--clapperboard.png"
    }]);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          name: "search",
          size: "22px",
          color: "#979797"
        }),
        b: common_vendor.o(($event) => goPage("search")),
        c: common_vendor.o(openPlan),
        d: common_vendor.p({
          name: "arrow-right",
          size: "19px"
        }),
        e: common_vendor.o(($event) => goPage("wordlist")),
        f: common_vendor.o(($event) => goPage("wordlist")),
        g: common_vendor.p({
          percentage: 30,
          ["hide-text"]: true
        }),
        h: common_vendor.o(($event) => goPage("thesaurus")),
        i: common_vendor.p({
          plain: true,
          size: "small"
        }),
        j: common_vendor.p({
          ["custom-class"]: "review",
          size: "large",
          type: "info"
        }),
        k: common_vendor.o(($event) => goPage("learn")),
        l: common_vendor.p({
          size: "large"
        }),
        m: common_vendor.f(toolList.value, (item, index, i0) => {
          return {
            a: item.image,
            b: common_vendor.t(item.name),
            c: index
          };
        }),
        n: common_vendor.f(10, (_, k0, i0) => {
          return {
            a: "53d42ae2-8-" + i0,
            b: "53d42ae2-9-" + i0
          };
        }),
        o: common_vendor.p({
          size: "25",
          text: "李"
        }),
        p: common_vendor.p({
          name: "ellipsis",
          size: "20px"
        }),
        q: common_vendor.sr(setPlanRef, "53d42ae2-10", {
          "k": "setPlanRef"
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-53d42ae2"]]);
wx.createComponent(Component);
