<template>
	<view>
		<Navbar title="词库列表">
		</Navbar>
		<wd-tabs slidable="always" v-model="current">
			<block v-for="[key, value] in bookList.entries()" :key="key">
				<wd-tab :title="key">
					<view class="rankinglist">
						<view class="rankingitem"
							@click="goPage('/pages/word/wordlist/wordlist',{id:item.id,name:item.name})"
							v-for="item in value" :key="item.id">
							<wd-button @click.stop="updateConfig(item.id)" v-if="config.book_id!=item.id"
								custom-class="changebtn" size="small">切换词书</wd-button>
							<image mode="aspectFill" :src="item.icon">
							</image>
							<view>
								<view>
									<wd-text color="#000000" :lines="1" size="17px" :text="item.name"></wd-text>
									<wd-text :lines="3" size="14px" style="margin-top: 6px;"
										:text="item.describe"></wd-text>
								</view>
								<view class="number">{{item.words}}词<text v-if="config.book_id==item.id">正在学习</text>
								</view>
							</view>
						</view>
					</view>
				</wd-tab>
			</block>
		</wd-tabs>
	</view>
	<wd-toast />
	<wd-backtop :scrollTop="scrollTop"></wd-backtop>
</template>

<script setup>
	import {
		ref,
		watch,
		onMounted,
		computed
	} from 'vue'
	import {
		onPageScroll
	} from "@dcloudio/uni-app"
	const scrollTop = ref(0)
	onPageScroll((e) => {
		scrollTop.value = e.scrollTop
	})
	import Navbar from '@/components/navbar/navbar.vue';
	const current = ref(0)
	import $http from "@/api/index.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	const bookList = ref(new Map())
	import {
		goPage
	} from "@/utils/common.js"
	const config = ref({
		id: null,
		user_id: null,
		daily_learning: null,
		mode: "",
		book_id: null
	})
	const updateConfig = async (id) => {
		config.value.book_id = id
		const res = await $http.user.updateConfig(config.value)
		toast.success(`更新成功`)
	}
	const getConfig = async () => {
		const res = await $http.user.getConfig()
		config.value = res.data
	}
	const getWordBook = async () => {
		const res = await $http.word.getWordBook()
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
	onMounted(() => {
		getWordBook()
		getConfig()
	})
</script>

<style lang="scss" scoped>
	:deep(.changebtn) {
		position: absolute !important;
		right: 10px !important;
		top: 50% !important;
		transform: translateY(-50%) !important;
	}

	:deep(.wd-tabs__nav) {
		height: 30px;
		background-color: transparent !important;
	}

	:deep(.wd-tabs__nav-item) {
		height: 30px;
	}

	:deep(.wd-tabs__line) {
		bottom: 0;
	}

	:deep(.wd-tabs) {
		background-color: transparent !important;
	}

	.number {
		color: $uni-text-color-grey;
		font-size: $uni-font-size-base;
		font-weight: bold;

		text {
			margin-left: 10px;
			color: $uni-color-warning;
		}
	}

	.rankinglist {
		padding-bottom: calc(env(safe-area-inset-bottom) + 15px);
		margin: 15px;
		display: flex;
		flex-direction: column;
		gap: 15px;

		.rankingitem {
			padding: 10px;
			border-radius: 8px;
			display: flex;
			position: relative;
			background-color: white;


			>view {

				&:last-child {
					margin-left: 10px;
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.tags {
						display: flex;
						align-items: center;
						justify-content: space-between;
					}
				}
			}

			image {
				width: 60px;
				height: 80px;
				border-radius: 5px;
			}
		}
	}
</style>