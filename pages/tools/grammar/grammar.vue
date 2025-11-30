<template>
	<view class="page-container">

		<view class="fixed-header">
			<view class="head">
				<NavbarDefault border title="语法学习"></NavbarDefault>
			</view>
			<view class="search-bg">
				<view class="search-bar">
					<i class="fas fa-search search-icon"></i>
					<input @confirm="search" confirm-type="search" type="text" placeholder="搜索语法" placeholder-class="placeholder-text">
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
					
					<view class="title-row">
						<text class="grammar-text">{{item.grammar}}</text>
						<span class="level-tag" :class="item.level">N{{item.level}}</span>
					</view>
					
					<view class="content-row">
						<text class="meaning-text">{{item.meanings.join('；')}}</text>
					</view>
					
				</view>
				<view style="height: 40px;"></view>
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
	} from 'vue'
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
		background-color: #ffffff;
		height: 100vh;
		overflow: hidden;
	}
</style>

<style lang="scss" scoped>
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
		/* 移除底部阴影，保持极简 */
	}

	.scroll-content {
		flex: 1;
		height: 0;
		overflow: hidden;
	}

	/* 搜索栏样式优化 */
	.search-bg {
		padding: 8px 16px 4px;
		background-color: #ffffff;
	}

	.search-bar {
		background-color: #f5f7fa; /* 更淡的背景色 */
		border-radius: 100px; /* 全圆角胶囊样式 */
		height: 40px;
		padding: 0 16px;
		display: flex;
		align-items: center;
		gap: 10px;
		transition: background-color 0.2s;

		&:active {
			background-color: #edf0f3;
		}

		input {
			flex: 1;
			font-size: 14px;
			color: #333;
		}

		.search-icon {
			font-size: 14px;
			color: #aeb4c0;
		}
	}
	
	/* 深度选择器修改 placeholder 颜色 */
	:deep(.placeholder-text) {
		color: #aeb4c0;
	}

	.tabs-container {
		background-color: #ffffff;
		padding: 4px 0 8px 0;
	}

	/* 列表样式优化 */
	.list {
		padding-top: 4px;
		
		.item {
			padding: 16px 20px; /* 增加内边距 */
			border-bottom: 1px solid #f7f8fa; /* 极淡的分割线 */
			display: flex;
			flex-direction: column;
			gap: 6px;
			transition: background-color 0.2s;
			
			&:active {
				background-color: #fafafa;
			}

			.title-row {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
			
			.grammar-text {
				font-size: 17px;
				font-weight: 600;
				color: #333;
			}

			.content-row {
				margin-top: 2px;
			}
			
			.meaning-text {
				font-size: 14px;
				color: #666;
				line-height: 1.5;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2; /* 最多显示2行 */
				overflow: hidden;
			}
		}
	}

	/* 标签样式优化 */
	.level-tag {
		font-size: 11px;
		padding: 2px 8px;
		border-radius: 6px;
		font-weight: 600;
		margin-left: 12px;
		flex-shrink: 0;
		line-height: 1.4;
	}

	.N1 {
		background-color: rgba(244, 67, 54, 0.1);
		color: #F44336;
	}

	.N2 {
		background-color: rgba(255, 152, 0, 0.1);
		color: #FF9800;
	}

	.N3 {
		background-color: rgba(76, 175, 80, 0.1);
		color: #4CAF50;
	}

	.N4 {
		background-color: rgba(33, 150, 243, 0.1);
		color: #2196F3;
	}

	.N5 {
		background-color: rgba(156, 39, 176, 0.1);
		color: #9C27B0;
	}

	.head {
		background-color: white;
	}
</style>