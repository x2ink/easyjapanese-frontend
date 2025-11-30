<template>
	<view class="page-container">

		<view class="fixed-header">
			<view class="head">
				<NavbarDefault border title="每日会话"></NavbarDefault>
			</view>
		</view>

		<scroll-view class="scroll-content" @scrolltolower="reachBottom" scroll-y="true" :scroll-with-animation="true">
			<view class="list">
				<view class="item" :key="item.id" v-for="item in List">

					<view class="jp-row">
						<view class="jp-text-wrapper">
							<view class="jp-ruby" v-for="(rubyItem, index) in item.ruby" :key="index">
								<text v-if="rubyItem.ruby" class="ruby-text">{{ rubyItem.ruby }}</text>
								<text class="base-text">{{ rubyItem.base }}</text>
							</view>
						</view>

						<view class="sound-icon-wrapper">
							<i class="fas fa-volume-up sound-icon"></i>
						</view>
					</view>

					<view class="content-row">
						<text class="meaning-text">{{item.zh}}</text>
					</view>

				</view>
			</view>


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

	// 分页和列表数据状态
	const total = ref(0)
	const page = ref(1)
	const size = ref(10) // 每页10条，与您提供的API示例一致
	const List = ref([])

	/**
	 * 获取每日会话列表数据
	 */
	const getList = async () => {
		// 如果已加载全部数据，则不再请求
		if (List.value.length >= total.value && total.value !== 0) {
			return
		}

		try {
			// 调用 api/common.js 中封装的 getDailyTalk 接口
			const res = await $http.common.getDailyTalk({
				page: page.value,
				page_size: size.value
			})

			total.value = res.total
			if (total.value === 0) {
				return
			}
			// 拼接新数据到列表
			List.value = List.value.concat(res.data)

		} catch (error) {
			console.error("获取每日会话失败:", error)
		}
	}

	/**
	 * 触底加载更多（无限滚动）
	 */
	const reachBottom = () => {
		// 只有在还有更多数据时才加载下一页
		if (total.value > List.value.length) {
			++page.value
			getList()
		}
	}

	// 组件挂载时加载数据
	onMounted(() => {
		getList()
	})
</script>

<style>
	/* 确保页面占满整个视口且背景为白色，并禁止原生滚动 */
	page {
		background-color: #ffffff;
		height: 100vh;
		overflow: hidden;
	}
</style>

<style lang="scss" scoped>
	/* 页面布局：固定头部 + 撑满剩余空间的滚动内容 */
	.page-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #ffffff;
	}

	.fixed-header {
		background-color: #ffffff;
		z-index: 10;
		flex-shrink: 0;
	}

	.scroll-content {
		flex: 1;
		height: 0;
		/* 必须设置高度为 0，才能让 flex: 1 生效 */
		overflow: hidden;
		padding-top: 4px;
	}

	.head {
		background-color: white;
	}

	/* 列表样式 */
	.list {
		.item {
			padding: 18px 20px;
			/* 增加上下边距 */
			border-bottom: 1px solid #f7f8fa;
			/* 极淡的分割线 */
			display: flex;
			flex-direction: column;
			gap: 10px;
			transition: background-color 0.2s;

			&:active {
				background-color: #fafafa;
			}

			.jp-row {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.jp-text-wrapper {
				display: flex;
				flex-wrap: wrap;
				align-items: flex-end;
				flex: 1;
				line-height: 1.2;
			}

			.jp-ruby {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-right: 6px;
				/* 单词之间的间距 */
			}

			.ruby-text {
				font-size: 10px;
				color: #aeb4c0;
				margin-bottom: 1px;
				min-height: 10px;
				/* 保持没有假名时的排版稳定 */
			}

			.base-text {
				font-size: 20px;
				/* 突出日文会话 */
				font-weight: 600;
				color: #333;
			}

			/* 发音按钮样式 */
			.sound-icon-wrapper {
				margin-left: 15px;
				padding: 5px;
				color: #4CAF50;
				/* 绿色图标 */
				flex-shrink: 0;

				.sound-icon {
					font-size: 18px;
				}
			}

			.content-row {
				margin-top: 4px;
			}

			.meaning-text {
				font-size: 15px;
				color: #666;
				line-height: 1.5;
			}
		}
	}

	/* 加载和空数据提示样式 */
	.loadmore {
		text-align: center;
		padding: 20px 0;
		font-size: 14px;
		color: #999;
	}

	.loadmore-empty {
		text-align: center;
		padding-top: 50px;
		font-size: 16px;
		color: #999;
	}
</style>