<template>
	<view>
		<view class="head">
			<NavbarDefault border title="选择单词书"></NavbarDefault>
		</view>
		<!-- 分类标签 -->
		<div class="tabs-container">
			<TabSlider @changeTab="changeTab" :current="current" :tabList="tabList"></TabSlider>
		</div>
		<view class="list">
			<div @click="goPage('/pages/word/mybookswordlist/mybookswordlist',{id:item.id})" class="item" :key="item.id"
				v-for="item in bookList.get(tabList[current])">
				<view v-if="item.icon.type=='image'" class="book-cover _BACKGROUND"
					:style="{backgroundImage:`url('${item.icon.data}')`}">
				</view>
				<view v-else class="book-cover _GCENTER" :style="{background:item.icon.bg}">
					<text v-if="item.icon.type=='text'">{{item.icon.data}}</text>
					<text v-else style="font-size: 22px;" class="fas" :class="item.icon.data"></text>
				</view>
				<div class="info">
					<div class="title">{{item.name}}</div>
					<div class="describe">{{item.describe}}</div>
					<div class="learnnum">{{item.word_num}}单词 · {{item.learn_num}}人正在学习</div>
				</div>
				<button @click.stop="updateConfig(item)" :class="{activebook:item.current,inactivebook:!item.current}"
					class="switch-btn _GCENTER"><text v-if="item.current"
						class="fas fa-check-circle"></text>{{item.current?'学习中':'立即切换'}}</button>
			</div>
		</view>
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'
	import {
		onShow
	} from "@dcloudio/uni-app"
	import {
		goPage,
	} from "@/utils/common.js"
	import {
		userStore
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
		getWordBook()
	}
	const getWordBook = async () => {
		const res = await $http.word.getWordBookList()
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
	onShow(() => {
		if (!userStore().loginStatus) {
			goPage("/pages/login/login?toast=请登录之后使用")
		} else {
			getWordBook()
			getConfig()
		}
	})
</script>

<style lang="scss" scoped>
	.language-tabs {
		white-space: nowrap;
		width: 100%;
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
			background-color: white;
			padding: 12px;
			border-radius: 8px;

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