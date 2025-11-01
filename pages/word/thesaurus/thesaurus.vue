<template>
	<scroll-view scroll-y="true" style="height: 100vh;">
		<view class="head">
			<NavbarDefault border :title="title"></NavbarDefault>
		</view>
		<!-- 分类标签 -->
		<div class="tabs-container">
			<TabSlider @changeTab="changeTab" :current="current" :tabList="tabList"></TabSlider>
		</div>
		<view class="list">
			<wd-swipe-action custom-class="book-swipe-action" :key="item.id"
				v-for="item in bookList.get(tabList[current])">
				<view class="item" @click="goDetail(item)">
					<image class="book-cover" :src="item.icon"></image>
					<div class="info">
						<div class="title">{{item.name}}</div>
						<div class="describe">{{item.describe}}</div>
						<div class="learnnum">{{item.word_num}}单词 · {{item.learn_num}}人正在学习</div>
					</div>
					<button v-if="self" @click.stop="changeWord(item)"
						:class="{activebook:containBooks.includes(item.id),inactivebook:!containBooks.includes(item.id)}"
						class="switch-btn _GCENTER">{{containBooks.includes(item.id)?'移除词库':'加入词库'}}</button>
					<button v-else @click.stop="updateConfig(item)"
						:class="{activebook:item.current,inactivebook:!item.current}" class="switch-btn _GCENTER"><text
							v-if="item.current"
							class="fas fa-check-circle"></text>{{item.current?'学习中':'立即切换'}}</button>
				</view>
				<template #right>
					<view class="actions">
						<view class="_GCENTER" style="background: #FFB300;" @click="openPopup('update',item)">修改</view>
						<view class="_GCENTER" style="background: #E2231A;" @click="delComfirm(item.id)">删除
						</view>
					</view>
				</template>
			</wd-swipe-action>
		</view>
		<wd-toast />
		<!-- 创建按钮 -->
		<button v-if="self" @click="openPopup('create')" class="create-btn">
			<i class="fas fa-plus"></i>
		</button>
		<wd-popup position="bottom" v-model="createdShow" custom-style="border-radius:32rpx;"
			@close="createdShow=false">
			<div class="popup-container">
				<div class="popup-header">
					<div class="popup-title">{{pattern=='create'?'创建':'编辑'}}生词本</div>
					<view class="close-btn" @click="createdShow=false">
						<text class="fas fa-times"></text>
					</view>
				</div>
				<div class="form-group">
					<label class="form-label">生词本名称</label>
					<input v-model="formData.name" type="text" class="form-input" placeholder="例如：N5核心词汇">
				</div>
				<div class="form-group">
					<label class="form-label">生词本描述</label>
					<textarea v-model="formData.describe" class="form-textarea"
						placeholder="简单描述这个生词本的用途和内容"></textarea>
				</div>
				<button @click="submit()" class="submit-btn">{{pattern=='create'?'创建':'更新'}}生词本</button>
			</div>
		</wd-popup>
	</scroll-view>
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
	const delComfirm = (id) => {
		uni.showModal({
			title: '温馨提示',
			content: '单词本删除之后，所属单词也会全部被删除！',
			success: async function(res) {
				if (res.confirm) {
					await $http.word.deleteBook({
						id
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
		border-top-left-radius: 16px;
		border-top-right-radius: 16px;
		padding: 24px 16px calc(env(safe-area-inset-bottom) + 24px) 16px;
	}

	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	.popup-title {
		font-size: 18px;
		font-weight: 500;
	}

	.close-btn {
		color: #757575;
		font-size: 20px;
	}

	.form-group {
		margin-bottom: 16px;
	}

	.form-label {
		display: block;
		font-size: 14px;
		margin-bottom: 8px;
		color: #616161;
	}

	.form-input {
		padding: 12px;
		border: 1px solid #E0E0E0;
		border-radius: 8px;
		font-size: 15px;
	}

	.form-textarea {
		width: auto;
		padding: 12px;
		border: 1px solid #E0E0E0;
		border-radius: 8px;
		font-size: 15px;
		min-height: 80px;
		resize: none;
	}

	.submit-btn {
		width: 100%;
		padding: 14px;
		background-color: #07C160;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 16px;
		font-weight: 500;
		margin-top: 8px;
	}




	.create-btn {
		position: fixed;
		bottom: 64px;
		right: 32px;
		width: 56px;
		height: 56px;
		border-radius: 28px;
		background-color: #07C160;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		z-index: 10;
	}

	.search-tab {
		display: inline-block;
		width: auto;
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

	:deep(.book-swipe-action) {
		background-color: white;
		border-radius: 8px;
	}

	.list {
		display: flex;
		flex-direction: column;
		padding: 16px;
		gap: 16px;
		padding-bottom: calc(env(safe-area-inset-bottom) + 16px);

		.item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 12px;

			.book-cover {
				width: 60px;
				height: 80px;
				border-radius: 8px;
				color: white;
				font-weight: bold;
			}

			.switch-btn {
				padding: 0 12px;
				margin: 0;
				height: 30px;
				border-radius: 30px;
				font-size: 12px;
				font-weight: 500;
				line-height: 12px;
			}

			.inactivebook {
				background: #07C160;
				color: white;
			}

			.activebook {
				background: #FAFAFA;
				color: #07C160;
				gap: 4px;
			}

			.info {
				margin-left: 12px;
				flex: 1;

				.title {
					font-size: 16px;
					font-weight: bold;
				}

				.describe {
					color: #6b7280;
					font-size: 14px;
					margin: 4px 0;
				}

				.learnnum {
					color: #6b7280;
					font-size: 12px;
				}
			}
		}

	}

	.head {
		position: sticky;
		top: 0;
		z-index: 9;
	}

	.tabs-container {
		background-color: white;
		padding: 8px 0 16px 0;
	}

	.tab-item {
		font-size: 14px;
		white-space: nowrap;
	}

	.tabactive {
		color: #07C160;
	}
</style>