<template>
	<view class="page-container">

		<view class="fixed-header">
			<view class="head">
				<NavbarDefault border :title="pageTitle"></NavbarDefault>
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

				<view v-if="List.length === 0 && !loading"
					style="text-align: center; padding: 40rpx; color: #999; font-size: 24rpx;">
					暂无内容
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
		onUnload,
		onLoad
	} from "@dcloudio/uni-app"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'

	const toast = useToast()

	// 页面参数
	const pageTitle = ref('日常会话')
	const currentCid = ref(null)
	const loading = ref(false)

	onUnload(() => {
		if (innerAudioContext) {
			innerAudioContext.stop()
			innerAudioContext.destroy()
		}
	})

	// 接收上个页面传来的 cid 和 title
	onLoad((options) => {
		if (options.cid) {
			currentCid.value = options.cid
		}
		if (options.title) {
			pageTitle.value = options.title
		}
		getList()
	})

	const innerAudioContext = uni.createInnerAudioContext();
	const List = ref([])

	// 获取列表逻辑更新为使用 getSpokenList
	const getList = async () => {
		if (!currentCid.value) return

		loading.value = true
		try {
			// 使用新的 API 接口
			const res = await $http.word.getSpokenList({
				cid: currentCid.value
			})

			if (res.data && Array.isArray(res.data)) {
				// 数据处理：将 ruby JSON字符串转为对象数组，适配原有模板
				List.value = res.data.map(item => {
					let parsedRuby = []
					if (typeof item.ruby === 'string') {
						try {
							parsedRuby = JSON.parse(item.ruby)
						} catch (e) {
							console.error('Ruby parse error', e)
							// 容错：如果解析失败，构建一个默认结构
							parsedRuby = [{
								base: item.jp,
								ruby: ''
							}]
						}
					} else if (Array.isArray(item.ruby)) {
						parsedRuby = item.ruby
					}

					return {
						...item,
						ruby: parsedRuby
					}
				})
			}
		} catch (error) {
			console.error("获取每日会话失败:", error)
			toast.error('加载失败')
		} finally {
			loading.value = false
		}
	}

	// 新接口通常是一次性返回，此方法保留以兼容模板事件，但暂不执行分页逻辑
	const reachBottom = () => {
		// 如果后续接口支持分页，可在此处恢复逻辑
	}

	const playAudio = (item) => {
		if (!item.voice) return
		innerAudioContext.src = item.voice;
		innerAudioContext.play()
	}

	const handleCopy = (item) => {
		if (!item.ruby || !Array.isArray(item.ruby)) {
			// 尝试直接复制 jp 字段作为兜底
			if (item.jp) {
				uni.setClipboardData({
					data: item.jp
				})
			} else {
				toast.warning('暂无内容')
			}
			return
		}

		const textToCopy = item.ruby.map(r => r.base).join('')
		uni.setClipboardData({
			data: textToCopy,
			success: () => {
				// uniapp 默认提示
			}
		})
	}

	const handleFavorite = (item) => {
		goPage("/pages/tools/addnote/addnote", {
			id: item.id,
			type: 'talk',
			content: item.zh // 顺便把中文传过去方便回显
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