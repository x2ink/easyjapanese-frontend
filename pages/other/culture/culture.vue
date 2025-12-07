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
				<wd-loading size="40rpx" color="#999"></wd-loading>
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
	
	const list = ref([])
	const total = ref(0)
	const page = ref(1)
	const size = ref(10)
	const isLoading = ref(false)

	
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

	
	const reachBottom = () => {
		if (!isLoading.value && list.value.length < total.value) {
			page.value++
			getList()
		}
	}

	
	const goDetail = (item) => {
		console.log(item);
		goPage('/pages/other/markdown/markdown', {
			url: item.url,
			title: item.title,
			id: item.ID,
			type: "culture"
		})
	}

	
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
		padding: 24rpx;
		box-sizing: border-box;
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 30rpx;
		
	}

	
	.card {
		background-color: #ffffff;
		border-radius: 16rpx;
		overflow: hidden;
		
		display: flex;
		flex-direction: column;
		

		.cover {
			width: auto;
			aspect-ratio: 16 / 9;
			background-color: #eee;
			display: block;
		}

		.info-container {
			padding: 24rpx;

			.title-box {
				margin-bottom: 20rpx;

				.title {
					font-size: 32rpx;
					font-weight: 500;
					color: #333;
					line-height: 1.5;
					
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
			}

			
			.meta-row {
				display: flex;
				justify-content: space-between;
				
				align-items: center;

				.date {
					font-size: 24rpx;
					color: #999;
				}

				.stat-item {
					display: flex;
					align-items: center;
					gap: 8rpx;

					.num {
						font-size: 24rpx;
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
		padding: 40rpx 0;

		text {
			font-size: 24rpx;
			color: #ccc;
		}
	}

	.bottom-spacer {
		height: 60rpx;
	}
</style>