<template>
	<page-meta page-style="background-color:#ffffff;">
		<view class="page-container">
			<view class="header-section">
				<NavbarDefault border :title="title"></NavbarDefault>
			</view>

			<scroll-view scroll-y="true" class="scroll-box">
				<view class="markdown-wrapper">
					<MdParser :markdown="content" />
				</view>
				<view style="height: calc(env(safe-area-inset-bottom) + 40rpx);"></view>
			</scroll-view>
			<view v-if="id" @click="openSheet()" class="sheet-btn _GCENTER">
				<text class="fas fa-pen-to-square"></text>
				<view>操作</view>
			</view>
		</view>
	</page-meta>
</template>

<script setup>
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
	const openSheet = () => {
		wx.showActionSheet({
			itemList: ["复制全文", "记笔记", "问题反馈"],
			success(e) {
				if (e.tapIndex == 0) {
					uni.setClipboardData({
						data: content.value,
						success: () => {
							uni.showToast({
								title: '复制成功',
								icon: 'none'
							})
						}
					})
				} else if (e.tapIndex == 1) {
					goPage("/pages/tools/addnote/addnote", {
						id: id.value,
						type: type.value
					})
				} else if (e.tapIndex == 2) {
					goPage("/pages/other/feedback/feedback", {
						type: "问题反馈",
						data: `${type.value}-${id.value}`
					})
				}
			}
		})
	}
	const content = ref('')
	const title = ref('')
	const id = ref(null)
	const type = ref(null)
	onLoad((e) => {
		title.value = e.title
		if (e.id && e.type) {
			id.value = e.id
			type.value = e.type
		}
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

		height: 100vh;
		overflow: hidden;
	}
</style>

<style lang="scss" scoped>
	.sheet-btn {
		flex-direction: column;
		font-size: 24rpx;
		position: fixed;
		bottom: 80rpx;
		right: 40rpx;
		background-color: #07C160;
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		box-shadow: rgba(100, 100, 111, 0.2) 0rpx 14rpx 58rpx 0rpx;
		color: #ffffff;

		text {
			font-size: 36rpx;
			color: #ffffff;
			margin-bottom: 8rpx;
		}
	}

	.page-container {
		display: flex;
		flex-direction: column;
		height: 100vh;

		background-color: #ffffff;
	}

	.header-section {
		flex-shrink: 0;

		z-index: 10;
		background-color: #ffffff;
	}

	.scroll-box {
		flex: 1;

		height: 0;

		width: 100%;
	}

	.markdown-wrapper {
		padding: 0 32rpx;
		box-sizing: border-box;
	}
</style>