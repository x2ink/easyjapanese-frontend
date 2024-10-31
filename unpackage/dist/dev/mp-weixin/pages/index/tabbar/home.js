"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_wd_icon2 = common_vendor.resolveComponent("wd-icon");
  const _easycom_wd_progress2 = common_vendor.resolveComponent("wd-progress");
  const _easycom_wd_button2 = common_vendor.resolveComponent("wd-button");
  const _easycom_uv_scroll_list2 = common_vendor.resolveComponent("uv-scroll-list");
  (_easycom_wd_icon2 + _easycom_wd_progress2 + _easycom_wd_button2 + _easycom_uv_scroll_list2)();
}
const _easycom_wd_icon = () => "../../../uni_modules/wot-design-uni/components/wd-icon/wd-icon.js";
const _easycom_wd_progress = () => "../../../uni_modules/wot-design-uni/components/wd-progress/wd-progress.js";
const _easycom_wd_button = () => "../../../uni_modules/wot-design-uni/components/wd-button/wd-button.js";
const _easycom_uv_scroll_list = () => "../../../uni_modules/uv-scroll-list/components/uv-scroll-list/uv-scroll-list.js";
if (!Math) {
  (_easycom_wd_icon + _easycom_wd_progress + _easycom_wd_button + _easycom_uv_scroll_list)();
}
const _sfc_main = {
  __name: "home",
  setup(__props) {
    common_vendor.ref("");
    const list = common_vendor.ref([{
      price: "230.5",
      image: "https://via.placeholder.com/60x60.png/3c9cff/fff"
    }, {
      price: "74.1",
      image: "https://via.placeholder.com/60x60.png/f9ae3d/fff"
    }, {
      price: "8457",
      image: "https://via.placeholder.com/60x60.png/5ac725/fff"
    }, {
      price: "1442",
      image: "https://via.placeholder.com/60x60.png/f56c6c/fff"
    }, {
      price: "541",
      image: "https://via.placeholder.com/60x60.png/909399/fff"
    }, {
      price: "234",
      image: "https://via.placeholder.com/60x60.png/3c9cff/fff"
    }, {
      price: "562",
      image: "https://via.placeholder.com/60x60.png/f9ae3d/fff"
    }, {
      price: "251.5",
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
        f: common_vendor.f(list.value, (item, index, i0) => {
          return {
            a: item.image,
            b: common_vendor.t(item.price),
            c: index,
            d: common_vendor.n(index === 9 && "scroll-list__goods-item--no-margin-right")
          };
        }),
        g: common_vendor.o(_ctx.right),
        h: common_vendor.o(_ctx.left)
      };
    };
  }
};
wx.createComponent(_sfc_main);
