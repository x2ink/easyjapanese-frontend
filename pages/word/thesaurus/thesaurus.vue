<template>
	<view class="page-container">
		<view class="header-section">
			<NavbarDefault border :title="title"></NavbarDefault>
			<view class="tabs-container">
				<TabSlider @changeTab="changeTab" :current="current" :tabList="tabList"></TabSlider>
			</view>
		</view>

		<scroll-view class="scroll-content" scroll-y="true">
			<view class="list">
				<wd-swipe-action custom-class="book-swipe-action" :key="item.id"
					v-for="item in bookList.get(tabList[current])">
					<view class="item" @click="goDetail(item)">
						<image class="book-cover" :src="item.icon"></image>
						<view class="info">
							<view class="title">{{item.name}}</view>
							<view class="describe">{{item.describe}}</view>
							<view class="learnnum">{{item.word_num}}单词 · {{item.learn_num}}人正在学习</view>
						</view>

						<button v-if="self" @click.stop="changeWord(item)"
							:class="{activebook:containBooks.includes(item.id),inactivebook:!containBooks.includes(item.id)}"
							class="switch-btn _GCENTER">{{containBooks.includes(item.id)?'移除词库':'加入词库'}}</button>
						<button v-else @click.stop="updateConfig(item)"
							:class="{activebook:item.current,inactivebook:!item.current}" class="switch-btn _GCENTER">
							<text v-if="item.current" class="fas fa-check-circle"></text>
							{{item.current?'学习中':'立即切换'}}
						</button>
					</view>
					<template #right>
						<view class="actions">
							<view class="_GCENTER" style="background: #FFB300;" @click="openPopup('update',item)">修改
							</view>
							<view class="_GCENTER" style="background: #E2231A;" @click="delComfirm(item)">删除</view>
						</view>
					</template>
				</wd-swipe-action>
			</view>
		</scroll-view>

		<wd-toast />

		<button v-if="self" @click="openPopup('create')" class="create-btn">
			<text class="fas fa-plus"></text>
		</button>

		<wd-popup position="bottom" v-model="createdShow" custom-style="border-radius:32rpx;"
			@close="createdShow=false">
			<view class="popup-container">
				<view class="popup-header">
					<view class="popup-title">{{pattern=='create'?'创建':'编辑'}}生词本</view>
					<view class="close-btn" @click="createdShow=false">
						<text class="fas fa-times"></text>
					</view>
				</view>
				<view class="form-group">
					<label class="form-label">生词本名称</label>
					<input v-model="formData.name" type="text" class="form-input" placeholder="例如：N5核心词汇">
				</view>
				<view class="form-group">
					<label class="form-label">生词本描述</label>
					<textarea v-model="formData.describe" class="form-textarea"
						placeholder="简单描述这个生词本的用途和内容"></textarea>
				</view>
				<button @click="submit()" class="submit-btn">{{pattern=='create'?'创建':'更新'}}生词本</button>
			</view>
		</wd-popup>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'
	import {
		onShow,
		onLoad
	} from "@dcloudio/uni-app"
	import {
		goPage,
	} from "@/utils/common.js"
	import {
		userStore,
		localwordsStore
	} from "@/stores/index.js"
	import NavbarDefault from "@/components/navbar/default"
	import TabSlider from "@/components/slider/slider.vue"
	import $http from "@/api/index.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	const bookList = ref(new Map())
	const current = ref(0)
	const config = ref({
		book_id: null
	})
	const tabList = computed(() => {
		return [...bookList.value.keys()]
	})
	const changeTab = (e) => {
		current.value = e
	}
	const delComfirm = (item) => {
		// 权限判断：如果不是当前用户的书，提示无权限
		if (item.user_id != userStore().userInfo.id) {
			toast.warning("您没有权限删除此单词本")
			return
		}

		uni.showModal({
			title: '温馨提示',
			content: '单词本删除之后，所属单词也会全部被删除！',
			success: async function(res) {
				if (res.confirm) {
					await $http.word.deleteBook({
						id: item.id
					})
					toast.success("删除成功")
					getWordBook()
				}
			}
		});
	}
	const goDetail = (item) => {
		if (!self.value) {
			goPage('/pages/word/wordlist/wordlist', {
				id: item.id
			})
		}
	}
	const createdShow = ref(false)
	const pattern = ref('create')
	const formData = ref({
		id: null,
		icon: "https://jpx2ink.oss-cn-shanghai.aliyuncs.com/images/cover/zizhi.png",
		name: "",
		describe: ""
	})
	const openPopup = (type, data) => {
		// 权限判断：如果是修改操作，且不是当前用户的书，提示无权限
		if (type == "update") {
			if (data.user_id != userStore().userInfo.id) {
				toast.warning("您没有权限修改此单词本")
				return
			}
		}

		createdShow.value = true
		pattern.value = type
		if (type == "update") {
			formData.value.id = data.id
			formData.value.name = data.name
			formData.value.describe = data.describe
		}
	}
	const submit = async () => {
		if (formData.value.name.trim().length === 0) {
			toast.warning("单词本名词为空")
			return
		}
		if (formData.value.describe.trim().length === 0) {
			toast.warning("单词本介绍为空")
			return
		}
		if (pattern.value == 'create') {
			try {
				const res = await $http.word.addBook(formData.value)
				toast.success("创建成功")
			} catch (err) {
				if (err.code == 4001) {
					toast.warning("单词本名词重复")
					return
				} else if (err.code == 4002) {
					toast.warning("最多创建5个单词本")
					return
				}
			}
		} else {
			try {
				const res = await $http.word.setBook(formData.value)
				toast.success("更新成功")
			} catch (err) {
				if (err.code == 4001) {
					toast.warning("单词本名词重复")
					return
				}
			}
		}
		createdShow.value = false
		formData.value = {
			id: null,
			icon: "",
			name: "",
			describe: ""
		}
		getWordBook()
	}
	const getConfig = async () => {
		const res = await $http.user.getConfig()
		config.value = res.data
	}
	const updateConfig = async (item) => {
		if (item.current) {
			return
		}
		config.value.book_id = item.id
		const res = await $http.user.updateConfig(config.value)
		toast.success(`更新成功`)
		localwordsStore().clearLearnCache()
		getWordBook()
	}
	const changeWord = async (item) => {
		if (containBooks.value.includes(item.id)) {
			const res = await $http.word.removeBookWords({
				ids: [wordId.value],
				book_id: item.id
			})
		} else {
			const res = await $http.word.addBookWord({
				word_id: wordId.value,
				book_id: item.id
			})
		}
		getContainBook(wordId.value)
		getWordBook()
	}
	const getWordBook = async () => {
		const res = await $http.word.getWordBookList()
		if (self.value) {
			res.data = res.data.filter(item => item.user_id == userStore().userInfo.id)
		}
		const map = res.data.reduce((acc, book) => {
			if (!acc.has("全部")) {
				acc.set("全部", []);
			}
			acc.get("全部").push(book);
			if (!acc.has(book.category)) {
				acc.set(book.category, []);
			}
			acc.get(book.category).push(book);
			return acc;
		}, new Map());
		bookList.value = map
	}
	const title = ref("选择单词书")
	const self = ref(false)
	const containBooks = ref([])
	const getContainBook = async (wordId) => {
		try {
			const res = await $http.word.getContainBook({
				wordId: wordId
			})
			containBooks.value = res.data
		} catch (error) {
			//TODO handle the exception
		}
	}
	const wordId = ref(null)
	onLoad((e) => {
		if (e.title) {
			title.value = e.title
		}
		if (e.self) {
			self.value = e.self == "true"
			wordId.value = Number(e.wordId)
			getContainBook(e.wordId)
		}
	})
	onShow(() => {
		getWordBook()
		getConfig()
	})
</script>

<style lang="scss" scoped>
	// 1. 页面容器：Flex 列布局，高度占满屏幕
	.page-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #f8f8f8; // 给个背景色，防止滚动穿透时看到底部
		overflow: hidden;
	}

	// 2. 头部区域：背景白色，防止被压缩
	.header-section {
		background-color: white;
		z-index: 10;
		flex-shrink: 0;
		// 之前是 .head position: sticky，现在由 flex 布局自动固定在顶部，无需 sticky
	}

	// 3. 滚动区域：自动占据剩余空间
	.scroll-content {
		flex: 1;
		height: 0; // 配合 flex: 1
		overflow: hidden;
	}

	.tabs-container {
		background-color: white;
		padding: 16rpx 0 32rpx 0;
	}

	.language-tabs {
		white-space: nowrap;
		width: 100%;
	}

	.actions {
		height: 100%;
		display: flex;

		>view {
			color: white;
			padding: 20rpx;
		}
	}

	.popup-container {
		background-color: white;
		border-top-left-radius: 32rpx;
		border-top-right-radius: 32rpx;
		padding: 48rpx 32rpx calc(env(safe-area-inset-bottom) + 48rpx) 32rpx;
	}

	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 40rpx;
	}

	.popup-title {
		font-size: 36rpx;
		font-weight: 500;
	}

	.close-btn {
		color: #757575;
		font-size: 40rpx;
	}

	.form-group {
		margin-bottom: 32rpx;
	}

	.form-label {
		display: block;
		font-size: 28rpx;
		margin-bottom: 16rpx;
		color: #616161;
	}

	.form-input {
		padding: 24rpx;
		border: 2rpx solid #E0E0E0;
		border-radius: 16rpx;
		font-size: 30rpx;
	}

	.form-textarea {
		width: auto;
		padding: 24rpx;
		border: 2rpx solid #E0E0E0;
		border-radius: 16rpx;
		font-size: 30rpx;
		min-height: 160rpx;
		resize: none;
	}

	.submit-btn {
		width: 100%;
		padding: 28rpx;
		background-color: #07C160;
		color: white;
		border: none;
		border-radius: 16rpx;
		font-size: 32rpx;
		font-weight: 500;
		margin-top: 16rpx;
	}

	.create-btn {
		position: fixed;
		bottom: calc(env(safe-area-inset-bottom) + 128rpx); // 增加底部安全区适配
		right: 64rpx;
		width: 112rpx;
		height: 112rpx;
		border-radius: 56rpx;
		background-color: #07C160;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 48rpx;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
		z-index: 10;
	}

	.search-tab {
		display: inline-block;
		width: auto;
		padding: 12rpx 24rpx;
		border-radius: 32rpx;
		font-size: 28rpx;
		margin-right: 16rpx;
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

	:deep(.book-swipe-action) {
		background-color: white;
		border-radius: 16rpx;
	}

	.list {
		display: flex;
		flex-direction: column;
		padding: 32rpx;
		gap: 32rpx;
		padding-bottom: calc(env(safe-area-inset-bottom) + 32rpx);

		.item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 24rpx;

			.book-cover {
				width: 120rpx;
				height: 160rpx;
				border-radius: 16rpx;
				color: white;
				font-weight: bold;
			}

			.switch-btn {
				padding: 0 24rpx;
				margin: 0;
				height: 60rpx;
				border-radius: 60rpx;
				font-size: 24rpx;
				font-weight: 500;
				line-height: 24rpx;
			}

			.inactivebook {
				background: #07C160;
				color: white;
			}

			.activebook {
				background: #FAFAFA;
				color: #07C160;
				gap: 8rpx;
			}

			.info {
				margin-left: 24rpx;
				flex: 1;

				.title {
					font-size: 32rpx;
					font-weight: bold;
				}

				.describe {
					color: #6b7280;
					font-size: 28rpx;
					margin: 8rpx 0;
				}

				.learnnum {
					color: #6b7280;
					font-size: 24rpx;
				}
			}
		}

	}

	.tab-item {
		font-size: 28rpx;
		white-space: nowrap;
	}

	.tabactive {
		color: #07C160;
	}
</style>