"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const stores_index = require("../../stores/index.js");
if (!Math) {
  (Home + Community + Message + Self + Tabbar)();
}
const Community = () => "./pages/community/index.js";
const Message = () => "./pages/message/index.js";
const Home = () => "./pages/home/index.js";
const Self = () => "./pages/self/index.js";
const Tabbar = () => "./components/tabbar/tabbar.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const tabbar = common_vendor.ref(1);
    const tabbarChange = (e) => {
      tabbar.value = e.value;
    };
    const communityRef = common_vendor.ref(null);
    const msgTotal = common_vendor.ref({
      comment_total: 0,
      like_total: 0
    });
    const getUnread = async () => {
      const res = await api_index.$http.common.getUnread();
      msgTotal.value = res;
    };
    common_vendor.onShow(() => {
      getUnread();
    });
    common_vendor.onMounted(() => {
      stores_index.userStore().setUserInfo();
    });
    return (_ctx, _cache) => {
      return {
        a: tabbar.value === 0,
        b: common_vendor.sr(communityRef, "1cf27b2a-1", {
          "k": "communityRef"
        }),
        c: common_vendor.o(($event) => communityRef.value.loadMore()),
        d: tabbar.value === 1,
        e: common_vendor.p({
          msgTotal: msgTotal.value
        }),
        f: tabbar.value === 2,
        g: tabbar.value === 3,
        h: common_vendor.o(tabbarChange),
        i: common_vendor.p({
          msg: msgTotal.value.comment_total + msgTotal.value.like_total
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
