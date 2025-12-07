<template>
	<view style="height: 100vh;display: flex;flex-direction: column;">
		<view class="head">
			<NavbarDefault border title="学习回顾"></NavbarDefault>
		</view>
		<view class="statistics-wrap">
			<view class="statistics">
				<view style="color: #757575;">今日学习进度</view>
				<view class="data">
					<view class="_GCENTER">
						<view style="color: #07C160;">
							{{total}}
						</view>
						<view>
							已学习
						</view>
					</view>
					<view class="_GCENTER">
						<view style="color: #16A34A;">
							{{stats.write}}
						</view>
						<view>
							已默写
						</view>
					</view>
					<view class="_GCENTER">
						<view style="color: #2563EB;">
							{{stats.listen}}
						</view>
						<view>
							已听写
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<scroll-view scroll-y class="wordlist" @scrolltolower="loadMore">
			<view class="worditem" @click="goPage('/pages/word/worddetail/worddetail',{
				id:item.id
			})" :key="item.id" v-for="item in wordList">
				<view class="heads jpfont">
					<text>{{formatWordName(item.words,item.kana)}}</text>
					<view class="tags">
						<view class="tag sound" v-if="item.write">已默写</view>
						<view class="tag write" v-if="item.listen">已听写</view>
					</view>
				</view>
				<view class="item-desc">{{item.description}}</view>
			</view>
            </scroll-view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive
	} from 'vue'
	import NavbarDefault from "@/components/navbar/default"
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		goPage,
		formatWordName
	} from "@/utils/common.js"
	import $http from "@/api/index.js"

	
	const wordList = ref([])
	const page = ref(1)
	const pageSize = ref(10)
	
	const loading = ref(false)
	const finished = ref(false)
	const total = ref(0)
	
	const stats = reactive({
		write: 0,
		listen: 0
	})

	const loadMore = async () => {
		if (loading.value || finished.value) return
		
		loading.value = true
		try {
			const res = await $http.word.getLearnt({
				page: page.value,
				page_size: pageSize.value
			})
			
			const newItems = res.data || []
			const totalCount = res.total || 0
			
			total.value = totalCount
			
			
			newItems.forEach(item => {
				if(item.write) stats.write++
				if(item.listen) stats.listen++
			})

			if (page.value === 1) {
				wordList.value = newItems
			} else {
				wordList.value.push(...newItems)
			}

			if (wordList.value.length >= totalCount) {
				finished.value = true
			} else {
				page.value++
			}
		} catch (e) {
			console.error(e)
		} finally {
			loading.value = false
		}
	}

	onLoad(op => {
		stats.write = 0
		stats.listen = 0
		loadMore()
	})
</script>
<style>
	page {
		background-color: white;
	}
</style>
<style scoped lang="scss">
	.head {
		position: sticky;
		top: 0;
		z-index: 9;
	}

	.tags {
		display: flex;
		align-items: center;
		gap: 8rpx;

		.tag {
			line-height: 40rpx;
			border-radius: 8rpx;
			padding: 0 16rpx;
			font-size: 24rpx;

		}

		.write {
			background-color: rgb(220, 252, 231);
			color: rgb(21, 128, 61);
		}

		.sound {
			background-color: rgb(219, 234, 254);
			color: rgb(29, 78, 216);
		}
	}

	.wordlist {
		flex: 1;
		height: 0; 
		display: flex;
		flex-direction: column;
		gap: 32rpx;
		margin-top: 32rpx;
		padding: 16rpx 32rpx 0 32rpx; 
		box-sizing: border-box;

		.worditem {
			border-bottom: 2rpx solid #f0f0f0;
			padding-bottom: 30rpx;
			margin-bottom: 32rpx;

			.heads {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 8rpx;
			}
			
			.item-desc {
				font-size: 28rpx;
				color: #999;
				line-height: 1.5;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
		}
	}

	.statistics-wrap {
		background: white;

		.statistics {
			margin: 16rpx 32rpx 16rpx 32rpx;
			padding: 32rpx;
			border: 2rpx solid #bbf7d0;
			background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
			border-radius: 32rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.data {
				display: flex;
				align-items: center;
				gap: 32rpx;

				>view {
					flex-direction: column;
					color: #757575;
					font-size: 24rpx;

					>view {
						&:first-child {
							font-size: 44rpx;
							font-weight: 600;
						}

					}
				}
			}
		}
	}
</style>