<template>
	<view>
		<view :style="{height:navBarHeight}"></view>
		<!-- 顶部区域 -->
		<view style="padding: 0 10px;">
			<wd-tabs slidable="always" custom-class="tabs" v-model="currentTab">
				<block v-for="(item,index) in tabList" :key="item.name">
					<wd-tab :title="item.name">
					</wd-tab>
				</block>
			</wd-tabs>
		</view>
		<view @click="goPage('/trendpages/search/search')" class="search">
			<wd-icon name="search" size="18px" color="#979797"></wd-icon>
			<text>搜索动态内容</text>
		</view>
		<view style="position: relative;padding-top: 15px;">
			<view v-if="noResult">
				<view style="margin-top: 25px;" v-if="noResult">
					<wd-status-tip :image-size="{
				        height: 60,
				        width: 60
				}" image="http://jp.x2.ink/images/blank.png" tip="还没有动态" />
				</view>
			</view>
			<TrendList v-else :list="List"></TrendList>
			<wd-loadmore v-if="List.length>0&&loadMoreShow" custom-class="loadmore" :state="loadMoreText" />
		</view>
		<wd-fab type="warning" position="right-bottom">
			<template #trigger>
				<view class="release" @click="goPage('/trendpages/addtrend/addtrend')">
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
		computed
	} from 'vue'
	import TrendList from '@/components/trendlist/trendlist.vue'
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	const noResult = ref(false)
	const loadMoreText = computed(() => {
		if (total.value == List.value.length) {
			return "finished"
		} else {
			return "loading"
		}
	})
	import {
		onShow
	} from '@dcloudio/uni-app'
	import $http from "@/api/index.js"
	import {
		goPage
	} from "@/utils/common.js"
	onShow(() => {
		uni.$once("addTrend", (data) => {
			if (data) {
				toast.success(`发布成功`)
				refresh()
			}
		});
		uni.$once("delTrend", (data) => {
			if (data) {
				toast.success(`删除成功`)
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
		const res = await $http.trend.getSection()
		tabList.value = tabList.value.concat(res.data)
		getTrendList(false, page.value, size.value, tabList.value[currentTab.value].id)
	}
	const loadMore = () => {
		if (total.value > List.value.length) {
			++page.value
			getTrendList(false, page.value, size.value, tabList.value[currentTab.value].id)
		}
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
	const navBarHeight = ref(0)
	onMounted(() => {
		const systemInfo = wx.getSystemInfoSync();
		const statusBarHeight = systemInfo.statusBarHeight;
		navBarHeight.value = statusBarHeight + 'px'
		getSection()
	})
	defineExpose({
		loadMore
	})
</script>

<style lang="scss" scoped>
	.search {
		height: 40px;
		background: #fff;
		padding: 5px 15px;
		margin: 10px 15px 0 15px;
		font-size: $uni-font-size-lg;
		box-sizing: border-box;
		border-radius: 40px;
		display: flex;
		align-items: center;

		text {
			font-size: 14px;
			color: #979797;
			margin-left: 5px;
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
</style>