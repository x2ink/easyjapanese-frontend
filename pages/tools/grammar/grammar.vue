<template>
	<view>
		<view class="head">
			<NavbarDefault border title="语法学习"></NavbarDefault>
			<!-- 搜索栏 -->
			<div class="search-bg">
				<div class="search-bar">
					<text class="fas fa-search"></text>
					<input @confirm="search" confirm-type="search" type="text" placeholder="搜索语法">
				</div>
			</div>
			<!-- 标签 -->
			<scroll-view scroll-x="true">
				<!-- 分类标签 -->
				<div class="tabs-container">
					<div @click="current=index" :class="{tabactive:current==index}" v-for="(item,index) in menu"
						class="tab-item">{{item}}
					</div>
				</div>
			</scroll-view>
		</view>
		<view class="list">
			<div class="item" @click="goPage('/pages/tools/grammardetail/grammardetail',{id:item.id})" :key="item.id"
				v-for="item in grammars">
				<div>
					<div class="title">
						<text>{{item.grammar}}</text>
						<span class="level-tag" :class="item.level">{{item.level}}</span>
					</div>
					<div class="content">
						<wd-text size="14px" :lines="2" color="#4b5563"
							:text="item.explain.replace(/<br>/g,'')"></wd-text>
					</div>

				</div>
				<div class="example">
					<text class="fas fa-bookmark"></text> <wd-text size="14px" :lines="1" color="#9ca3af"
						:text="`例:${item.example[0].ch}(${item.example[0].ja})`"></wd-text>
				</div>
			</div>
		</view>
		<wd-backtop :scrollTop="scrollTop"></wd-backtop>
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
		onShow,
		onPageScroll,
		onReachBottom
	} from "@dcloudio/uni-app"
	import {
		goPage
	} from "@/utils/common.js"
	import NavbarDefault from "@/components/navbar/default"
	import $http from "@/api/index.js"
	const menu = ref(['全部', 'N1', 'N2', 'N3', 'N4', 'N5'])
	const current = ref(0)
	const scrollTop = ref(0)
	onPageScroll((e) => {
		scrollTop.value = e.scrollTop
	})
	watch(current, (newVal, oldVal) => {
		value.value = ''
		page.value = 0
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
	const grammars = computed(() => {
		if (value.value.trim().length == 0) {
			if (current.value == 0) {
				return List.value
			} else {
				return List.value.filter(item => item.level == menu.value[current.value])
			}
		} else {
			current.value = 0
			return List.value.filter(item => item.grammar.indexOf(value.value) >= 0)
		}
	})
	const total = ref(0)
	const page = ref(1)
	const size = ref(20)
	const List = ref([])
	const getList = async () => {
		let res;
		if (current.value == 0) {
			res = await $http.common.searchGrammar(value.value, page.value, size.value)
		} else {
			res = await $http.common.getGrammarList(menu.value[current.value], page.value, size.value)
		}

		total.value = res.total
		if (total.value === 0) {
			return
		}
		List.value = List.value.concat(res.data)
	}
	onReachBottom(() => {
		if (total.value > List.value.length) {
			++page.value
			getList()
		}
	})
	onMounted(() => {
		getList()
	})
</script>
<style>
	page {
		background-color: white;
	}
</style>
<style lang="scss" scoped>
	.level-tag {
		font-size: 10px;
		padding: 2px 6px;
		border-radius: 4px;
		font-weight: bold;
		margin-left: 6px;
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
		padding-bottom: env(safe-area-inset-bottom);

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

			.example {
				display: flex;
				align-items: center;
				gap: 6px;
				font-size: 14px;

				text {
					color: #4AC45A;
				}
			}
		}
	}

	.tabs-container {
		padding: 6px 16px 12px 16px;
		background-color: white;
		display: flex;
		gap: 12px;
	}

	.head {
		position: sticky;
		top: 0;
		border-bottom: 1px solid #eee;
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
		background-color: white;
		padding: 12px 16px;
	}
</style>