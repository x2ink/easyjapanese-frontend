<template>
  <view class="md-container">
    <mp-html 
      :content="htmlContent" 
      :selectable="true" 
      :scroll-table="true"
      :copy-link="true"
      :tag-style="tagStyle"
    />
  </view>
</template>

<script setup>
import { computed } from 'vue';
import { marked } from 'marked';
// 请确保已 npm install mp-html 并正确引入
import mpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html';

const props = defineProps({
  markdown: {
    type: String,
    default: ''
  }
});

/**
 * 标签样式配置 (CSS In JS)
 * 针对微信小程序渲染特性进行优化
 */
const tagStyle = {
  // --- Ruby (注音) 核心修复样式 ---
  
  // 1. ruby 容器：设为行内弹性盒，允许我们在内部控制布局
  // flex-direction: column-reverse -> 关键！因为 HTML 里文字在前注音在后，
  // 我们反转列方向，让后面的注音(rt)跑上面，前面的文字(rb)跑下面。
  ruby: 'display: inline-flex; flex-direction: column-reverse; align-items: center; vertical-align: -0.2em; margin: 0 4px; line-height: 1;',
  
  // 2. rt (拼音/假名)：字体调小，紧贴文字
  rt: 'font-size: 0.6em; line-height: 1; color: #888; margin-bottom: 2px;',
  
  // 3. rb (基础文字)：正常显示
  rb: 'display: block; line-height: 1.2;',
  
  // --- 其他通用 Markdown 样式 ---
  h1: 'font-size: 32rpx; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 10rpx; margin: 30rpx 0 20rpx;',
  h2: 'font-size: 30rpx; font-weight: bold; margin: 28rpx 0 18rpx;',
  h3: 'font-size: 28rpx; font-weight: bold; margin: 26rpx 0 16rpx;',
  p: 'font-size: 28rpx; color: #333; line-height: 1.8; margin-bottom: 20rpx; text-align: justify;',
  ul: 'margin-bottom: 20rpx; padding-left: 30rpx;',
  ol: 'margin-bottom: 20rpx; padding-left: 30rpx;',
  li: 'font-size: 28rpx; color: #333; margin-bottom: 10rpx;',
  blockquote: 'background-color: #f6f6f6; border-left: 8rpx solid #ddd; padding: 20rpx; color: #666; margin: 20rpx 0;',
  code: 'font-family: monospace; background-color: #fff5f5; color: #ff502c; padding: 4rpx 10rpx; border-radius: 8rpx; font-size: 0.9em;',
  pre: 'background-color: #f6f8fa; padding: 20rpx; border-radius: 10rpx; overflow-x: auto; margin: 20rpx 0;',
  img: 'max-width: 100% !important; border-radius: 8rpx; display: block; margin: 20rpx auto;',
  table: 'border-collapse: collapse; width: 100%; margin: 20rpx 0;',
  th: 'background-color: #f6f8fa; padding: 16rpx; border: 1px solid #dfe2e5; font-weight: bold; font-size: 26rpx;',
  td: 'padding: 16rpx; border: 1px solid #dfe2e5; font-size: 26rpx;'
};

// Markdown 转 HTML
const htmlContent = computed(() => {
  if (!props.markdown) return '';
  try {
    // marked 解析器，它会保留 markdown 中的 html 标签（如 <ruby>）
    return marked.parse(props.markdown);
  } catch (e) {
    console.error('Markdown parse error:', e);
    return '';
  }
});
</script>

<style scoped>
.md-container {
  width: 100%;
  box-sizing: border-box;
  padding: 0 10rpx; /* 给整个内容留一点边距 */
}
</style>