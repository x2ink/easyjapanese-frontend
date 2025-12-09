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
					</view>

				</view>
			</view>

			<view class="bottom-spacer"></view>
			<wd-toast />
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
	import {
		onUnload
	} from "@dcloudio/uni-app"
	import {
		useToast,
		useMessage
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	onUnload(() => {
		if (innerAudioContext) {
			innerAudioContext.stop()
			innerAudioContext.destroy()
		}
	})
	const innerAudioContext = uni.createInnerAudioContext();
	const total = ref(0)
	const page = ref(1)
	const size = ref(10)
	const List = ref([])


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


	const reachBottom = () => {
		if (total.value > List.value.length) {
			++page.value
			getList()
		}
	}


	const playAudio = (item) => {
		innerAudioContext.src = item.voice;
		innerAudioContext.play()
	}


	const handleCopy = (item) => {
		if (!item.ruby || !Array.isArray(item.ruby)) {
			toast.warning('暂无内容')
			return
		}


		const textToCopy = item.ruby.map(r => r.base).join('')
		uni.setClipboardData({
			data: textToCopy,
			success: () => {

			}
		})
	}
	const handleFavorite = (item) => {
		goPage("/pages/tools/addnote/addnote", {
			id: item.id,
			type: 'talk'
		})
	}
	onMounted(() => {
		getList()
	})
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
		padding: 20rpx 24rpx;

		box-sizing: border-box;
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 24rpx;


		.item {
			background-color: #fff;
			padding: 30rpx 30rpx 20rpx 30rpx;
			border-radius: 16rpx;

			display: flex;
			flex-direction: column;


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

			}

			.jp-ruby {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-right: 4rpx;

			}

			.ruby-text {
				font-size: 18rpx;

				color: #999;
				margin-bottom: 0rpx;
				min-height: 24rpx;

				text-align: center;
			}

			.base-text {
				font-size: 34rpx;

				font-weight: 500;

				color: #333;
			}


			.sound-btn {
				padding: 0 0 0 16rpx;
				color: #4CAF50;
				font-size: 32rpx;
				height: 48rpx;
				display: flex;
				align-items: flex-end;

			}


			.content-row {
				margin-bottom: 20rpx;
			}

			.meaning-text {
				font-size: 28rpx;
				color: #666;
				line-height: 1.4;
			}


			.divider {
				height: 2rpx;
				background-color: #f0f0f0;
				margin: 10rpx 0 16rpx 0;
				transform: scaleY(0.5);

			}


			.action-row {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				gap: 40rpx;


				.action-item {
					display: flex;
					align-items: center;
					color: #888;
					font-size: 24rpx;
					padding: 8rpx 0;


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