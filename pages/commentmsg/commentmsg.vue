<template>
	<view>
		<NavBar title="评论" style="background-color: #f3f3f5;"></NavBar>
		<!-- 评论 -->
		<view class="commentlist">
			<view class="commentitem" :key="item.id" v-for="(item,index) in List">
				<view class="left">
					<wd-badge is-dot :hidden="item.status!=0">
						<uv-avatar size="40" :src="item.from_user.avatar"></uv-avatar>
					</wd-badge>
				</view>
				<view class="right">
					<view class="nickname">{{item.from_user.nickname}}</view>
					<view class="magtype">
						<text>回复了你的{{item.comment.parent_id==null?'动态':'评论'}}</text>
						<text>{{dayjs().to(dayjs(item.created_at))}}</text>
					</view>
					<view class="content">
						<wd-text :text="item.comment.content" color="#000" size="14px" :lines="1"></wd-text>
					</view>
					<view class="tocontent">
						<view class="hr"></view>
						<wd-text :text="item.content" color="#999" size="12px" :lines="1"></wd-text>
					</view>
					<view class="btns">
						<view @click="addLike(item.comment.id,index)" class="btn _GCENTER">
							<wd-icon v-if="!item.comment.like" name="heart" size="18px" color="#000"></wd-icon>
							<wd-icon v-else name="heart-filled" color="#EF4651" size="18px"></wd-icon>
							<text>点赞</text>
						</view>
						<view class="btn _GCENTER">
							<wd-icon name="chat1" size="18px" color="#000"></wd-icon>
							<text>回复</text>
						</view>
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
	const addLike = async (id, index) => {
		const res = await $http.comment.like(id)
		if (res.msg == "like") {
			List.value[index].comment.like = true
		} else {
			List.value[index].comment.like = false
		}
	}
	const page = ref(1)
	const size = ref(10)
	const total = ref(0)
	const List = ref([])
	const getList = async () => {
		const res = await $http.common.getMessageList(page.value, size.value)
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