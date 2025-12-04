<template>
	<view class="page-container">
		<view class="fixed-header">
			<view class="head">
				<NavbarDefault border title="文化常识"></NavbarDefault>
			</view>
		</view>

		<scroll-view class="scroll-content" @scrolltolower="reachBottom" scroll-y="true" :scroll-with-animation="true">
			<view class="list">
				<view class="card" v-for="(item, index) in list" :key="index" @click="goDetail(item)">
					<image class="cover" :src="item.cover" mode="aspectFill"></image>

					<view class="info-container">
						<view class="title-box">
							<text class="title">{{ item.title }}</text>
						</view>

						<view class="meta-row">
							<text class="date">{{ formatDate(item.CreatedAt) }}</text>

							<view class="stat-item">
								<text class="num">{{ item.browse || 0 }} 回閲覧</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="loading-status" v-if="isLoading">
				<wd-loading size="20px" color="#999"></wd-loading>
			</view>
			<view class="no-more" v-else-if="list.length >= total && total > 0">
				<text>没有更多了</text>
			</view>
			<view class="bottom-spacer"></view>

		</scroll-view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from "vue"
	import NavbarDefault from "@/components/navbar/default.vue"
	import $http from "@/api/index.js"
	import dayjs from "dayjs"
	import {
		goPage
	} from "@/utils/common"
	// 状态管理
	const list = ref([])
	const total = ref(0)
	const page = ref(1)
	const size = ref(10)
	const isLoading = ref(false)

	/**
	 * 获取数据
	 */
	const getList = async () => {
		if (list.value.length >= total.value && total.value !== 0) {
			return
		}

		isLoading.value = true
		try {
			const res = await $http.common.getCultureList({
				page: page.value,
				page_size: size.value
			})

			total.value = res.total
			if (res.data && res.data.length > 0) {
				list.value = list.value.concat(res.data)
			}
		} catch (e) {
			console.error("获取文化列表失败", e)
			uni.showToast({
				title: '加载失败',
				icon: 'none'
			})
		} finally {
			isLoading.value = false
		}
	}

	/**
	 * 触底加载
	 */
	const reachBottom = () => {
		if (!isLoading.value && list.value.length < total.value) {
			page.value++
			getList()
		}
	}

	/**
	 * 跳转详情
	 */
	const goDetail = (item) => {
		console.log(item);
		goPage('/pages/other/markdown/markdown', {
			url: item.url,
			title: item.title,
			id: item.ID,
			type: "culture"
		})
	}

	/**
	 * 格式化时间
	 */
	const formatDate = (dateStr) => {
		if (!dateStr) return ''
		return dayjs(dateStr).format('YYYY-MM-DD HH:mm')
	}

	onMounted(() => {
		getList()
	})
</script>

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
		padding: 12px;
		box-sizing: border-box;
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 15px;
		/* 增加卡片间距 */
	}

	/* 卡片样式调整 */
	.card {
		background-color: #ffffff;
		border-radius: 8px;
		overflow: hidden;
		/* 确保图片圆角跟随 */
		display: flex;
		flex-direction: column;
		/* 垂直排列 */

		.cover {
			width: auto;
			aspect-ratio: 16 / 9;
			background-color: #eee;
			display: block;
		}

		.info-container {
			padding: 12px;

			.title-box {
				margin-bottom: 10px;

				.title {
					font-size: 16px;
					font-weight: 500;
					color: #333;
					line-height: 1.5;
					/* 标题最多显示两行 */
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
			}

			/* 底部元数据行 */
			.meta-row {
				display: flex;
				justify-content: space-between;
				/* 两端对齐：时间在左，浏览量在右 */
				align-items: center;

				.date {
					font-size: 12px;
					color: #999;
				}

				.stat-item {
					display: flex;
					align-items: center;
					gap: 4px;

					.num {
						font-size: 12px;
						color: #999;
					}
				}
			}
		}
	}

	.loading-status,
	.no-more {
		display: flex;
		justify-content: center;
		padding: 20px 0;

		text {
			font-size: 12px;
			color: #ccc;
		}
	}

	.bottom-spacer {
		height: 30px;
	}
</style>