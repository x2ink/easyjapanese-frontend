<template>
	<view class="page-container">

		<view class="fixed-header">
			<view class="head">
				<NavbarDefault border title="语法学习"></NavbarDefault>
			</view>
			<view class="search-bg">
				<view class="search-bar">
					<text class="fas fa-search"></text>
					<input @confirm="search" confirm-type="search" type="text" placeholder="搜索语法">
				</view>
			</view>
			<view class="tabs-container">
				<TabSlider @changeTab="changeTab" :current="current" :tabList="menu"></TabSlider>
			</view>
		</view>

		<scroll-view class="scroll-content" @scrolltolower="reachBottom"
			scroll-y="true" :scroll-with-animation="true">
			<view class="list">
				<view class="item" @click="goPage('/pages/tools/grammardetail/grammardetail',{id:item.id})"
					:key="item.id" v-for="item in List">
					<view>
						<view class="title">
							<text>{{item.grammar}}</text>
							<span class="level-tag" :class="item.level">N{{item.level}}</span>
						</view>
						<view class="content">
							<view style="font-size: 14px;color: #4b5563;">{{item.meanings.join(';')}}</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed,
		watch
	} from 'vue' // 移除了 nextTick
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import {
		goPage
	} from "@/utils/common.js"
	import NavbarDefault from "@/components/navbar/default"
	import $http from "@/api/index.js"
	import TabSlider from "@/components/slider/slider.vue"
	
	const menu = ref(['全部', 'N1', 'N2', 'N3', 'N4', 'N5'])
	const current = ref(0)
	// 移除了 scrollTop 变量

	const changeTab = (e) => {
		current.value = e
	}
	watch(current, (newVal, oldVal) => {
		value.value = ''
		page.value = 1
		List.value = []
		getList()
	})
	const search = ({
		detail
	}) => {
		current.value = 0
		value.value = detail.value
		page.value = 0
		List.value = []
		getList()
	}
	const value = ref('')
	const total = ref(0)
	const page = ref(1)
	const size = ref(20)
	const List = ref([])
	const getList = async () => {
		let res;
		if (current.value == 0) {
			if (value.value) {
				res = await $http.common.getGrammarList({
					page: page.value,
					pageSize: size.value,
					val: value.value
				})
			} else {
				res = await $http.common.getGrammarList({
					page: page.value,
					pageSize: size.value
				})
			}
		} else {
			res = await $http.common.getGrammarList({
				page: page.value,
				pageSize: size.value,
				level: menu.value[current.value].replace("N", '')
			})
		}
		total.value = res.total
		if (total.value === 0) {
			return
		}
		List.value = List.value.concat(res.data)
	}
	
	// 移除了 wrapScrollTop, scroll 方法, backTop 方法
	
	const reachBottom = () => {
		if (total.value > List.value.length) {
			++page.value
			getList()
		}
	}
	
	onMounted(() => {
		getList()
	})
</script>

<style>
	page {
		background-color: white;
		height: 100vh;
		overflow: hidden;
	}
</style>

<style lang="scss" scoped>
	.page-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: white;
	}

	.fixed-header {
		background-color: white;
		z-index: 10;
		flex-shrink: 0;
	}

	.scroll-content {
		flex: 1;
		height: 0;
		overflow: hidden;
	}

	.level-tag {
		font-size: 10px;
		padding: 2px 6px;
		border-radius: 4px;
		font-weight: bold;
		margin-left: 6px;
	}

	.tabs-container {
		background-color: white;
		padding: 6px 0 12px 0;
	}

	.N1 {
		background-color: #F44336;
		color: white;
	}

	.N2 {
		background-color: #FF9800;
		color: white;
	}

	.N3 {
		background-color: #4CAF50;
		color: white;
	}

	.N4 {
		background-color: #2196F3;
		color: white;
	}

	.N5 {
		background-color: #9C27B0;
		color: white;
	}

	.list {
		.item {
			padding: 12px 16px;
			border-bottom: 1px solid #eee;

			.title {
				font-size: 16px;
				font-weight: bold;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

			.content {
				margin: 4px 0;
			}
		}
	}

	.head {
		background-color: white;
	}

	.tab-item {
		font-size: 14px;
		white-space: nowrap;
	}

	.tabactive {
		color: #07C160;
	}

	.search-bar {
		background-color: #FAFAFA;
		border-radius: 8px;
		padding: 8px 12px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;

		input {
			flex: 1;
		}

		text {
			font-size: 18px;
			color: #9DA3AF;
		}
	}

	.search-bg {
		padding: 12px 16px;
	}
</style>