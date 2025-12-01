<template>
	<page-meta page-style="background-color:#ffffff;">
		<view class="page-container">
			<view class="header-section">
				<NavbarDefault border :title="title"></NavbarDefault>
			</view>

			<scroll-view scroll-y="true" class="scroll-box">
				<view class="markdown-wrapper">
					<zero-markdown-view themeColor="#000000" :markdown="content"></zero-markdown-view>
				</view>
				<view style="height: calc(env(safe-area-inset-bottom) + 20px);"></view>
			</scroll-view>
		</view>
	</page-meta>
</template>

<script setup>
	// 逻辑完全保持不变
	import {
		ref,
	} from 'vue'
	import {
		onLoad,
	} from "@dcloudio/uni-app"
	import {
		goPage,
	} from "@/utils/common.js"
	import NavbarDefault from "@/components/navbar/default"
	import http from '@/utils/request.js'

	const content = ref('')
	const title = ref('')

	onLoad((e) => {
		title.value = e.title
		uni.request({
			url: e.url,
			method: "GET",
			success(res) {
				content.value = res.data
			}
		})
	})
</script>

<style>
	page {
		background-color: #ffffff;
		/* 确保 page 本身没有滚动条，这与你在 pages.json 的设置一致 */
		height: 100vh;
		overflow: hidden;
	}
</style>

<style lang="scss" scoped>
	.page-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		/* 关键：占满屏幕高度 */
		background-color: #ffffff;
	}

	.header-section {
		flex-shrink: 0;
		/* 防止头部被压缩 */
		z-index: 10;
		background-color: #ffffff;
	}

	.scroll-box {
		flex: 1;
		/* 占据剩余所有空间 */
		height: 0;
		/* 关键：必须设置高度（或height:0）配合 flex:1 才能触发内部滚动 */
		width: 100%;
	}

	.markdown-wrapper {
		padding:0 16px;
		box-sizing: border-box;
	}
</style>