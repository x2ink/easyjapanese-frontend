<template>
	<view>
		<Navbar title="日常会话">
		</Navbar>
		<WordList v-if="List.length>0" type="jc" :list="List">
		</WordList>
		<view class="examples">
			<view class="example" v-for="item in List" :key="item.id">
				<view>
					<view class="ja jpfont">
						<view class="worditem" v-for="item1 in item.read">
							<view class="top">{{item1.top}}</view>
							<view :class="{underline:item1.top}" class="body">{{item1.body}}</view>
						</view>
					</view>
					<view class="ch">
						<wd-tag custom-class="space" type="warning">译</wd-tag>{{item.ch}}
					</view>
				</view>
			<!-- 	<view class="operate">
					<wd-icon name="sound" size="20" color="#909699" />
				</view> -->
			</view>
		</view>
		<wd-loadmore v-if="List.length>0&&total>List.length" custom-class="loadmore" :state="loadmore" />
		<wd-backtop :scrollTop="scrollTop"></wd-backtop>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'
	import {
		onLoad,
		onPageScroll,
		onReachBottom
	} from "@dcloudio/uni-app"
	import Navbar from '@/components/navbar/navbar.vue';
	const scrollTop = ref(0)
	onPageScroll((e) => {
		scrollTop.value = e.scrollTop
	})
	import $http from "@/api/index.js"
	const page = ref(1)
	const size = ref(20)
	const total = ref(0)
	const List = ref([])
	const getList = async () => {
		const res = await $http.common.getDailyTalk(page.value, size.value)
		total.value = res.total
		List.value = List.value.concat(res.data)
	}
	const loadmore = computed(() => {
		if (total.value == List.value.length) {
			return "finished"
		} else {
			return "loading"
		}
	})
	onReachBottom(() => {
		if (total.value > List.value.length) {
			++page.value
			getList()
		}
	})
	const bookid = ref(null)
	onLoad((e) => {
		getList()
	})
</script>

<style scoped lang="scss">
	:deep(.loadmore) {
		background-color: #f4f4f4;
		margin: 0;

		>view {
			margin: 0;
		}
	}

	.examples {
		display: flex;
		margin: 0 15px;
		flex-direction: column;
		gap: 15px;

		.example {
			background-color: white;
			border-radius: 8px;
			padding: 15px;

			.operate {
				display: flex;
				justify-content: flex-end;
			}

			.ch {
				display: flex;
				align-items: center;
				gap: 3px;
				margin-top: 10px;
				padding:10px;
				font-size: $uni-font-size-base;
				color: $uni-text-color-grey;
				background-color: $uni-bg-color-grey;
				border-radius: 4px;
			}

			.ja {
				display: flex;
				flex-wrap: wrap;

				.worditem {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					.top {
						font-size: 8px;
						height: 8px;
						margin: 0 2px;
					}

					.body {
						font-size: $uni-font-size-base;
					}

					.underline {
						text-decoration: underline;
					}
				}
			}
		}
	}
</style>