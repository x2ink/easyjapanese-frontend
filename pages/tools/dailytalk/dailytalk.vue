<template>
	<view class="page-container">

		<view class="fixed-header">
			<view class="head">
				<NavbarDefault border title="日常会话"></NavbarDefault>
			</view>
		</view>

		<scroll-view class="scroll-content" @scrolltolower="reachBottom" scroll-y="true" :scroll-with-animation="true">
			<view class="list">
				<view class="item" :key="item.id" v-for="item in List">
					<view class="jp-row">
						<view class="jp-text-wrapper">
							<view class="jp-ruby" v-for="(rubyItem, index) in item.ruby" :key="index">
								<text class="ruby-text">{{ rubyItem.ruby || '' }}</text>
								<text class="base-text">{{ rubyItem.base }}</text>
							</view>
						</view>

						<view class="sound-btn" @click.stop="playAudio(item)">
							<i class="fas fa-volume-up"></i>
						</view>
					</view>

					<view class="content-row">
						<text class="meaning-text">{{item.zh}}</text>
					</view>

					<view class="divider"></view>

					<view class="action-row">
						<view class="action-item" @click.stop="handleCopy(item)">
							<text>复制</text>
						</view>
						<view class="action-item" @click.stop="handleFavorite(item)">
							<text>笔记</text>
						</view>
						<view class="action-item" @click.stop="handleShare(item)">
							<text>分享</text>
						</view>
					</view>

				</view>
			</view>

			<view class="bottom-spacer"></view>

		</scroll-view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import NavbarDefault from "@/components/navbar/default.vue"
	import $http from "@/api/index.js"
	import {
		goPage
	} from '@/utils/common'
	// 分页和列表数据状态
	const total = ref(0)
	const page = ref(1)
	const size = ref(10)
	const List = ref([])

	/**
	 * 获取每日会话列表数据
	 */
	const getList = async () => {
		if (List.value.length >= total.value && total.value !== 0) {
			return
		}

		try {
			const res = await $http.common.getDailyTalk({
				page: page.value,
				page_size: size.value
			})

			total.value = res.total
			if (total.value === 0) {
				return
			}
			List.value = List.value.concat(res.data)

		} catch (error) {
			console.error("获取每日会话失败:", error)
		}
	}

	/**
	 * 触底加载更多
	 */
	const reachBottom = () => {
		if (total.value > List.value.length) {
			++page.value
			getList()
		}
	}

	/**
	 * 播放音频 (占位)
	 */
	const playAudio = (item) => {
		console.log('播放音频', item)
		// 这里实现你的播放逻辑
	}

	/**
	 * 复制功能：将 Ruby 格式转为纯文本
	 */
	const handleCopy = (item) => {
		if (!item.ruby || !Array.isArray(item.ruby)) {
			uni.showToast({
				title: '暂无内容',
				icon: 'none'
			})
			return
		}

		// 提取 base 字段拼接
		const textToCopy = item.ruby.map(r => r.base).join('')

		uni.setClipboardData({
			data: textToCopy,
			success: () => {
				uni.showToast({
					title: '复制成功',
					icon: 'none'
				})
			}
		})
	}

	/**
	 * 收藏 (占位)
	 */
	const handleFavorite = (item) => {
		console.log(item);
		goPage("/pages/tools/addnote/addnote", {
			id: item.id,
			type: 'talk'
		})
	}

	/**
	 * 分享 (占位)
	 */
	const handleShare = (item) => {
		console.log('点击分享', item)
		uni.showToast({
			title: '分享功能开发中',
			icon: 'none'
		})
	}

	onMounted(() => {
		getList()
	})
</script>

<style>
	page {
		background-color: #f5f7fa;
		/* 稍微深一点的背景色，突出卡片 */
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
		padding: 20rpx 24rpx;
		/* 给列表外围加一点内边距 */
		box-sizing: border-box;
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
		/* 卡片之间的间距 */

		.item {
			background-color: #fff;
			padding: 30rpx 30rpx 20rpx 30rpx;
			border-radius: 16rpx;
			/* 圆角卡片 */
			display: flex;
			flex-direction: column;

			/* 日文行 */
			.jp-row {
				display: flex;
				justify-content: space-between;
				align-items: flex-start;
				margin-bottom: 16rpx;
			}

			.jp-text-wrapper {
				display: flex;
				flex-wrap: wrap;
				align-items: flex-end;
				flex: 1;
				line-height: 1.2;
				padding-right: 20rpx;
				/* 防止文字紧贴图标 */
			}

			.jp-ruby {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-right: 4rpx;
				/* 缩小单词间距，更连贯 */
			}

			.ruby-text {
				font-size: 18rpx;
				/* 字体调小 */
				color: #999;
				margin-bottom: 0rpx;
				min-height: 24rpx;
				/* 占位高度 */
				text-align: center;
			}

			.base-text {
				font-size: 34rpx;
				/* 字体调小 */
				font-weight: 500;
				/* 字重稍微减轻一点点 */
				color: #333;
			}

			/* 播放按钮 */
			.sound-btn {
				padding: 0 0 0 16rpx;
				color: #4CAF50;
				font-size: 32rpx;
				height: 48rpx;
				display: flex;
				align-items: flex-end;
				/* 图标对齐到底部，和文字基线接近 */
			}

			/* 中文行 */
			.content-row {
				margin-bottom: 20rpx;
			}

			.meaning-text {
				font-size: 28rpx;
				color: #666;
				line-height: 1.4;
			}

			/*内部分割线*/
			.divider {
				height: 2rpx;
				background-color: #f0f0f0;
				margin: 10rpx 0 16rpx 0;
				transform: scaleY(0.5);
				/* 细线 */
			}

			/* 底部操作栏 */
			.action-row {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				gap: 40rpx;
				/* 按钮之间的间距 */

				.action-item {
					display: flex;
					align-items: center;
					color: #888;
					font-size: 24rpx;
					padding: 8rpx 0;
					/* 增加点击区域 */

					i {
						font-size: 28rpx;
						margin-right: 8rpx;
					}

					&:active {
						opacity: 0.6;
					}
				}
			}
		}
	}

	.bottom-spacer {
		height: 60rpx;
	}
</style>