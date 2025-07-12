<template>
	<div class="page-container">
		<!-- 顶部导航栏 -->
		<div :style="{paddingTop:`calc(${navBarHeight} + 5px)`}" class="search-header">
			<div class="search-bar-container">
				<!-- 黑色单调返回按钮 -->
				<text @click="back()" class="fas fa-chevron-left back-btn"></text>
				<!-- 搜索框 -->
				<div class="search-input-container">
					<input v-model="value" confirm-type="search" @confirm="confirm" type="text" placeholder="输入关键词搜索"
						class="search-input">
					<text class="fas fa-search search-icon"></text>
				</div>
			</div>

			<!-- 语言切换标签 -->
			<div class="language-tabs">
				<view @click="current='jc'" :class="{active:current=='jc',inactive:current!='jc'}" class="search-tab">
					日中词典</view>
				<view @click="current='cj'" :class="{active:current=='cj',inactive:current!='cj'}" class="search-tab">
					中文词典</view>
			</div>
		</div>
		<!-- 占位 -->
		<view :style="{height:`calc(102px + ${navBarHeight})`}">

		</view>
		<!-- 主要内容 -->
		<div class="main-content">
			<!-- 搜索历史 -->
			<div v-if="total==0">
				<div class="section-title" style="margin-top: 12px;">
					<span>搜索历史</span>
					<view class="clear-btn" @click="clear()">清空</view>
				</div>

				<div class="history-container">
					<text @click="fastlook(item)" v-for="item in history" :key="item"
						class="history-chip _GCENTER">{{item}}<text @click.stop="clearVal(item)"
							class="fas fa-times close-icon"></text></text>
				</div>
			</div>

			<!-- 热门搜索 -->
			<div class="hot-words" v-if="total==0">
				<div class="section-title">
					<span>热门搜索</span>
				</div>

				<div class="hot-words-container">
					<text @click="fastlook(item)" v-for="item in recommendWord" :key="item"
						class="hot-word">{{item}}</text>
				</div>
			</div>
			<!-- 搜索结果示例 -->
			<div style="padding-bottom: env(safe-area-inset-bottom);">
				<!-- 日语单词项 -->
				<view v-if="total>0&&current=='jc'">
					<div @click="goPage('/pages/word/worddetail/worddetail',{id:item.id})" class="word-item"
						v-for="item in List" :key="item.id">
						<div class="word-header">
							<div>
								<span class="word-kanji">{{formatWordName(item.word,item.kana)}}</span>
							</div>
							<!-- <span class="word-level level-n5">N5</span> -->
						</div>
						<div class="word-meaning">
							<wd-text color="#424242" size="14px" :text="item.meaning.join('')"></wd-text>
						</div>
						<!-- 	<div class="word-stats">
							<text class="fas fa-search"></text>查询{{item.browse}}次
						</div> -->
					</div>
				</view>
				<!-- 日中词典项 -->
				<!-- 	<view>
					<div class="dict-item">
						<div class="dict-chinese">漂亮</div>
						<div class="dict-pinyin">piào liang</div>
					</div>
				</view> -->
			</div>
		</div>
		<wd-backtop :scrollTop="scrollTop"></wd-backtop>
		<wd-toast />
	</div>
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
		onPageScroll,
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
	onReachBottom(() => {
		if (total.value > List.value.length) {
			++page.value
			getList()
		}
	})
	const back = () => {
		uni.navigateBack({
			delta: 1
		})
	}
	const scrollTop = ref(0)
	onPageScroll((e) => {
		scrollTop.value = e.scrollTop
	})
	const toast = useToast()
	const current = ref('jc')
	const navBarHeight = ref(0)
	const recommendWord = ref([])
	const total = ref(0)
	const history = ref([])
	const page = ref(1)
	const size = ref(20)
	const List = ref([])
	const value = ref('')
	watch(current, (newVal, oldVal) => {
		if (newVal == "cj") {
			toast.close()
			toast.warning("中日词典暂未开放")
		}
	})
	const fastlook = (val) => {
		value.value = val
		search()
	}
	const getList = async () => {
		let res;
		if (current.value == 'jc') {
			res = await $http.word.jcSearch(page.value, size.value, value.value)
		} else {
			toast.close()
			toast.warning("中日词典暂未开放")
			return
			// res = await $http.word.cjSearch(page.value, size.value, value.value)
		}
		toast.close()
		total.value = res.total
		if (total.value === 0) {
			toast.warning("没有搜到结果")
			return
		}
		List.value = List.value.concat(res.data)
	}
	const getRecommend = async () => {
		const res = await $http.word.getRecommend()
		recommendWord.value = res.data
	}
	const clear = () => {
		history.value = []
		historyrecordStore().clear('word')
	}
	const clearVal = (val) => {
		historyrecordStore().del('word', val)
		let record = historyrecordStore().wordlist
		history.value = record.slice(0, 10)
	}
	const confirm = ({
		detail
	}) => {
		if (detail.value.trim().length === 0) {
			toast.warning("搜索内容为空")
			return
		}
		if (!historyrecordStore().wordlist.includes(detail.value.trim())) {
			history.value.unshift(detail.value.trim())
			historyrecordStore().push(detail.value.trim(), 'word')
		}
		value.value = detail.value.trim()
		search()
	}
	const search = () => {
		toast.loading('正在查询中...')
		List.value = []
		page.value = 1
		getList()
	}
	onMounted(() => {
		const systemInfo = wx.getSystemInfoSync();
		const statusBarHeight = systemInfo.statusBarHeight;
		navBarHeight.value = statusBarHeight + 'px'
		getRecommend()
		let record = historyrecordStore().wordlist
		history.value = record.slice(0, 10)
	})
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
	}

	.search-bar-container {
		display: flex;
		align-items: center;
	}

	/* 黑色单调返回按钮 */
	.back-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 8px;
		background-color: transparent;
		color: #212121;
		font-size: 20px;
	}

	.search-input-container {
		flex: 1;
		position: relative;
	}

	.search-input {
		padding: 0 12px 0 36px;
		height: 40px;
		border-radius: 40px;
		border: none;
		background-color: #f5f5f5;
		font-size: 14px;
		outline: none;
	}

	.search-input:focus {
		box-shadow: 0 0 0 1px #07C160;
	}

	.search-icon {
		position: absolute;
		left: 12px;
		top: 50%;
		transform: translateY(-50%);
		color: #999;
		font-size: 14px;
	}

	.language-tabs {
		display: flex;
		margin-top: 12px;
		align-items: center;
	}

	.search-tab {
		padding: 6px 12px;
		border-radius: 16px;
		font-size: 14px;
		margin-right: 8px;
		border: none;
		cursor: pointer;
	}

	.search-tab.active {
		background-color: #07C160;
		color: white;
	}

	.search-tab.inactive {
		background-color: #f0f0f0;
		color: #757575;
	}

	/* 主要内容区 */
	.main-content {
		flex: 1;
		overflow-y: auto;
		padding: 0 16px;
	}

	/* 搜索历史 */
	.section-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 14px;
		font-weight: 500;
		color: #333;
	}

	.clear-btn {
		font-size: 12px;
		color: #999;
		border: none;
		background: none;
		cursor: pointer;
	}

	.history-container {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin: 12px 0;
	}

	.history-chip {
		padding: 6px 12px;
		background-color: #f5f5f5;
		border-radius: 16px;
		font-size: 13px;
		color: #424242;
	}

	.history-chip .close-icon {
		color: #999;
		margin-left: 4px;
		font-size: 12px;
	}

	/* 热门搜索 */
	.hot-words-container {
		display: flex;
		flex-wrap: wrap;
		margin-top: 12px;
		gap: 6px;
	}

	.hot-word {
		display: inline-block;
		padding: 0 16px;
		line-height: 30px;
		background-color: #E8F5E9;
		border-radius: 30px;
		font-size: 14px;
		color: #2E7D32;
		font-weight: 500;
	}

	.word-item {
		padding: 12px 0;
		border-bottom: 1px solid #f0f0f0;
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

	.word-level {
		font-size: 12px;
		padding: 2px 6px;
		border-radius: 4px;
		color: white;
		font-weight: 500;
	}

	.level-n5 {
		background-color: #4CAF50;
	}

	.level-n4 {
		background-color: #2196F3;
	}

	.level-n3 {
		background-color: #9C27B0;
	}

	.level-n2 {
		background-color: #FF9800;
	}

	.level-n1 {
		background-color: #F44336;
	}

	.word-meaning {
		font-size: 14px;
		color: #424242;
		margin-top: 6px;
		line-height: 1.4;
	}

	.word-stats {
		display: flex;
		align-items: center;
		gap: 4px;
		margin-top: 8px;
		font-size: 12px;
		color: #9E9E9E;
	}

	.word-stats i {
		margin-right: 4px;
	}

	/* 日中词典结果项 */
	.dict-item {
		background-color: white;
		border-radius: 8px;
		padding: 12px;
		margin-bottom: 12px;
		border-bottom: 1px solid #f0f0f0;
	}

	.dict-chinese {
		font-size: 16px;
		font-weight: 500;
		color: #212121;
	}

	.dict-pinyin {
		font-size: 14px;
		color: #757575;
		margin-top: 4px;
	}
</style>