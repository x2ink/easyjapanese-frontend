# 轻松日语

![UniApp](https://img.shields.io/badge/uni--app-Vue3-green) ![Platform](https://img.shields.io/badge/Platform-WeChat%20Mini%20Program-blue) ![License](https://img.shields.io/badge/License-MIT-orange)

## 📖 项目简介

**轻松日语** 是一款基于 **UniApp + Vue 3** 开发的日语学习辅助应用。项目旨在为日语学习者提供从五十音图基础到单词记忆、语法查询以及实用工具（如动词变形、长难句拆分）的一站式学习体验。

本项目UI风格参考了简约大气的现代设计，主要适配 **微信小程序** 端。

## ✨ 核心功能

根据现有页面结构，项目包含以下主要模块：

* **单词学习**：
    * 词库浏览与搜索 (`pages/word/thesaurus`, `search`)
    * 单词详情与背诵 (`pages/word/worddetail`, `writefrommemory`)
    * 听写练习 (`pages/word/dictation`)
    * 复习模式 (`pages/word/review`)
    * 单词编辑与修订历史 (`pages/word/editword`, `edithistory`)
* **实用工具**：
    * 动词变形查询 (`pages/tools/verbtransfiguration`)
    * 五十音图 (`pages/tools/fiftysounds`)
    * 语法库 (`pages/tools/grammar`)
    * 每日一句 (`pages/tools/dailytalk`)
    * AI 句子拆分 (`pages/tools/breaksentence`)
    * 翻译助手 (`pages/tools/translate`)
* **其他功能**：
    * Markdown 文章阅读 (`pages/other/markdown`)
    * 日本文化介绍 (`pages/other/culture`)
    * 学习计划制定 (`pages/other/setplan`)

## 🛠️ 技术栈

* **核心框架**: [UniApp](https://uniapp.dcloud.net.cn/) (Vue 3)
* **UI 组件库**: [Wot Design Uni](https://wot-design-uni.pages.dev/)
* **状态管理**: [Pinia](https://pinia.vuejs.org/)
* **Markdown 渲染**: `mp-html` / `marked`
* **工具库**: 
    * `dayjs` (时间处理)
    * `crypto-js` (加密解密)
    * `@microsoft/fetch-event-source` (SSE流式请求，用于AI对话功能)

## ⚙️ 环境要求

在开始之前，请确保您的开发环境满足以下条件：

1.  **Node.js**: 建议版本 >= 16.0.0
2.  **IDE**: 推荐使用 [HBuilderX](https://www.dcloud.io/hbuilderx.html) (App开发版) 或 VS Code。
3.  **微信开发者工具**: 用于预览和调试微信小程序。

## 🚀 安装与运行

### 1. 克隆项目

```bash
git clone https://github.com/x2ink/easyjapanese-frontend.git
cd easyjapanese-frontend

### 2\. 安装依赖

本项目使用 npm 管理依赖，请在项目根目录下运行：

```bash
npm install
# 或者
yarn install
# 或者
pnpm install
```

### 3\. 运行项目

#### 使用 HBuilderX (推荐)

1.  打开 HBuilderX，选择“文件” -\> “导入” -\> “从本地目录导入”，选择项目文件夹。
2.  在左侧项目管理器中选中项目。
3.  点击顶部菜单栏的 **“运行”** -\> **“运行到小程序模拟器”** -\> **“微信开发者工具”**。
4.  确保已配置微信开发者工具的路径，并且在微信开发者工具中开启了“服务端口”。

#### 使用 命令行 (CLI)

如果你是使用 Vue CLI 创建的 UniApp 项目结构：

```bash
npm run dev:mp-weixin
```

运行成功后，打开微信开发者工具，导入 `dist/dev/mp-weixin` 目录即可预览。

## 📂 目录结构

```text
├── api/                # 接口请求封装
├── components/         # 全局公用组件
├── pages/              # 页面文件
│   ├── index/          # 首页相关
│   ├── learn/          # 学习页
│   ├── login/          # 登录页
│   ├── word/           # 单词模块
│   ├── tools/          # 工具模块
│   └── other/          # 其他页面
├── static/             # 静态资源 (图片、字体)
├── stores/             # Pinia 状态管理
├── uni_modules/        # UniApp 插件模块 (Wot Design Uni 等)
├── utils/              # 工具函数
├── App.vue             # 应用入口组件
├── main.js             # Vue初始化入口
├── manifest.json       # 应用配置文件 (AppID: __UNI__682A809)
├── pages.json          # 页面路由配置
└── package.json        # 项目依赖配置
```

## ⚠️ 注意事项

1.  **小程序 AppID**:
      * 当前配置的 AppID 为 `wx4979399128b06403`。
      * 如果您是二次开发，请在 `manifest.json` 中修改为您的微信小程序 AppID。
2.  **API 接口**:
      * 请检查 `utils/request.js` 或 `api/` 目录下的 Base URL 配置，确保连接到正确的后端服务。
3.  **样式**:
      * 项目使用了 `scss` 预处理。
      * 全局样式禁止了部分页面的滚动 (`disableScroll: true`)，内容滚动多通过 `<scroll-view>` 实现。


## ⚠️ 提交规范
```
[
  "build",
  "chore",
  "ci",
  "docs",
  "feat",
  "fix",
  "perf",
  "refactor",
  "revert",
  "style",
  "test",
];
```

## 📚 文档参考

  * [UniApp 官方文档](https://uniapp.dcloud.net.cn/)
  * [Wot Design Uni 组件文档](https://wot-design-uni.pages.dev/)

## 🤝 贡献

欢迎提交 Issue 或 Pull Request 来改进本项目！

1.  Fork 本仓库
2.  新建 Feat\_xxx 分支
3.  提交代码
4.  新建 Pull Request

