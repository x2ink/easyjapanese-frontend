<template>
	<view style="height: 100vh;background-color: #f5f5f5;">
		<Navbar style="background-color: white;">
			<template v-slot:center>
				<SearchInput @confirm="search" @change="inputChange"></SearchInput>
			</template>
		</Navbar>
		<view style="padding:5px 15px 10px 15px;background-color: white;">
			<wd-segmented size="small" customClass="segmented" :options="list" v-model:value="current"></wd-segmented>
		</view>
		<view class="title" v-if="total==0">
			<p>搜索历史</p>
			<wd-icon name="clear" @click="clear()" size="20px" color="#999" />
		</view>
		<!-- 历史记录 -->
		<view class="history" v-if="total==0">
			<view @click="clickrecord(item)" class="item" v-for="item in history" :key="item">
				{{item}}
			</view>
			<view class="more" @click="lookmore()" v-if="moreShow">
				<wd-icon size="18px" name="chevron-down" color="#000" />
			</view>
		</view>
		<view v-if="noResult">
			<wd-status-tip image="search" tip="没有搜索到结果" />
		</view>
		<!-- 列表 -->
		<WordList v-if="List.length>0" :type="`${current=='日中'?'jc':'cj'}`" style="margin: 15px;" :list="List">
		</WordList>
		<wd-loadmore v-if="List.length>0&&total>List.length" custom-class="loadmore" :state="loadmore" />

		<!--  -->
		<wd-action-sheet :z-index="4" cancel-text="取消" v-model="activeShow" :actions="actions" />
	</view>
	<wd-backtop :scrollTop="scrollTop"></wd-backtop>
</template>

<script setup>
	import {
		ref,
		onMounted,
		watch,
		computed
	} from 'vue'
	import WordList from "@/components/wordlist.vue"
	import Navbar from "@/components/navbar.vue"
	import $http from "@/api/index.js"
	import SearchInput from '@/components/searchinput.vue'
	import {
		searchrecordStore
	} from "@/stores/index.js"
	import {
		onReachBottom,
		onPageScroll,
	} from "@dcloudio/uni-app"
	const scrollTop = ref(0)
	onPageScroll((e) => {
		scrollTop.value = e.scrollTop
	})
	const inputChange = (e) => {
		val.value=e
	}
	const loadmore = computed(() => {
		if (total.value == List.value.length) {
			return "finished"
		} else {
			return "loading"
		}
	})
	const history = ref([])
	const moreShow = ref(false)
	const clear = () => {
		moreShow.value = false
		history.value = []
		searchrecordStore().clear()
	}
	const lookmore = () => {
		moreShow.value = false
		history.value = searchrecordStore().list
	}
	onMounted(() => {
		let record = searchrecordStore().list
		if (record.length > 10) {
			moreShow.value = true
		}
		history.value = record.slice(0, 10)
	})
	const page = ref(1)
	const size = ref(20)
	const val = ref('')
	const List = ref([])
	const total = ref(0)
	const noResult = ref(false)
	const list = ref(['日中', '中日'])
	const current = ref('日中')
	watch(current, (newVal, oldVal) => {
		noResult.value = false
		List.value = []
		page.value = 1
		if (val.value.length > 0) {
			uni.showLoading({
				title: "正在加载"
			})
		}
		getList()
	})
	onReachBottom(() => {
		if (total.value > List.value.length) {
			++page.value
			getList()
		}
	})
	const clickrecord = (item) => {
		val.value = item
		search()
	}
	const search = async () => {
		if (!searchrecordStore().list.includes(val.value)) {
			history.value.unshift(val.value)
			searchrecordStore().push(val.value)
		}
		uni.showLoading({
			title: "正在加载"
		})
		noResult.value = false
		List.value = []
		page.value = 1
		getList()
	}
	const getList = async () => {
		let res;
		if (current.value == '日中') {
			res = await $http.word.jcSearch(page.value, size.value, val.value)
		} else {
			res = await $http.word.cjSearch(page.value, size.value, val.value)
		}
		uni.hideLoading()
		total.value = res.total
		if (total.value === 0) {
			noResult.value = true
			return
		}
		List.value = List.value.concat(res.data)

	}
	const searchType = ref('全部')
	const menu = ref([{
			content: '全部'
		},
		{
			content: '单词'
		},
		{
			content: '语法'
		}
	])
	const activeShow = ref(false)
	const actions = ref([{
			name: '选项1'
		},
		{
			name: '选项2'
		},
		{
			name: '选项3'
		}
	])
	const changeSearchType = (e) => {
		console.log(e);
	}
</script>

<style scoped lang="scss">
	:deep(.segmented) {}

	:deep(.loadmore) {
		background-color: #f4f4f4;
		margin: 0;

		>view {
			margin: 0;
		}
	}

	.title {
		padding: 10px 15px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.history {
		padding: 0 15px;
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	:deep(.wd-search__cover) {
		background-color: #EFEFEF;
	}

	:deep(.wd-search__search-left-icon) {
		color: var(--wot-search-icon-color, var(--wot-color-icon, #d9d9d9)) !important;
		z-index: 9 !important;
	}

	:deep(.wd-search__input) {
		background-color: #EFEFEF;
		border-radius: var(--wot-search-input-radius, 15px);
	}

	.history {
		display: flex;
		flex-wrap: wrap;

		>view {
			background-color: #EFEFEF;
		}



		.item {
			font-size: $uni-font-size-sm;
			height: 28px;
			line-height: 28px;
			padding: 0 15px;
			border-radius: 28px;
		}

		.more {
			border-radius: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 28px;
			width: 28px;
		}
	}

	.search {
		background-color: transparent !important;
	}
</style>