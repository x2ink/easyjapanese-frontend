<template>
	<view>
		<view style="position: sticky;top: 0;background-color: white;">
			<NavbarDefault border title="单词列表"></NavbarDefault>
			<!-- 搜索栏 -->
			<div class="search-bg">
				<div class="search-bar">
					<text class="fas fa-search"></text>
					<input confirm-type="search" @confirm="confirm" type="text" placeholder="搜索单词">
					<view @click="allSelect=!allSelect">
						<text class="fas fa-sliders-h"></text>
					</view>
				</div>
			</div>
			<!-- 分类标签 -->
			<div class="tabs-container">
				<div class="tab-item" @click="currentTab=index" :class="{tabActive:currentTab==index}"
					v-for="(item,index) in tabs" :key="item.value">{{item.name}}</div>
			</div>
			<!-- 批量操作栏 -->
			<div class="batch-selector" v-if="allSelect">
				<div class="flex items-center">
					<div @click="allSelectWord()" class="checkbox-custom" :class="{checkboxactive:isAllSelect}">
						<i class="fas fa-check text-xs" v-if="isAllSelect"></i>
					</div>
					<span class="text-sm text-gray-600">全选</span>
				</div>
				<div class="text-sm text-gray-500">已选 <span class="text-green-500">{{selectCount}}</span> 个</div>
			</div>
		</view>
		<!-- 列表组 -->
		<view class="word-wrap">
			<div class="word-item" @click="goPage('/pages/word/worddetail/worddetail',{id:item.id})"
				v-for="(item,index) in List" :key="item.id">
				<div @click.stop="selectWord(index)" :class="{checkboxactive:item.select}" class="checkbox-custom"
					v-if="allSelect">
					<i class="fas fa-check text-xs" v-if="item.select"></i>
				</div>
				<view>
					<div class="word-header">
						<div>
							<span class="word-kanji">{{formatWordName(item.word,item.kana)}}</span>
						</div>
					</div>
					<div class="word-meaning">
						<wd-text color="#424242" size="14px" :text="item.meaning.join('')"></wd-text>
					</div>
				</view>
			</div>
		</view>
		<!-- 批量操作按钮 (默认隐藏) -->
		<div class="batch-actions _GCENTER" v-if="selectCount>0">
			<view class="text-green-500">
				<text class="fas fa-check-circle"></text>标记为已学
			</view>
			<view @click="delWords()" class="text-red-500">
				<text class="fas fa-trash-alt"></text>删除
			</view>
		</div>
		<wd-backtop :scrollTop="scrollTop"></wd-backtop>
		<wd-toast />
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
		onReachBottom,
		onPageScroll,
	} from "@dcloudio/uni-app"
	import {
		goPage,
		formatWordName,
		back
	} from "@/utils/common.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	import NavbarDefault from "@/components/navbar/default"
	import $http from "@/api/index.js"
	const currentTab = ref(0)
	const isAllSelect = computed(() => {
		console.log(selectCount.value, List.value.length);
		return selectCount.value == List.value.length && selectCount.value != 0
	})
	const tabs = ref([{
		name: "全部",
		value: 0
	}, {
		name: "未学习",
		value: 1
	}, {
		name: "已掌握",
		value: 2
	}, {
		name: "待复习",
		value: 3
	}])
	const scrollTop = ref(0)
	onPageScroll((e) => {
		scrollTop.value = e.scrollTop
	})
	const delWords = async () => {
		const res = await $http.word.removeBookWords(id.value, {
			ids: List.value.filter(item => item.select).map(item => item.id)
		})
		toast.success('删除成功')
		List.value = []
		page.value = 1
		getList()
	}
	const allSelectWord = () => {
		if (total.value == selectCount.value) {
			List.value = List.value.map(item => {
				return {
					...item,
					select: false
				}
			})
		} else {
			List.value = List.value.map(item => {
				return {
					...item,
					select: true
				}
			})
		}
	}
	const selectWord = (index) => {
		List.value[index].select = !List.value[index].select
	}
	const confirm = ({
		detail
	}) => {
		if (detail.value.trim().length === 0) {
			toast.warning("搜索内容为空")
			return
		}
		value.value = detail.value.trim()
		search()
	}
	const search = () => {
		List.value = []
		page.value = 1
		getList()
	}
	const allSelect = ref(false)
	const total = ref(0)
	const page = ref(1)
	const size = ref(20)
	const List = ref([])
	const value = ref('')
	const selectCount = computed(() => {
		return List.value.filter(item => item.select == true).length
	})
	const reList = () => {
		total.value = 0
		List.value = []
		page.value = 1
		value.value = ''
		getList()
	}
	watch(currentTab, (newVal, oldVal) => {
		reList()
	})
	const getList = async () => {
		const res = await $http.word.getBookWord(id.value, page.value, size.value, value.value, currentTab.value)
		total.value = res.total
		if (total.value === 0) {
			return
		}
		List.value = List.value.concat(res.data.map(item => {
			return {
				...item,
				select: false
			}
		}))
	}
	const id = ref(null)
	onReachBottom(() => {
		if (total.value > List.value.length) {
			++page.value
			getList()
		}
	})
	onLoad((e) => {
		if (e.id) {
			id.value = e.id
		}
		getList()
	})
</script>

<style lang="scss" scoped>
	page {
		background-color: white;
	}

	.word-wrap {
		border-top: 1px solid #eee;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.word-item {
		display: flex;
		align-items: center;
		background: white;
		padding: 12px 16px;
		border-bottom: 1px solid #eee;
	}

	.word-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
	}

	.word-kanji {
		font-size: 18px;
		font-weight: 600;
		color: #212121;
	}

	.word-furigana {
		font-size: 14px;
		color: #757575;
		margin-left: 8px;
	}

	.word-katakana {
		font-size: 14px;
		color: #757575;
		font-style: italic;
	}

	.batch-actions {
		position: fixed;
		bottom: calc(env(safe-area-inset-bottom) + 20px);
		left: 50%;
		transform: translateX(-50%);
		background: white;
		border-radius: 24px;
		padding: 8px 16px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		z-index: 20;
		gap: 16px;

		>view {
			display: flex;
			align-items: center;
			gap: 4px;
		}
	}

	.text-green-500 {
		color: #22c55e;
	}

	.text-red-500 {
		color: #ef4444;
	}

	.text-gray-500 {
		color: #6b7280;
	}

	.text-gray-600 {
		color: #4b5563;
	}

	.flex {
		display: flex;
	}

	.text-sm {
		font-size: 14px;
	}

	.items-center {
		align-items: center;
	}

	.batch-selector {
		padding: 0 16px 16px;
		background-color: white;
		border-bottom-width: 1px;
		border-color: #f3f4f6;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.checkboxactive {
		color: white;
		background-color: #07C160;
		border: #07C160;
	}

	.checkbox-custom {
		width: 20px;
		height: 20px;
		border: 1px solid #E0E0E0;
		border-radius: 4px;
		margin-right: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
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

	.tabs-container {
		padding: 6px 16px 16px;

		display: flex;
		gap: 12px;
	}

	.tab-item {
		font-size: 14px;
		white-space: nowrap;
	}

	.tabActive {
		color: #07C160;
	}
</style>