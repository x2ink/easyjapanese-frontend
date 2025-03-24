<template>
	<view>
		<view :style="{height:navBarHeight}"></view>
		<view @click="goUserInfo()" class="userinfo">
			<uv-avatar size="60" :src="userStore().userInfo.avatar"></uv-avatar>
			<view>
				<p class="name">{{userStore().userInfo.nickname}}</p>
				<p class="id">{{userStore().userInfo.email}}</p>
			</view>
		</view>
		<!-- 	<view class="banner _BACKGROUND">
		</view> -->
		<view class="timerecord">
			<view class="title">
				<text>日历</text>
				<view>
					<text>连续签到7天</text>
					<wd-icon name="chevron-right" size="18px" color="#999"></wd-icon>
				</view>
			</view>
			<view class="week">
				<view class="_GCENTER" v-for="_ in 7">
					<text>月曜日</text>
					<view class="_GCENTER">17</view>
				</view>
			</view>
		</view>
		<view class="statistics">
			<view class="left">
				<view class="head">
					<wd-icon name="time" size="20px" />
					<view>今日学习时长</view>
				</view>
				<view>
					<view class="time">
						<text>0</text>
						<text>分钟</text>
					</view>
					<wd-progress :percentage="30" />
					<p class="target">学习目标&nbsp;5分钟</p>
				</view>
			</view>
			<view class="right">
				<view class="rightitem">
					<wd-icon name="chart-bar" size="18px"></wd-icon>
					<view>
						<view class="tit">累计学习</view>
						<view class="val">11111<text>词</text></view>
					</view>
				</view>
				<view class="rightitem">
					<wd-icon name="calendar" size="18px"></wd-icon>
					<view>
						<view class="tit">累计时长</view>
						<view class="val">12313<text>分钟</text></view>
					</view>
				</view>
			</view>
		</view>
		<view class="cell">
			<view class="cellitem" @click="goPage('/trendpages/mytrend/mytrend')">
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
			<view class="cellitem" @click="goPage('/otherpages/setting/setting')">
				<p>设置</p>
				<wd-icon name="arrow-right" size="20px"></wd-icon>
			</view>
		</view>
		<view class="cell">
			<view class="cellitem" @click="goPage('/otherpages/feedback/feedback')">
				<p>意见反馈</p>
				<wd-icon name="arrow-right" size="20px"></wd-icon>
			</view>
			<view class="cellitem" @click="goPage('/otherpages/about/about')">
				<p>关于我们</p>
				<wd-icon name="arrow-right" size="20px"></wd-icon>
			</view>
			<view class="cellitem" @click="goPage('/otherpages/share/share')">
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
	const goUserInfo = () => {
		if (userStore().loginStatus) {
			goPage("/userpages/userinfo/userinfo")
		} else {
			goPage("/pages/login/login")
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
			margin-top: 2px;
		}
	}

	.timerecord {
		margin: 0 15px 15px 15px;
		background-color: white;
		padding: 15px;
		border-radius: $uni-border-radius-base;

		.week {
			margin-top: 10px;
			display: grid;
			grid-template-columns: repeat(7, 1fr);

			>view {
				flex-direction: column;

				>text {
					font-size: 12px;
					color: #999;
				}

				>view {
					margin-top: 10px;
					height: 30px;
					width: 30px;
					background-color: #34D19D;
					border-radius: 50%;
					font-weight: bold;
					font-size: 14px;
					color: white;
				}
			}
		}

		.title {
			display: flex;
			align-items: center;
			justify-content: space-between;

			>text {
				font-weight: bold;
			}

			>view {
				display: flex;
				align-items: center;
				gap: 3px;

				text {
					line-height: 12px;
					font-size: 12px;
					color: #999;
				}
			}
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

				.tit {
					font-size: 14px;
				}

				.val {
					margin-top: 3px;
					font-size: 16px;
					color: $uni-text-color-grey;

					text {
						margin-left: 3px;
						font-size: 12px;
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