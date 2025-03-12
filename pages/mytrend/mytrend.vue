<template>
	<view>
		<NavBar title="我的动态" style="background-color: #f3f3f5;"></NavBar>
		<view style="position: relative;">
			<view v-if="noResult">
				<wd-status-tip image="content" tip="没有动态" />
			</view>
			<view v-else class="list">
				<view @click="getDetail(item.id)" class="item" v-for="item in List" :key="item.id">
					<uv-avatar size="40" :src="item.user.avatar"></uv-avatar>
					<view style="flex: 1;">
						<view class="head">
							<view class="userinfo">
								<p>{{item.user.nickname}}</p>
								<view style="display: flex;align-items: center;">
									<wd-tag v-if="item.user.role=='嘉宾'" custom-class="space">嘉宾</wd-tag>
									<wd-tag v-else-if="item.user.role=='官方'" custom-class="space"
										type="primary">官方</wd-tag>
									<wd-tag v-else-if="item.user.role=='会员'" custom-class="space"
										type="danger">会员</wd-tag>
								</view>
							</view>
						</view>
						<view class="body">

							<p class="content" v-html="item.content.replace(/\n/g,'<br>')"></p>
							<view class="images">
								<view class="image" v-for="image in item.images" :key="image">
									<uv-image mode="aspectFill" radius="4px" width="100%" height="100%"
										:src="image"></uv-image>
								</view>
							</view>
						</view>
						<view class="footer">
							<p class="left">{{dayjs().to(dayjs(item.created_at))}}</p>
							<view class="right">
								<view>
									<wd-icon name="heart" color="#999" size="18px"></wd-icon>
									<text>{{item.like}}</text>
								</view>
								<view>
									<wd-icon name="browse" color="#999" size="18px"></wd-icon>
									<text>{{item.browse}}</text>
								</view>
								<view>
									<wd-icon name="chat1" color="#999" size="18px"></wd-icon>
									<text>{{item.comment}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<wd-loadmore v-if="List.length>0&&loadMoreShow" custom-class="loadmore" :state="loadMoreText" />
		</view>

	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'
	import {
		onShow,
		onReachBottom
	} from '@dcloudio/uni-app'
	import NavBar from '@/components/navbar.vue'
	import dayjs from 'dayjs'
	import relativeTime from 'dayjs/plugin/relativeTime'
	import $http from "@/api/index.js"
	import 'dayjs/locale/zh'
	dayjs.locale('zh')
	dayjs.extend(relativeTime)
	const loadMoreText = computed(() => {
		if (total.value == List.value.length) {
			return "finished"
		} else {
			return "loading"
		}
	})
	const getDetail = (id) => {
		uni.navigateTo({
			url: "/pages/trenddetail/trenddetail?id=" + id
		})
	}
	onReachBottom(() => {
		if (total.value > List.value.length) {
			++page.value
			getTrendList(page.value, size.value)
		}
	})
	const List = ref([])
	const page = ref(1)
	const size = ref(10)
	const total = ref(0)
	const noResult = ref(false)
	const loadMoreShow = ref(true)
	const getTrendList = async (page, size) => {
		const res = await $http.trend.getMyTrendList(page, size)
		List.value = List.value.concat(res.data)
		total.value = res.total
		if (res.total === List.value.length) {
			loadMoreShow.value = false
		} else {
			loadMoreShow.value = true
		}
		if (res.total === 0) {
			noResult.value = true
		} else {
			noResult.value = false
		}
	}
	const refresh = () => {
		page.value = 1
		size.value = 10
		List.value = []
		total.value = 0
		getTrendList(page.value, size.value)
	}
	onShow(() => {
		refresh()
	})
</script>

<style scoped lang="scss">
	:deep(.loadmore) {
		background-color: #f5f5f5;
		margin: 0;

		>view {
			margin: 0;
		}
	}

	.list {
		background-color: #f5f5f5;
		padding: 5px 15px;
		display: flex;
		flex-direction: column;
		gap: 15px;

		.item {
			display: flex;
			background-color: white;
			padding: 15px;
			gap: 15px;
			border-radius: 8px;

			.footer {
				justify-content: space-between;
				display: flex;
				align-items: center;

				.right {
					display: flex;
					align-items: center;
					gap: 10px;

					text {
						font-size: $uni-font-size-sm;
						color: $uni-text-color-grey;
					}

					>view {
						display: flex;
						align-items: center;
						gap: 5px;
					}
				}

				.left {
					font-size: $uni-font-size-sm;
					color: $uni-text-color-grey;
				}
			}

			.body {


				.images {
					display: grid;
					grid-template-columns: repeat(3, 1fr);
					gap: 10px;
					margin-bottom: 5px;

					.image {
						object-fit: cover;
						width: 100%;
						aspect-ratio: 1;
						border-radius: $uni-border-radius-base;
					}
				}

				.content {
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 4;
					/* 显示最多4行 */
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: normal;
					/* 允许换行 */
					margin: 5px 0;
					font-size: $uni-font-size-base;
				}
			}

			.head {
				display: flex;
				gap: 10px;
				position: relative;

				.btn {
					position: absolute;
					right: 0;
				}

				.userinfo {
					display: flex;
					gap: 5px;
					// align-items: center;

					p {
						&:nth-of-type(1) {
							font-size: 15px;
						}

						&:nth-of-type(2) {
							font-size: $uni-font-size-sm;
							color: $uni-text-color-grey;
						}
					}
				}
			}
		}
	}
</style>