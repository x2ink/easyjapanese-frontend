<template>
	<Statusbar></Statusbar>
	<view class="userinfo">
		<uv-avatar size="60" :text="userInfo.nickname.charAt(0)" v-if="userInfo.avatar==''"></uv-avatar>
		<view>
			<p class="name">{{userInfo.nickname}}</p>
			<p class="id">{{userInfo.email}}</p>
		</view>
	</view>
	<view class="banner">
		banner图
	</view>
	<view class="statistics">
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
	</view>
	<view class="cell">
		<view class="cellitem">
			<p>学习笔记</p>
			<wd-icon name="arrow-right" size="22px"></wd-icon>
		</view>
		<view class="cellitem">
			<p>收藏夹</p>
			<wd-icon name="arrow-right" size="22px"></wd-icon>
		</view>
		<view class="cellitem">
			<p>排行榜</p>
			<wd-icon name="arrow-right" size="22px"></wd-icon>
		</view>
		<view class="cellitem">
			<p>我的PDF </p>
			<wd-icon name="arrow-right" size="22px"></wd-icon>
		</view>
		<view class="cellitem">
			<p>领取资料</p>
			<wd-icon name="arrow-right" size="22px"></wd-icon>
		</view>
		<view class="cellitem">
			<p>设置</p>
			<wd-icon name="arrow-right" size="22px"></wd-icon>
		</view>
	</view>
	<view class="cell">
		<view class="cellitem">
			<p>意见反馈</p>
			<wd-icon name="arrow-right" size="22px"></wd-icon>
		</view>
		<view class="cellitem">
			<p>关于我们</p>
			<wd-icon name="arrow-right" size="22px"></wd-icon>
		</view>
		<view class="cellitem">
			<p>分享App</p>
			<wd-icon name="arrow-right" size="22px"></wd-icon>
		</view>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from 'vue'
	import Statusbar from "@/components/statusbar.vue"
	import $http from "@/api/index.js"
	const getUserInfoSimple = async () => {
		const res = await $http.user.getUserInfoSimple()
		userInfo.value = res.data
		console.log(userInfo.value);
	}
	const userInfo = ref({
		address: "",
		avatar: '',
		nickname: '',
		role: "",
		email: ''
	})
	onMounted(() => {
		getUserInfoSimple()
	})
</script>

<style lang="scss" scoped>
	.banner {
		margin: 15px;
		background-color: white;
		aspect-ratio: 5/1;
		border-radius: $uni-border-radius-base;
	}

	.cell {
		padding: 10px;
		margin: 15px;
		background-color: white;
		border-radius: $uni-border-radius-base;

		.cellitem {
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}

	.userinfo {
		display: flex;
		margin: 15px;
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