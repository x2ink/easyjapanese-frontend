<template>
	<view>
		<Navbar>
			<template #left>
				<wd-popover mode="menu" :content="menu" @menuclick="changeSearchType">
					<view class="search-type">
						<text>{{ current }}</text>
						<wd-icon custom-class="icon-arrow" name="fill-arrow-down"></wd-icon>
					</view>
				</wd-popover>
			</template>
		</Navbar>
		<SearchInput @confirm="search" @change="inputChange">
		</SearchInput>
		<view class="title" v-if="total==0">
			<text>搜索历史</text>
			<wd-icon name="clear" @click="clear()" size="20px" color="#999" />
		</view>
		<view class="history" v-if="total==0">
			<view @click="clickrecord(item)" class="item" v-for="item in history" :key="item">
				{{item}}
			</view>
			<view class="more" @click="lookmore()" v-if="moreShow">
				<wd-icon size="18px" name="chevron-down" color="#000" />
			</view>
		</view>
		<view style="margin-top: 40px;" v-if="noResult">
			<wd-status-tip :image-size="{
			        height: 80,
			        width: 80
			}" image="http://jp.x2.ink/images/blank.png" tip="没有搜到结果哦" />
		</view>
		<WordList v-if="List.length>0" :type="`${current=='日中词典'?'jc':'cj'}`" :list="List">
		</WordList>
		<wd-loadmore v-if="List.length>0&&total>List.length" custom-class="loadmore" :state="loadmore" />
		<wd-backtop :scrollTop="scrollTop"></wd-backtop>
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		watch,
		computed
	} from 'vue'
	import WordList from "@/components/wordlist/wordlist.vue"
	import Navbar from '@/components/navbar/navbar.vue';
	import $http from "@/api/index.js"
	import SearchInput from '@/components/searchinput/searchinput.vue'
	import {
		searchrecordStore
	} from "@/stores/index.js"
	import {
		onReachBottom,
		onPageScroll,
	} from "@dcloudio/uni-app"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	const scrollTop = ref(0)
	onPageScroll((e) => {
		scrollTop.value = e.scrollTop
	})
	const inputChange = (e) => {
		val.value = e
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
	const current = ref('日中词典')
	const menu = ref([{
			content: '日中词典'
		},
		{
			content: '中日词典'
		}
	])
	const changeSearchType = (e) => {
		current.value = e.item.content
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
	watch(current, (newVal, oldVal) => {
		noResult.value = false
		List.value = []
		page.value = 1
		if (val.value.length > 0) {
			toast.loading('正在查询中...')
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
		toast.loading('正在查询中...')
		noResult.value = false
		List.value = []
		page.value = 1
		getList()
	}
	const getList = async () => {
		let res;
		if (current.value == '日中词典') {
			res = await $http.word.jcSearch(page.value, size.value, val.value)
		} else {
			res = await $http.word.cjSearch(page.value, size.value, val.value)
		}
		toast.close()
		total.value = res.total
		if (total.value === 0) {
			noResult.value = true
			return
		}
		List.value = List.value.concat(res.data)

	}
</script>

<style scoped lang="scss">
	:deep(.body) {
		margin-top: 5px;
	}

	:deep(.search) {
		flex: 1;
		background-color: #fff;
		padding: 7px 10px;
		box-sizing: border-box;
		border-radius: 38px;
		margin: 0 10px;
	}

	:deep(.loadmore) {
		background-color: #f4f4f4;
		margin: 0;

		>view {
			margin: 0;
		}
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

	.search-type {
		margin-left: 10px;
	}

	.title {
		padding: 15px;
		display: flex;
		font-size: 14px;
		align-items: center;
		justify-content: space-between;
	}

	.history {
		padding: 0 10px;
		display: flex;
		flex-wrap: wrap;
		gap: 10px;

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
</style>