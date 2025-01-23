<template>
	<view>
		<NavBar title="词库列表" style="background-color: white;">
			<template #right>
				<wd-icon name="help-circle" size="25px"></wd-icon>
			</template>
		</NavBar>
		<wd-tabs v-model="current">
			<block v-for="[key, value] in bookList.entries()" :key="key">
				<wd-tab :title="key">
					<view class="rankinglist">
						<view class="rankingitem" @click="goPages(item.id,item.name)" v-for="item in value"
							:key="item.id">
							<wd-button @click.stop="updateConfig(item.id)" v-if="config.book_id!=item.id"
								custom-class="btn" size="small">切换词书</wd-button>
							<image mode="aspectFill" :src="item.icon">
							</image>
							<view>
								<view>
									<wd-text color="#000000" :lines="1" size="17px" :text="item.name"></wd-text>
									<wd-text :lines="3" size="14px" style="margin-top: 6px;"
										:text="item.describe"></wd-text>
								</view>
								<p class="number">{{item.words}}词<span v-if="config.book_id==item.id">正在学习</span></p>
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
	import NavBar from '@/components/navbar.vue'
	const current = ref(0)
	import $http from "@/api/index.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	const bookList = ref(new Map())
	const goPages = (id, name) => {
		uni.navigateTo({
			url: "/pages/wordlist/wordlist?id=" + id + "&name=" + name
		})
	}
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
		console.log(map);
	}
	onMounted(() => {
		getWordBook()
		getConfig()
	})
</script>

<style lang="scss">
	.number {
		color: $uni-text-color-grey;
		font-size: $uni-font-size-base;
		font-weight: bold;

		span {
			margin-left: 10px;
			color: $uni-color-warning;
		}
	}

	.rankinglist {
		margin: 0 16px;
		display: flex;
		flex-direction: column;

		.rankingitem {
			padding: 10px;
			display: flex;
			position: relative;

			.btn {
				position: absolute;
				right: 10px;
				top: 50%;
				transform: translateY(-50%);
			}

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