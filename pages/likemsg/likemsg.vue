<template>
	<view>
		<NavBar title="点赞" style="background-color: #f3f3f5;"></NavBar>
		<!-- 点赞 -->
		<view class="commentlist">
			<view class="commentitem" :key="item.id" v-for="item in List">
				<view class="left">
					<uv-avatar size="40" :src="item.from_user.avatar"></uv-avatar>
				</view>
				<view class="right">
					<view class="nickname">{{item.from_user.nickname}}</view>
					<view class="magtype">
						<text>点赞了你的{{item.target=='comment'?'评论':'动态'}}</text>
						<text>{{dayjs().to(dayjs(item.created_at))}}</text>
					</view>
					<view class="tocontent">
						<view class="hr"></view>
						<wd-text :text="item.content" color="#999" size="12px" :lines="1"></wd-text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import dayjs from 'dayjs'
	import relativeTime from 'dayjs/plugin/relativeTime'
	import 'dayjs/locale/zh'
	dayjs.locale('zh')
	dayjs.extend(relativeTime)
	import NavBar from '@/components/navbar.vue'
	import $http from "@/api/index.js"
	import {
		onPageScroll,
		onReachBottom
	} from "@dcloudio/uni-app"
	const page = ref(1)
	const size = ref(10)
	const total = ref(0)
	const List = ref([])
	const getList = async () => {
		const res = await $http.common.getLikeRecordList(page.value, size.value)
		total.value = res.total
		List.value = List.value.concat(res.data)
	}
	onMounted(() => {
		getList()
	})
	onReachBottom(() => {
		if (total.value > List.value.length) {
			++page.value
			getList()
		}
	})
</script>

<style scoped lang="scss">
	.commentlist {
		padding: 0 10px 10px 10px;
		display: flex;
		flex-direction: column;
		gap: 15px;

		.commentitem {
			padding: 15px;
			background-color: white;
			border-radius: 8px;
			display: flex;
			gap: 10px;

			.right {
				.nickname {
					font-size: 14px;
				}

				.magtype {
					font-size: 12px;
					margin: 5px 0;
					display: flex;
					gap: 5px;
					color: #999;
				}

				.btns {
					padding-top: 5px;
					display: flex;
					gap: 10px;
					align-items: center;

					>view {
						border-radius: 20px;
						background-color: #F4F4F4;
						padding: 5px 10px;
						gap: 3px;

						text {
							font-size: 12px;
						}
					}
				}

				.tocontent {
					display: flex;
					gap: 5px;
					align-items: center;
					margin: 5px;

					text {
						font-size: 12px;
						color: #999;
					}

					.hr {
						width: 4px;
						height: 16px;
						border-radius: 4px;
						background-color: #E6E6E6;
					}
				}

				.content {
					font-size: 14px;
				}
			}
		}
	}
</style>