"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const uni_modules_wotDesignUni_components_wdToast_index = require("../../../uni_modules/wot-design-uni/components/wd-toast/index.js");
require("../../../uni_modules/wot-design-uni/locale/index.js");
if (!Array) {
  const _easycom_wd_icon2 = common_vendor.resolveComponent("wd-icon");
  const _easycom_wd_progress2 = common_vendor.resolveComponent("wd-progress");
  const _easycom_wd_button2 = common_vendor.resolveComponent("wd-button");
  const _easycom_uv_scroll_list2 = common_vendor.resolveComponent("uv-scroll-list");
  const _easycom_wd_tag2 = common_vendor.resolveComponent("wd-tag");
  const _easycom_wd_text2 = common_vendor.resolveComponent("wd-text");
  const _easycom_wd_toast2 = common_vendor.resolveComponent("wd-toast");
  (_easycom_wd_icon2 + _easycom_wd_progress2 + _easycom_wd_button2 + _easycom_uv_scroll_list2 + _easycom_wd_tag2 + _easycom_wd_text2 + _easycom_wd_toast2)();
}
const _easycom_wd_icon = () => "../../../uni_modules/wot-design-uni/components/wd-icon/wd-icon.js";
const _easycom_wd_progress = () => "../../../uni_modules/wot-design-uni/components/wd-progress/wd-progress.js";
const _easycom_wd_button = () => "../../../uni_modules/wot-design-uni/components/wd-button/wd-button.js";
const _easycom_uv_scroll_list = () => "../../../uni_modules/uv-scroll-list/components/uv-scroll-list/uv-scroll-list.js";
const _easycom_wd_tag = () => "../../../uni_modules/wot-design-uni/components/wd-tag/wd-tag.js";
const _easycom_wd_text = () => "../../../uni_modules/wot-design-uni/components/wd-text/wd-text.js";
const _easycom_wd_toast = () => "../../../uni_modules/wot-design-uni/components/wd-toast/wd-toast.js";
if (!Math) {
  (_easycom_wd_icon + _easycom_wd_progress + _easycom_wd_button + _easycom_uv_scroll_list + _easycom_wd_tag + _easycom_wd_text + Setplan + _easycom_wd_toast)();
}
const Setplan = () => "../../../components/setplan.js";
const _sfc_main = {
  __name: "home",
  setup(__props) {
    common_vendor.dayjs.locale("zh");
    common_vendor.dayjs.extend(common_vendor.relativeTime);
    const review = () => {
      if (info.value.review == 0) {
        toast.warning(`今日没有需要复习的单词`);
      } else {
        goPage("review");
      }
    };
    const articleList = common_vendor.ref([]);
    const articleTotal = common_vendor.ref(0);
    const articleParams = common_vendor.ref({
      page: 1,
      size: 10
    });
    common_vendor.onReachBottom(() => {
      if (articleTotal.value > articleList.value.length) {
        ++articleParams.value.page;
        getArticleLis();
      }
    });
    const getArticleList = async () => {
      const res = await api_index.$http.article.getList(articleParams.value.page, articleParams.value.size);
      articleList.value = articleList.value.concat(res.data);
      articleTotal.value = res.total;
    };
    const toast = uni_modules_wotDesignUni_components_wdToast_index.useToast();
    const progress = common_vendor.computed(() => {
      if (info.value.learnnum) {
        return info.value.learnnum / info.value.wordnum * 100;
      } else {
        return 0;
      }
    });
    const info = common_vendor.ref({
      bookname: "",
      day: 0,
      learn: 0,
      learnnum: 0,
      review: 0,
      wordnum: 0
    });
    const navBarHeight = common_vendor.ref(0);
    common_vendor.onMounted(() => {
      const systemInfo = common_vendor.wx$1.getSystemInfoSync();
      const statusBarHeight = systemInfo.statusBarHeight;
      navBarHeight.value = statusBarHeight + "px";
      getArticleList();
      getRecommend();
    });
    const getHomeInfo = async () => {
      const res = await api_index.$http.word.getHomeInfo();
      info.value = res.data;
    };
    common_vendor.onShow(() => {
      getHomeInfo();
    });
    const startLearn = () => {
      if (setPlanRef.value.config.mode == "学习模式") {
        goPage("learn");
      } else {
        goPage("fastmode");
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
    const setPlanRef = common_vendor.ref(null);
    const openPlan = () => {
      setPlanRef.value.show = true;
    };
    const recommendWord = common_vendor.ref([]);
    const getRecommend = async () => {
      const res = await api_index.$http.word.getRecommend();
      recommendWord.value = res.data;
    };
    const toolList = common_vendor.ref([{
      name: "文本翻译",
      image: "http://jp.x2.ink/images/duo-icons--g-translate.png",
      path: "translate"
    }, {
      name: "语法学习",
      image: "http://jp.x2.ink/images/duo-icons--book.png",
      path: "grammar"
    }, {
      name: "五十音图",
      image: "http://jp.x2.ink/images/duo-icons--dashboard.png",
      path: "fiftysounds"
    }, {
      name: "动词变形",
      image: "http://jp.x2.ink/images/duo-icons--palette.png",
      path: "verbtransfiguration"
    }, {
      name: "动词变形",
      image: "http://jp.x2.ink/images/duo-icons--palette.png",
      path: "verbtransfiguration"
    }, {
      name: "动词变形",
      image: "http://jp.x2.ink/images/duo-icons--palette.png",
      path: "verbtransfiguration"
    }]);
    return (_ctx, _cache) => {
      return {
        a: navBarHeight.value,
        b: common_vendor.t(info.value.day),
        c: common_vendor.p({
          name: "search",
          size: "18px",
          color: "#979797"
        }),
        d: common_vendor.o(($event) => goPage("search")),
        e: common_vendor.t(info.value.bookname),
        f: common_vendor.o(openPlan),
        g: common_vendor.p({
          name: "arrow-right",
          size: "19px"
        }),
        h: common_vendor.t(info.value.review),
        i: common_vendor.o(($event) => goPage("todayreview")),
        j: common_vendor.t(info.value.learn),
        k: common_vendor.o(($event) => goPage("todaylearn")),
        l: common_vendor.p({
          ["custom-class"]: "customprogress",
          percentage: progress.value,
          ["hide-text"]: true
        }),
        m: common_vendor.t(info.value.learnnum),
        n: common_vendor.t(info.value.wordnum),
        o: common_vendor.o(($event) => goPage("thesaurus")),
        p: common_vendor.p({
          plain: true,
          size: "small"
        }),
        q: common_vendor.o(($event) => review()),
        r: common_vendor.p({
          size: "large",
          ["custom-class"]: "reviewbtn recitebtn",
          type: "info"
        }),
        s: common_vendor.o(($event) => startLearn()),
        t: common_vendor.p({
          ["custom-class"]: "recitebtn",
          size: "large"
        }),
        v: common_vendor.f(toolList.value, (item, index, i0) => {
          return {
            a: item.image,
            b: common_vendor.t(item.name),
            c: common_vendor.o(($event) => goPage(item.path), index),
            d: index
          };
        }),
        w: common_vendor.p({
          name: "refresh1",
          color: "#999",
          size: "16px"
        }),
        x: common_vendor.o(($event) => getRecommend()),
        y: common_vendor.f(recommendWord.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.word),
            b: common_vendor.f(item.level, (tag, k1, i1) => {
              return {
                a: common_vendor.t(tag),
                b: "53d42ae2-8-" + i0 + "-" + i1
              };
            }),
            c: "53d42ae2-9-" + i0,
            d: common_vendor.p({
              size: "14px",
              lines: 2,
              color: "#999",
              text: item.meaning.join(";")
            }),
            e: "53d42ae2-10-" + i0,
            f: common_vendor.t(item.browse),
            g: "53d42ae2-11-" + i0,
            h: common_vendor.o(($event) => goPage("worddetail", "?id=" + item.id + "&type=jc"), item.id),
            i: item.id
          };
        }),
        z: common_vendor.p({
          ["custom-class"]: "tag",
          color: "#0083ff",
          ["bg-color"]: "#d0e8ff"
        }),
        A: common_vendor.p({
          name: "browse",
          color: "#999",
          size: "18px"
        }),
        B: common_vendor.p({
          name: "arrow-right",
          color: "#999",
          size: "16px"
        }),
        C: common_vendor.sr(setPlanRef, "53d42ae2-12", {
          "k": "setPlanRef"
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-53d42ae2"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/index/tabbar/home.js.map
