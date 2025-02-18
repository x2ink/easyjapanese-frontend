<template>
	<view>
		<!-- 顶部区域 -->
		<view class="chead">
			<wd-tabs slidable custom-class="tabs" v-model="currentTab">
				<block v-for="(item,index) in tabList" :key="item.name">
					<wd-tab :title="item.name">
					</wd-tab>
				</block>
			</wd-tabs>
			<view @click="goPage('search')" class="search">
				<wd-icon name="search" size="18px" color="#979797"></wd-icon>
				<p>搜索动态内容</p>
			</view>
		</view>
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
		<wd-fab type="warning" position="right-bottom">
			<template #trigger>
				<view class="release" @click="release">
					<wd-icon name="add" size="25px" color="#ffffff"></wd-icon>
				</view>
			</template>
		</wd-fab>
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		ref,
		watch,
		onMounted,
		getCurrentInstance,
		computed
	} from 'vue'
	import dayjs from 'dayjs'
	import relativeTime from 'dayjs/plugin/relativeTime'
	import 'dayjs/locale/zh'
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	const noResult = ref(false)
	dayjs.locale('zh')
	dayjs.extend(relativeTime)
	const loadMoreText = computed(() => {
		if (total.value == List.value.length) {
			return "finished"
		} else {
			return "loading"
		}
	})
	import {
		onShow,
		onLoad,
		onReachBottom
	} from '@dcloudio/uni-app'
	import $http from "@/api/index.js"
	import Statusbar from "@/components/statusbar.vue"
	onShow(() => {
		uni.$once("addTrend", (data) => {
			if (data) {
				console.log(data);
				toast.success(`发布成功`)
				refresh()
			}
		});
	})
	const loadMoreShow = ref(true)
	const currentTab = ref(0)
	const tabList = ref([{
		name: "全部",
		id: 0
	}])
	const getDetail = (id) => {
		uni.navigateTo({
			url: "/pages/trenddetail/trenddetail?id=" + id
		})
	}
	watch(currentTab, (newVal, oldVal) => {
		List.value = []
		page.value = 1
		getTrendList(false, page.value, size.value, tabList.value[currentTab.value].id)
	})
	const page = ref(1)
	const size = ref(10)
	const total = ref(0)
	const refresh = () => {
		size.value *= page.value
		page.value = 1
		getTrendList(true, page.value, size.value, tabList.value[currentTab.value].id)
	}
	const getSection = async () => {
		const res = await $http.trend.getSection("trend")
		tabList.value = tabList.value.concat(res.data)
		getTrendList(false, page.value, size.value, tabList.value[currentTab.value].id)
	}
	const loadMore = () => {
		if (total.value > List.value.length) {
			++page.value
			getTrendList(false, page.value, size.value, tabList.value[currentTab.value].id)
		}
	}

	const release = () => {
		uni.navigateTo({
			url: "/pages/addtrend/addtrend"
		})
	}
	const List = ref([])
	const getTrendList = async (refresh, page, size, section) => {
		const res = await $http.trend.getTrendList(page, size, section)
		if (refresh) {
			List.value = res.data
		} else {
			List.value = List.value.concat(res.data)
		}
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
	const instance = getCurrentInstance();
	const query = uni.createSelectorQuery().in(instance.proxy);
	const scroll = (e) => {
		query.select('.wd-sticky__container').boundingClientRect(rect => {
			console.log(rect.top);
		}).exec();
	}
	onMounted(() => {
		getSection()
	})
	defineExpose({
		loadMore
	})
</script>

<style lang="scss" scoped>
	:deep(.wd-tabs__nav-item) {
		font-size: 16px;
	}

	:deep(.tabs) {
		background-color: transparent;
		width: 200px;
	}

	:deep(.wd-tabs) {
		background-color: transparent;
	}

	:deep(.wd-tabs__nav) {
		background-color: transparent;
	}

	.chead {
		padding: 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;


		.search {
			height: 40px;
			background: #fff;
			padding: 5px 15px;
			font-size: $uni-font-size-lg;
			box-sizing: border-box;
			border-radius: 40px;
			display: flex;
			align-items: center;

			p {
				font-size: 14px;
				color: #979797;
				margin-left: 5px;
			}
		}


	}






	.release {
		width: 50px;
		height: 50px;
		background-color: #4D80F0;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
	}

	:deep(.loadmore) {
		background-color: #f5f5f5;
		margin: 0;

		>view {
			margin: 0;
		}
	}





	.list {
		background-color: #f5f5f5;
		padding: 0 10px;
		display: flex;
		flex-direction: column;
		gap: 10px;

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
							font-size: 15;
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