"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_wd_icon2 = common_vendor.resolveComponent("wd-icon");
  const _easycom_wd_progress2 = common_vendor.resolveComponent("wd-progress");
  const _easycom_wd_button2 = common_vendor.resolveComponent("wd-button");
  const _easycom_uv_scroll_list2 = common_vendor.resolveComponent("uv-scroll-list");
  const _easycom_uv_avatar2 = common_vendor.resolveComponent("uv-avatar");
  const _easycom_wd_tab2 = common_vendor.resolveComponent("wd-tab");
  const _easycom_wd_tabs2 = common_vendor.resolveComponent("wd-tabs");
  (_easycom_wd_icon2 + _easycom_wd_progress2 + _easycom_wd_button2 + _easycom_uv_scroll_list2 + _easycom_uv_avatar2 + _easycom_wd_tab2 + _easycom_wd_tabs2)();
}
const _easycom_wd_icon = () => "../../../uni_modules/wot-design-uni/components/wd-icon/wd-icon.js";
const _easycom_wd_progress = () => "../../../uni_modules/wot-design-uni/components/wd-progress/wd-progress.js";
const _easycom_wd_button = () => "../../../uni_modules/wot-design-uni/components/wd-button/wd-button.js";
const _easycom_uv_scroll_list = () => "../../../uni_modules/uv-scroll-list/components/uv-scroll-list/uv-scroll-list.js";
const _easycom_uv_avatar = () => "../../../uni_modules/uv-avatar/components/uv-avatar/uv-avatar.js";
const _easycom_wd_tab = () => "../../../uni_modules/wot-design-uni/components/wd-tab/wd-tab.js";
const _easycom_wd_tabs = () => "../../../uni_modules/wot-design-uni/components/wd-tabs/wd-tabs.js";
if (!Math) {
  (_easycom_wd_icon + _easycom_wd_progress + _easycom_wd_button + _easycom_uv_scroll_list + _easycom_uv_avatar + _easycom_wd_tab + _easycom_wd_tabs)();
}
const _sfc_main = {
  __name: "home",
  setup(__props) {
    common_vendor.ref("");
    const currentTab = common_vendor.ref(0);
    const tabList = common_vendor.ref([
      {
        name: "推荐文章"
      },
      {
        name: "每日必读"
      },
      {
        name: "推荐文章"
      },
      {
        name: "推荐文章"
      },
      {
        name: "推荐文章"
      },
      {
        name: "推荐文章"
      },
      {
        name: "推荐文章"
      }
    ]);
    const toolList = common_vendor.ref([{
      name: "五十音图",
      image: "https://via.placeholder.com/60x60.png/f56c6c/fff"
    }, {
      name: "文本翻译",
      image: "https://via.placeholder.com/60x60.png/3c9cff/fff"
    }, {
      name: "语音朗读",
      image: "https://via.placeholder.com/60x60.png/f9ae3d/fff"
    }, {
      name: "动词变形",
      image: "https://via.placeholder.com/60x60.png/5ac725/fff"
    }, {
      name: "课文学习",
      image: "https://via.placeholder.com/60x60.png/909399/fff"
    }, {
      name: "动词变形",
      image: "https://via.placeholder.com/60x60.png/3c9cff/fff"
    }, {
      name: "课文学习",
      image: "https://via.placeholder.com/60x60.png/f9ae3d/fff"
    }, {
      name: "尽情期待",
      image: "https://via.placeholder.com/60x60.png/5ac725/fff"
    }]);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          name: "search",
          size: "22px",
          color: "#979797"
        }),
        b: common_vendor.p({
          name: "arrow-right",
          size: "19px"
        }),
        c: common_vendor.p({
          percentage: 30,
          ["hide-text"]: true
        }),
        d: common_vendor.p({
          plain: true,
          size: "small"
        }),
        e: common_vendor.p({
          type: "info"
        }),
        f: common_vendor.f(toolList.value, (item, index, i0) => {
          return {
            a: item.image,
            b: common_vendor.t(item.name),
            c: index
          };
        }),
        g: common_vendor.f(tabList.value, (item, index, i0) => {
          return {
            a: common_vendor.f(10, (_, k1, i1) => {
              return {
                a: "53d42ae2-9-" + i0 + "-" + i1 + "," + ("53d42ae2-8-" + i0),
                b: "53d42ae2-10-" + i0 + "-" + i1 + "," + ("53d42ae2-8-" + i0)
              };
            }),
            b: "53d42ae2-8-" + i0 + ",53d42ae2-7",
            c: common_vendor.p({
              title: item.name
            }),
            d: index
          };
        }),
        h: common_vendor.p({
          size: "25",
          text: "李"
        }),
        i: common_vendor.p({
          name: "ellipsis",
          size: "20px"
        }),
        j: common_vendor.o(($event) => currentTab.value = $event),
        k: common_vendor.p({
          lineWidth: 40,
          swipeable: true,
          animated: true,
          modelValue: currentTab.value
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-53d42ae2"]]);
wx.createComponent(Component);
