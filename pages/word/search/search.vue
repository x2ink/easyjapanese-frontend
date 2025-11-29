<template>
	<view class="page-container">
		<view :style="{paddingTop:`calc(${navBarHeight} + 5px)`}" class="search-header">
			<view class="search-bar-container">
				<text @click="back()" class="fas fa-chevron-left back-btn"></text>
				<view class="search-input-container">
					<input v-model="value" confirm-type="search" @confirm="onSearchConfirm" type="text"
						placeholder="输入关键词搜索" class="search-input">
					<text class="fas fa-search search-icon"></text>
					<text v-if="value" @click="clearInput" class="fas fa-times-circle clear-input-icon"></text>
				</view>
			</view>

			<view class="language-tabs">
				<view @click="switchTab('jc')" :class="['search-tab', current==='jc' ? 'active' : 'inactive']">
					日中词典
				</view>
				<view @click="switchTab('cj')" :class="['search-tab', current==='cj' ? 'active' : 'inactive']">
					中文词典
				</view>
			</view>
		</view>

		<view :style="{height:`calc(102px + ${navBarHeight})`}"></view>

		<view class="main-content">

			<view v-if="!isSearching">
				<view v-if="history.length > 0">
					<view class="section-title" style="margin-top: 12px;">
						<text>搜索历史</text>
						<view class="clear-btn" @click="clearHistory()">清空</view>
					</view>

					<view class="history-container">
						<view @click="fastLook(item)" v-for="item in history" :key="item" class="history-chip">
							<text>{{item}}</text>
							<text @click.stop="removeHistoryItem(item)" class="fas fa-times close-icon"></text>
						</view>
					</view>
				</view>

				<view class="hot-words" v-if="recommendWord.length > 0">
					<view class="section-title">
						<text>热门搜索</text>
					</view>

					<view class="hot-words-container">
						<text @click="fastLook(item)" v-for="item in recommendWord" :key="item" class="hot-word">
							{{item}}
						</text>
					</view>
				</view>
			</view>

			<view v-else-if="isSearching && !loading && total === 0" class="empty-state">
				<wd-status-tip custom-style="margin-top: 40px;" :image-size="{ height: 128, width: 128 }"
					image="https://jpx2ink.oss-cn-shanghai.aliyuncs.com/images/status/japan_mountain.png"
					tip="没有找到相关结果" />

				<view class="feedback-action">
					<wd-button custom-style="width: 120px;background:#07C160" size="medium"
						@click="onFeedback">提交反馈</wd-button>
				</view>
			</view>

			<view v-else style="padding-bottom: env(safe-area-inset-bottom);">
				<view v-if="current === 'jc'">
					<view @click="goPage('/pages/word/worddetail/worddetail',{id:item.id})" class="word-item"
						v-for="(item, index) in List" :key="index">
						<view class="word-header">
							<view>
								<text class="word-kanji">{{formatWordName(item.words, item.kana)}}{{item.tone}}</text>
							</view>
						</view>
						<view class="word-meaning">
							<wd-text color="#424242" size="14px" :text="item.description"></wd-text>
						</view>
					</view>
				</view>

				<wd-loadmore v-if="List.length > 0" :state="loadStatus" />
			</view>
		</view>

		<wd-backtop :scrollTop="scrollTop"></wd-backtop>
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		watch
	} from 'vue'
	import {
		onLoad,
		onShow,
		onReachBottom,
		onPageScroll
	} from "@dcloudio/uni-app"
	import {
		goPage,
		formatWordName
	} from "@/utils/common.js"
	import $http from "@/api/index.js"
	import {
		historyrecordStore
	} from "@/stores/index.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'

	// --- 状态变量 ---
	const toast = useToast()
	const scrollTop = ref(0)
	const navBarHeight = ref('0px')
	const current = ref('jc')
	const value = ref('')

	// 列表相关
	const List = ref([])
	const page = ref(1)
	const size = ref(20)
	const total = ref(0)

	// 状态控制
	const loadStatus = ref('more') // 'more' | 'loading' | 'noMore'
	const isSearching = ref(false) // 是否进入了搜索模式
	const loading = ref(false) // 接口是否请求中(用于控制缺省页显隐)

	// 历史与推荐
	const recommendWord = ref([])
	const history = ref([])
	const historyStore = historyrecordStore()

	// --- 生命周期 ---
	onMounted(() => {
		const systemInfo = uni.getSystemInfoSync();
		navBarHeight.value = (systemInfo.statusBarHeight || 0) + 'px'

		getRecommend()
		loadHistory()
	})

	onPageScroll((e) => {
		scrollTop.value = e.scrollTop
	})

	// --- 触底加载 ---
	onReachBottom(() => {
		// 如果没在搜索模式，或者没有更多数据，或者正在加载中，则不执行
		if (!isSearching.value || loadStatus.value === 'noMore' || loadStatus.value === 'loading') return;

		page.value++
		getList()
	})

	// --- 方法 ---

	const back = () => {
		uni.navigateBack({
			delta: 1
		})
	}

	const clearInput = () => {
		value.value = ''
		// 清空输入框后，回到初始历史记录状态
		isSearching.value = false
		List.value = []
	}

	const switchTab = (tab) => {
		if (tab === 'cj') {
			toast.warning("中日词典暂未开放")
			return
		}
		current.value = tab
		if (value.value && isSearching.value) {
			search()
		}
	}

	// 历史记录相关
	const loadHistory = () => {
		let record = historyStore.wordlist || []
		history.value = record.slice(0, 10)
	}

	const clearHistory = () => {
		history.value = []
		historyStore.clear('word')
	}

	const removeHistoryItem = (val) => {
		historyStore.del('word', val)
		loadHistory()
	}

	const getRecommend = async () => {
		try {
			const res = await $http.word.getRecommend()
			recommendWord.value = res.data || []
		} catch (e) {
			console.error(e)
		}
	}

	const fastLook = (val) => {
		value.value = val
		search()
	}

	const onSearchConfirm = ({
		detail
	}) => {
		const val = detail.value.trim()
		if (val.length === 0) {
			toast.warning("搜索内容为空")
			return
		}

		// 存历史
		if (!historyStore.wordlist.includes(val)) {
			historyStore.push(val, 'word')
			history.value.unshift(val)
			if (history.value.length > 10) history.value.pop()
		}

		value.value = val
		search()
	}

	// 初始化搜索
	const search = () => {
		isSearching.value = true
		toast.loading('正在查询中...')

		page.value = 1
		List.value = []
		total.value = 0
		loadStatus.value = 'loading'

		getList()
	}

	const getList = async () => {
		loading.value = true
		loadStatus.value = 'loading'

		try {
			let res;
			if (current.value === 'jc') {
				res = await $http.word.jcSearch({
					page: page.value,
					page_size: size.value,
					val: value.value
				})
			} else {
				// 中日词典逻辑预留
			}

			toast.close()

			const newData = res.data || []
			total.value = res.total || 0

			// 只有当有数据时才拼接列表
			if (newData.length > 0) {
				List.value = List.value.concat(newData)
			}

			// 判断分页状态
			if (List.value.length >= total.value) {
				loadStatus.value = 'noMore'
			} else {
				loadStatus.value = 'more'
			}

		} catch (err) {
			toast.close()
			loadStatus.value = 'more'
			console.error("搜索失败", err)
		} finally {
			loading.value = false
		}
	}

	// --- 按钮逻辑 ---
	const onFeedback = () => {
		// TODO: 在这里写你的提交反馈逻辑
		console.log('点击了提交反馈按钮，关键词：', value.value)

		// 示例跳转（如果你有反馈页面的话）
		// uni.navigateTo({ url: `/pages/other/feedback/feedback?content=${value.value}` })
	}
</script>

<style>
	page {
		background-color: white;
	}
</style>

<style scoped lang="scss">
	.page-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	/* 顶部导航栏 */
	.search-header {
		padding-left: 16px;
		padding-right: 16px;
		padding-bottom: 12px;
		background-color: white;
		border-bottom: 1px solid #f0f0f0;
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		z-index: 99;
	}

	.search-bar-container {
		display: flex;
		align-items: center;
	}

	.back-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 12px;
		background-color: transparent;
		color: #212121;
		font-size: 20px;
		width: 30px;
		height: 30px;
	}

	.search-input-container {
		flex: 1;
		position: relative;
	}

	.search-input {
		padding: 0 34px;
		height: 36px;
		border-radius: 40px;
		border: none;
		background-color: #f5f5f5;
		font-size: 14px;
		color: #333;
	}

	.search-icon {
		position: absolute;
		left: 12px;
		top: 50%;
		transform: translateY(-50%);
		color: #999;
		font-size: 14px;
	}

	.clear-input-icon {
		position: absolute;
		right: 12px;
		top: 50%;
		transform: translateY(-50%);
		color: #ccc;
		font-size: 16px;
		z-index: 2;
		padding: 4px;
		/* 增加点击区域 */
	}

	.language-tabs {
		display: flex;
		margin-top: 12px;
		align-items: center;
	}

	.search-tab {
		padding: 6px 16px;
		border-radius: 16px;
		font-size: 13px;
		margin-right: 12px;
		border: none;
		transition: all 0.2s;

		&.active {
			background-color: #E8F5E9;
			color: #2E7D32;
			font-weight: 500;
		}

		&.inactive {
			background-color: #f5f5f5;
			color: #757575;
		}
	}

	/* 主要内容区 */
	.main-content {
		flex: 1;
		padding: 0 16px;
	}

	/* 搜索历史 & 标题通用 */
	.section-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 14px;
		font-weight: 600;
		color: #333;
		margin-bottom: 10px;
	}

	.clear-btn {
		font-size: 12px;
		color: #999;
		padding: 4px;
	}

	.history-container {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-bottom: 24px;
	}

	.history-chip {
		display: flex;
		align-items: center;
		padding: 6px 12px;
		background-color: #f5f5f5;
		border-radius: 4px;
		font-size: 13px;
		color: #555;

		.close-icon {
			color: #bbb;
			margin-left: 6px;
			font-size: 12px;
			padding: 2px;
		}
	}

	/* 热门搜索 */
	.hot-words-container {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.hot-word {
		padding: 6px 12px;
		background-color: #fff;
		border: 1px solid #e0e0e0;
		border-radius: 20px;
		font-size: 13px;
		color: #424242;
	}

	/* 单词列表项 */
	.word-item {
		padding: 16px 0;
		border-bottom: 1px solid #f5f5f5;

		&:active {
			background-color: #fafafa;
		}
	}

	.word-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 6px;
	}

	.word-kanji {
		font-size: 17px;
		font-weight: 600;
		color: #212121;
	}

	.word-meaning {
		margin-top: 4px;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	/* 缺省页样式 */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 20px;
	}

	.feedback-action {
		margin-top: 24px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>