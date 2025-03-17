<template>
	<view>
		<view :style="{height:navBarHeight}"></view>
		<view style="padding: 15px;">
			<h3>互动</h3>
			<view class="zanandcomment">
				<view class="_GCENTER" @click="goPage('/pages/msg/like/like')">
					<wd-badge :modelValue="msgTotal.like_total">
						<image src="http://jp.x2.ink/images/twemoji--brown-heart.png" mode="aspectFit"></image>
					</wd-badge>
					<text>点赞</text>
				</view>
				<view class="_GCENTER" @click="goPage('/pages/msg/comment/comment')">
					<wd-badge :modelValue="msgTotal.msg_total">
						<image src="http://jp.x2.ink/images/twemoji--speech-balloon.png" mode="aspectFit"></image>
					</wd-badge>
					<text>评论</text>
				</view>
			</view>
			<h3 style="margin-top: 15px;">消息</h3>
			<view class="noticelist">
				<view style="margin-top: 40px;" v-if="noResult">
					<wd-status-tip :image-size="{
				        height: 60,
				        width: 60
				}" image="http://jp.x2.ink/images/envelope.png" tip="还没有收到消息" />
				</view>
				<view class="noticeitem" @click="goPage(item.path)" v-for="(item,index) in List" :key="item.id">
					<view class="noticetime">
						{{dayjs().to(dayjs(item.created_at))}}
					</view>
					<view class="noticebody">
						<view class="noticetitle">
							<wd-tag custom-class="space" type="danger">未读</wd-tag>
							<text>{{item.title}}</text>
						</view>
						<view class="noticecontent">{{item.content}}</view>
						<image v-if="item.cover!=''" style="width: 100%;border-radius: 4px;" :src="item.cover"
							mode="widthFix"></image>
						<view class="noticetag">{{item.tag}}</view>
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
	import {
		onLoad,
		onReachBottom
	} from '@dcloudio/uni-app'
	import {
		goPage
	} from "@/utils/common.js"
	import $http from "@/api/index.js"
	import dayjs from 'dayjs'
	import relativeTime from 'dayjs/plugin/relativeTime'
	import 'dayjs/locale/zh'
	dayjs.locale('zh')
	dayjs.extend(relativeTime)
	const props = defineProps({
		msgTotal: {
			default: {
				comment_total: 0,
				like_total: 0
			},
			type: Object
		}
	})
	const page = ref(1)
	const size = ref(10)
	const total = ref(0)
	const List = ref([])
	const noResult = ref(false)
	const getList = async () => {
		const res = await $http.common.getMessageList(page.value, size.value, "notice")
		total.value = res.total
		List.value = List.value.concat(res.data)
		if (total.value == 0) {
			noResult.value = true
		}
	}
	onReachBottom(() => {
		if (total.value > List.value.length) {
			++page.value
			getList()
		}
	})
	const navBarHeight = ref(0)
	onMounted(() => {
		const systemInfo = wx.getSystemInfoSync();
		const statusBarHeight = systemInfo.statusBarHeight;
		navBarHeight.value = statusBarHeight + 'px'
		getList()
	})
</script>

<style lang="scss" scoped>
	.zanandcomment {
		margin-top: 15px;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 15px;

		>view {
			flex-direction: column;
			background-color: white;
			border-radius: 8px;
			padding: 15px;

			image {
				width: 25px;
				height: 25px;
			}

			text {
				font-size: 14px;
			}
		}
	}

	.commentlist {
		margin-top: 15px;
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

	.noticelist {
		display: flex;
		flex-direction: column;

		.noticetime {
			font-size: 12px;
			text-align: center;
			color: #999;
			margin: 10px 0;
		}

		.noticebody {
			padding: 15px;
			background-color: white;
			border-radius: 8px;

			.noticetitle {
				display: flex;
				align-items: center;
				gap: 5px;
			}

			.noticetag {
				margin-top: 5px;
				text-align: right;
				color: #5880F2;
				font-size: 12px;
			}

			.noticecontent {
				color: #999;
				font-size: 14px;
				margin: 8px 0;
			}
		}
	}

	:deep(.wd-tabs__nav-item) {
		font-size: 16px;
	}

	:deep(.tabs) {
		background-color: transparent;
	}

	:deep(.wd-tabs) {
		background-color: transparent;
	}

	:deep(.wd-tabs__nav) {
		background-color: transparent;
	}
</style>