<template>
	<view>
		<Navbar title="我的动态"></Navbar>
		<view style="position: relative;">
			<view v-if="noResult">
				<wd-status-tip :image-size="{
			        height: 60,
			        width: 60
			}" image="http://jp.x2.ink/images/blank.png" tip="还没有发布过动态" />
			</view>
			<TrendList v-else :list="List"></TrendList>
			<wd-loadmore v-if="List.length>0&&loadMoreShow" custom-class="loadmore" :state="loadMoreText" />
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted
	} from 'vue'
	import {
		onShow,
		onReachBottom
	} from '@dcloudio/uni-app'
	import Navbar from '@/components/navbar/navbar.vue';
	import $http from "@/api/index.js"
	import TrendList from '@/components/trendlist/trendlist.vue'
	const loadMoreText = computed(() => {
		if (total.value == List.value.length) {
			return "finished"
		} else {
			return "loading"
		}
	})

	import {
		goPage
	} from "@/utils/common.js"
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
	onMounted(()=>{
		refresh()
	})
	onShow(() => {
		uni.$once("delTrend", (data) => {
			if (data) {
				toast.success(`删除成功`)
				refresh()
			}
		});
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
</style>