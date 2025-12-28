<template>
	<view class="page-container">
		<view class="fixed-header">
			<view class="head">
				<NavbarDefault border :title="pageTitle"></NavbarDefault>
			</view>
		</view>

		<scroll-view class="scroll-content" scroll-y="true">
			<view class="category-list">
				<view class="category-item" v-for="item in categoryList" :key="item.id" @click="goList(item)">
					<view class="category-info">
						<view class="category-dot"></view>
						<text class="category-name">{{ item.name }}</text>
					</view>
					<i class="fas fa-chevron-right arrow-icon"></i>
				</view>

				<view v-if="categoryList.length === 0 && !loading" class="empty-tip">
					<text>暂无分类数据</text>
				</view>
			</view>
			<wd-toast />
		</scroll-view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import NavbarDefault from "@/components/navbar/default.vue"
	import $http from "@/api/index.js"
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'

	const toast = useToast()
	const pageTitle = ref('分类')
	const categoryList = ref([])
	const loading = ref(true)

	onLoad((options) => {
		if (options.title) pageTitle.value = options.title
		if (options.sid) getCategories(options.sid)
	})

	const getCategories = async (sid) => {
		loading.value = true
		try {
			const res = await $http.word.getSpokenCategory({
				sid: sid
			})
			if (res.data) {
				categoryList.value = res.data
			}
		} catch (error) {
			console.error("获取分类失败:", error)
		} finally {
			loading.value = false
		}
	}

	const goList = (item) => {
		uni.navigateTo({
			url: `/pages/tools/dailytalk/dailytalk?cid=${item.id}&title=${item.name}`
		})
	}
</script>

<style>
	page {
		background-color: #f5f7fa;
		height: 100vh;
		overflow: hidden;
	}
</style>

<style lang="scss" scoped>
	.page-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #f5f7fa;
	}

	.fixed-header {
		background-color: #ffffff;
		z-index: 10;
		flex-shrink: 0;
	}

	.scroll-content {
		flex: 1;
		height: 0;
		overflow: hidden;
		padding: 24rpx;
		box-sizing: border-box;
	}

	.category-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;

		.category-item {
			background: #fff;
			padding: 32rpx;
			border-radius: 16rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			/* 去除阴影 */

			&:active {
				background-color: #fafafa;
			}

			.category-info {
				display: flex;
				align-items: center;

				.category-dot {
					width: 10rpx;
					height: 10rpx;
					border-radius: 50%;
					background-color: #10B981;
					margin-right: 24rpx;
				}

				.category-name {
					font-size: 30rpx;
					color: #333;
					font-weight: 500;
				}
			}

			.arrow-icon {
				color: #ccc;
				font-size: 24rpx;
			}
		}
	}

	.empty-tip {
		padding: 100rpx 0;
		text-align: center;
		color: #999;
		font-size: 28rpx;
	}
</style>