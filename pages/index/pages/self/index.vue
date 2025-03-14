<template>
	<view>
		<view :style="{height:navBarHeight}"></view>
		<view @click="goPage('userinfo')" class="userinfo">
			<uv-avatar size="60" :src="userStore().userInfo.avatar"></uv-avatar>
			<view>
				<p class="name">{{userStore().userInfo.nickname}}</p>
				<p class="id">{{userStore().userInfo.email}}</p>
			</view>
		</view>
		<view class="banner _BACKGROUND">
		</view>
		<!-- 	<view class="statistics">
			<view class="left">
				<view class="head">
					<wd-icon name="add-circle" size="20px" />
					<p>今日学习时长</p>
				</view>
				<view>
					<view class="time">
						<span>0</span>
						<span>分钟</span>
					</view>
					<wd-progress :percentage="30" />
					<p class="target">学习目标&nbsp;5分钟</p>
				</view>
			</view>
			<view class="right">
				<view class="rightitem">
					<wd-icon name="add-circle" size="20px" />
					<view>
						<p>总时长</p>
						<p>1小时48分钟</p>
					</view>
				</view>
				<view class="rightitem">
					<wd-icon name="add-circle" size="20px" />
					<view>
						<p>累计打卡</p>
						<p>1小时48分钟</p>
					</view>
				</view>
			</view>
		</view> -->
		<view class="cell">
			<view class="cellitem" @click="goPage('mytrend')">
				<p>我的动态</p>
				<wd-icon name="arrow-right" size="20px"></wd-icon>
			</view>
			<view class="cellitem" @click="goPage('/pages/word/mybooks/mybooks')">
				<p>单词本</p>
				<wd-icon name="arrow-right" size="20px"></wd-icon>
			</view>
			<view class="cellitem" @click="goPage('ranking')">
				<p>排行榜</p>
				<wd-icon name="arrow-right" size="20px"></wd-icon>
			</view>
			<view class="cellitem" @click="goPage('setting')">
				<p>设置</p>
				<wd-icon name="arrow-right" size="20px"></wd-icon>
			</view>
		</view>
		<view class="cell">
			<view class="cellitem" @click="goPage('feedback')">
				<p>意见反馈</p>
				<wd-icon name="arrow-right" size="20px"></wd-icon>
			</view>
			<view class="cellitem" @click="goPage('about')">
				<p>关于我们</p>
				<wd-icon name="arrow-right" size="20px"></wd-icon>
			</view>
			<view class="cellitem" @click="goPage('share')">
				<p>分享App</p>
				<wd-icon name="arrow-right" size="20px"></wd-icon>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from 'vue'
	import $http from "@/api/index.js"
	import {
		userStore
	} from "@/stores/index.js"
	import {
		goPage
	} from "@/utils/common.js"
	const goFollowUs = () => {
		let url = "https://space.bilibili.com/437416398"
		if (uni.getSystemInfoSync().uniPlatform == 'web') {
			window.open(url)
		} else {
			plus.runtime.openURL(url)
		}
	}
	const navBarHeight = ref(0)
	onMounted(() => {
		const systemInfo = wx.getSystemInfoSync();
		const statusBarHeight = systemInfo.statusBarHeight;
		navBarHeight.value = statusBarHeight + 'px'
	})
</script>

<style lang="scss" scoped>
	.banner {
		margin: 0 15px;
		background-image: url('http://jp.x2.ink/images/followus.jpg');
		aspect-ratio: 5/1;
		border-radius: $uni-border-radius-base;
	}

	.cell {
		padding: 5px 15px;
		margin: 15px;
		background-color: white;
		border-radius: $uni-border-radius-base;

		.cellitem {
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 14px;
		}
	}

	.userinfo {
		display: flex;
		padding: 15px;
		gap: 15px;
		align-items: center;


		.name {
			font-weight: bold;
		}

		.id {
			font-size: $uni-font-size-base;
			margin-top: 5px;
		}
	}

	.statistics {
		margin: 15px;
		display: flex;
		gap: 10px;

		.left {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			gap: 10px;

			.target {
				font-size: $uni-font-size-sm;
				color: $uni-text-color-grey;
			}

			.head {
				display: flex;
				align-items: center;
				gap: 5px;
				font-weight: bold;
			}

			.time {
				span {
					&:nth-of-type(1) {
						font-size: 35px;
						font-weight: bold;
					}

					&:nth-of-type(2) {
						margin-left: 5px;
						font-size: $uni-font-size-sm;
					}
				}
			}
		}

		.right {
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.rightitem {
				gap: 10px;
				display: flex;

				p {
					&:nth-of-type(1) {
						font-weight: bold;
					}

					&:nth-of-type(2) {
						margin-top: 3px;
						font-size: $uni-font-size-sm;
						color: $uni-text-color-grey;
					}
				}
			}
		}

		>view {
			flex: 1;
			background-color: white;
			padding: 15px;
			border-radius: $uni-border-radius-base;
		}
	}
</style>