<template>
	<view class="page-container">
		<view class="header-section">
			<NavbarDefault border title="单词列表"></NavbarDefault>
			<view class="search-bg">
				<view class="search-bar">
					<text class="fas fa-search"></text>
					<input v-model="searchVal" confirm-type="search" @confirm="confirm" type="text" placeholder="搜索单词">
					<view @click="allSelect=!allSelect">
						<text class="fas fa-sliders-h"></text>
					</view>
				</view>
			</view>
			<view class="tabs-container">
				<view class="tab-item" @click="currentTab=index" :class="{tabActive:currentTab==index}"
					v-for="(item,index) in tabs" :key="item.value">{{item.name}}</view>
			</view>
			<view class="batch-selector" v-if="allSelect">
				<view class="flex items-center">
					<view @click="allSelectWord()" class="checkbox-custom" :class="{checkboxactive:isAllSelect}">
						<view class="fas fa-check text-xs" v-if="isAllSelect"></view>
					</view>
					<text class="text-sm text-gray-600">全选</text>
				</view>
				<view class="text-sm text-gray-500">已选 <text class="text-green-500">{{selectCount}}</text> 个</view>
			</view>
		</view>

		<scroll-view class="scroll-content" scroll-y="true" @scrolltolower="loadMore" :scroll-with-animation="true">
			<view class="word-wrap">
				<wd-swipe-action v-for="(item,index) in List" :key="item.id">
					<view class="word-item" @click="goPage('/pages/word/worddetail/worddetail',{id:item.id})">
						<view @click.stop="selectWord(index)" :class="{checkboxactive:item.select}"
							class="checkbox-custom" v-if="allSelect">
							<view class="fas fa-check text-xs" v-if="item.select"></view>
						</view>
						<view class="word-content">
							<view class="word-header">
								<view>
									<text class="word-kanji">{{item.displayWord}}</text>
								</view>
							</view>
							<view class="word-meaning">
								<text class="meaning-text">{{item.description}}</text>
							</view>
						</view>
					</view>
					<template #right>
						<view class="actions">
							<view v-if="currentTab==2||currentTab==3" class="_GCENTER" style="background: #FFB300;"
								@click="actionClick('redo',item)">重学
							</view>
							<view v-if="currentTab==1||currentTab==3" class="_GCENTER" style="background: #07C160;"
								@click="actionClick('mark',item)">标熟
							</view>
							<view v-if="userId==userStore().userInfo.id" class="_GCENTER" style="background: #f5222d;"
								@click="actionClick('del',item)">移除</view>
						</view>
					</template>
				</wd-swipe-action>
				<view v-if="total==0&&loading==false" style="margin-top: 80rpx;">
					<wd-status-tip image="https://jpx2ink.oss-cn-shanghai.aliyuncs.com/images/image/empty.png"
						tip="单词本还没有单词~" />
					<view class="search-action">
						<button @click="onSearch()">
							<text class="fas fa-search search-icon"></text>
							词典查询
						</button>
					</view>
				</view>
			</view>
		</scroll-view>

		<view class="batch-actions _GCENTER" v-if="selectCount>0">
			<view @click="setDone('mark')" v-if="currentTab==1||currentTab==3" class="text-green-500">
				<text class="fas fa-check-circle"></text>标记已掌握
			</view>
			<view @click="setDone('redo')" v-if="currentTab==2||currentTab==3" class="text-green-500">
				<text class="fas fa-redo"></text>重新学习
			</view>
			<view v-if="userId==userStore().userInfo.id" @click="delWords()" class="text-red-500">
				<text class="fas fa-trash-alt"></text>移除单词本
			</view>
		</view>

		<wd-toast />
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		watch

	} from 'vue'
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		goPage,
		formatWordName
	} from "@/utils/common.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	import {
		userStore
	} from "@/stores/index.js"
	import NavbarDefault from "@/components/navbar/default"
	import $http from "@/api/index.js"

	const currentTab = ref(0)
	const actionClick = async (type, item) => {
		if (type == "redo" || type == "mark") {
			try {
				await $http.word.setDone({
					word_ids: [item.id],
					type
				})
				toast.success("操作成功")
				List.value = []
				page.value = 1
				getList()
			} catch (err) {
				toast.error("操作失败")
			}
		} else {
			uni.showModal({
				title: '温馨提示',
				content: `确定要将单词“${item.words.join(",")}”移除单词本？`,
				success: async function(res) {
					if (res.confirm) {
						const res = await $http.word.removeBookWords({
							book_id: Number(id.value),
							ids: [item.id]
						})
						toast.success('移除成功')
						List.value = []
						page.value = 1
						getList()
					}
				}
			});
		}
	}
	const searchVal = ref("")
	const onSearch = () => {
		goPage("/pages/word/search/search", {
			search: searchVal.value
		})
	}
	const setDone = async (type) => {
		try {
			await $http.word.setDone({
				word_ids: List.value.filter(item => item.select).map(item => item.id),
				type
			})
			toast.success("操作成功")
			List.value = []
			page.value = 1
			getList()
		} catch (err) {
			toast.error("操作失败")
		}
	}
	const isAllSelect = computed(() => {
		return List.value.length > 0 && selectCount.value === List.value.length
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
	const loading = ref(true)
	const delWords = async () => {
		uni.showModal({
			title: '温馨提示',
			content: '确定要将所选单词移除单词本？',
			success: async function(res) {
				if (res.confirm) {
					const res = await $http.word.removeBookWords({
						book_id: Number(id.value),
						ids: List.value.filter(item => item.select).map(item => item.id)
					})
					toast.success('移除成功')
					List.value = []
					page.value = 1
					getList()
				}
			}
		});
	}

	const allSelectWord = () => {
		if (isAllSelect.value) {
			List.value.forEach(item => item.select = false)
		} else {
			List.value.forEach(item => item.select = true)
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
	watch(allSelect, (newVal, oldVal) => {
		if (newVal == false) {
			List.value.forEach(item => item.select = false)
		}
	})
	const total = ref(null)
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
		loading.value = true
		const res = await $http.word.getBookWord({
			id: id.value,
			page: page.value,
			page_size: size.value,
			val: value.value,
			tab: currentTab.value
		})
		total.value = res.total
		loading.value = false
		if (total.value === 0) {
			return
		}
		const newData = res.data.map(item => {
			return {
				...item,
				select: false,
				displayWord: `${formatWordName(item.words,item.kana)}${item.tone || ''}`
			}
		})
		List.value = List.value.concat(newData)
	}
	const id = ref(null)

	const loadMore = () => {
		if (total.value > List.value.length) {
			++page.value
			getList()
		}
	}
	const userId = ref(null)
	onLoad((e) => {
		if (e.id) {
			id.value = e.id
		}
		if (e.userId) {
			userId.value = e.userId
		}
		getList()
	})
</script>

<style lang="scss" scoped>
	.page-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: white;
		overflow: hidden;
	}

	.header-section {
		background-color: white;
		z-index: 10;
		flex-shrink: 0;
	}

	.scroll-content {
		flex: 1;
		height: 0;
		overflow: hidden;
	}

	.actions {
		height: 100%;
		display: flex;

		>view {
			color: white;
			padding: 20rpx;
		}
	}

	.word-wrap {
		border-top: 2rpx solid #eee;
	}

	.word-item {
		display: flex;
		align-items: center;
		background: white;
		padding: 24rpx 32rpx;
		border-bottom: 2rpx solid #eee;
	}

	.word-content {
		flex: 1;
		overflow: hidden;
	}

	.word-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16rpx;
	}

	.word-kanji {
		font-size: 36rpx;
		font-weight: 600;
		color: #212121;
	}

	.meaning-text {
		color: #424242;
		font-size: 28rpx;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.batch-actions {
		position: fixed;
		bottom: calc(env(safe-area-inset-bottom) + 40rpx);
		left: 50%;
		transform: translateX(-50%);
		background: white;
		border-radius: 48rpx;
		padding: 16rpx 32rpx;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.05);
		z-index: 20;
		gap: 32rpx;
		display: flex;

		>view {
			white-space: nowrap;
			display: flex;
			align-items: center;
			gap: 8rpx;
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
		font-size: 28rpx;
	}

	.items-center {
		align-items: center;
	}

	.batch-selector {
		padding: 0 32rpx 32rpx;
		background-color: white;
		border-bottom-width: 2rpx;
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
		width: 40rpx;
		height: 40rpx;
		border: 2rpx solid #E0E0E0;
		border-radius: 8rpx;
		margin-right: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}


	.search-bar {
		background-color: #FAFAFA;
		border-radius: 16rpx;
		padding: 16rpx 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16rpx;

		input {
			flex: 1;
		}

		text {
			font-size: 36rpx;
			color: #9DA3AF;
		}
	}

	.search-bg {
		padding: 24rpx 32rpx;
	}

	.tabs-container {
		padding: 12rpx 32rpx 32rpx;
		display: flex;
		gap: 24rpx;
	}

	.tab-item {
		font-size: 28rpx;
		white-space: nowrap;
	}

	.tabActive {
		color: #07C160;
	}
</style>