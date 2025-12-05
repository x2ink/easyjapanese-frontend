<template>
	<view class="screen">
		<view class="profile-bg">
			<button class="avatar-container" open-type="chooseAvatar" @chooseavatar="chooseavatar">
				<image v-if="userStore().loginStatus" :src="userStore().userInfo.avatar" class="avatar-image"
					mode="aspectFill" />
				<image v-else src="https://jpx2ink.oss-cn-shanghai.aliyuncs.com/images/logo.png" class="avatar-image"
					mode="aspectFill" />
				<view v-if="userStore().loginStatus" class="camera-icon">
					<view class="camera-bg">
						<text class="fas fa-camera"></text>
					</view>
				</view>
			</button>
		</view>
		<view class="content-area">
			<view class="content-container">
				<view class="user-info">
					<view @click="login()" class="user-name-container">
						<view class="user-name">{{userStore().userInfo.nickname}}</view>
						<text v-if="userStore().loginStatus" class="fa-solid fa-pen-to-square"></text>
					</view>
					<text class="user-id">{{userStore().userInfo.email}}</text>
				</view>
				<view class="stats-grid">
					<view class="stat-item">
						<text class="stat-value">{{learnInfo.day}}</text>
						<text class="stat-label">连续打卡</text>
					</view>
					<view class="stat-item">
						<text class="stat-value">{{learnInfo.learnt}}</text>
						<text class="stat-label">已学词汇</text>
					</view>
					<view class="stat-item">
						<text class="stat-value">{{((learnInfo.learnnum/learnInfo.wordnum)*100).toFixed(0)}}%</text>
						<text class="stat-label">记忆保持率</text>
					</view>
				</view>
				
				<view class="function-list">
					<view @click="goPage('/pages/other/setplan/setplan')" class="function-item">
						<view class="function-icon orange">
							<text class="fas fa-headset"></text>
						</view>
						<text class="function-name">联系客服</text>
						<text class="fas fa-chevron-right arrow-icon"></text>
					</view>
					
					<view @click="goPage('/pages/other/feedback/feedback')" class="function-item">
						<view class="function-icon red">
							<text class="fas fa-comment-dots"></text>
						</view>
						<text class="function-name">意见反馈</text>
						<text class="fas fa-chevron-right arrow-icon"></text>
					</view>
					
					<view @click="goPage('/pages/other/about/about')" class="function-item">
						<view class="function-icon gray">
							<text class="fas fa-info-circle"></text>
						</view>
						<text class="function-name">关于我们</text>
						<text class="fas fa-chevron-right arrow-icon"></text>
					</view>
					
					<view class="function-item">
						<view class="function-icon blue">
							<text class="fas fa-share-alt"></text>
						</view>
						<text class="function-name">分享应用</text>
						<text class="fas fa-chevron-right arrow-icon"></text>
					</view>
				</view>
			</view>
		</view>

		<wd-popup v-model="nicknameShow" custom-style="border-radius:32rpx;width:560rpx;padding:32rpx"
			@close="nicknameShow=false">
			<view>
				<view class="modal-title">
					修改昵称
					<view @click="nicknameShow=false" class="modal-close">
						<text class="fas fa-times"></text>
					</view>
				</view>
				<view class="input-container">
					<input type="text" class="modal-input" placeholder="请输入新的昵称" maxlength="12" v-model="nickname">
					<view class="char-count">
						<text class="current-count">5</text>/12
					</view>
				</view>
				<view class="button-container">
					<button @click="nicknameShow=false" class="modal-button cancel _GCENTER">
						取消
					</button>
					<button @click="setnickname" class="modal-button confirm  _GCENTER">
						确定
					</button>
				</view>
			</view>
		</wd-popup>
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from 'vue'
	import {
		onShow
	} from "@dcloudio/uni-app"
	import $http from "@/api/index.js"
	import {
		userStore
	} from "@/stores/index.js"
	import {
		goPage
	} from "@/utils/common.js"
	import http from '@/utils/request.js'
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	
	const toast = useToast()
	const nicknameShow = ref(false)
	const nickname = ref("")
	
	const setnickname = async () => {
		if (nickname.value.length < 2 || nickname.value.length > 8) {
			toast.warning(`昵称长度在2-8之间`)
			return
		}
		const res = await $http.user.setUserInfo({
			avatar: userStore().userInfo.avatar,
			nickname: nickname.value,
		})
		toast.success(`修改成功`)
		userStore().setUserInfo()
		nicknameShow.value = false
	}
	
	const learnInfo = ref({
		"book_info": {
			"name": "",
			"id": 0,
			"describe": "",
			"icon": {
				"bg": "",
				"data": "",
				"type": ""
			}
		},
		"dates": [],
		"day": 0,
		"learn": 0,
		"learnt": 0,
		"learnnum": 0,
		"review": 0,
		"wordnum": 100
	})
	
	const chooseavatar = (resAvatarUrl) => {
		uni.getFileSystemManager().readFile({
			filePath: resAvatarUrl.detail.avatarUrl,
			encoding: "base64",
			success: async (successRes) => {
				const res = await $http.common.uploadbase64({
					data: successRes.data,
					file_name: `files/avatar/avatar-${userStore().userInfo.id}.png`
				});
				await $http.user.setUserInfo({
					avatar: res.url,
					nickname: userStore().userInfo.nickname,
				})
				userStore().setUserInfo()
			},
			fail: (res) => {
				console.log(res);
			}
		});
	}
	
	const getInfo = async () => {
		const res = await $http.word.getHomeInfo()
		learnInfo.value = res.data
	}
	
	const login = () => {
		if (userStore().loginStatus)
			nicknameShow.value = true
		else
			goPage("/pages/login/login")
	}
	
	onShow(() => {
		getInfo()
	})
</script>

<style lang="scss" scoped>
	/* 按钮容器 - 更新为水平排列 */
	.button-container {
		display: flex;
		gap: 24rpx;
		margin-top: 32rpx;
	}

	/* 基础按钮样式 */
	.modal-button {
		flex: 1;
		height: 80rpx;
		text-align: center;
		font-size: 28rpx;
		font-weight: 500;
		border-radius: 16rpx;
		border: none;
		outline: none;
	}

	/* 取消按钮 - 使用中性色 */
	.modal-button.cancel {
		background-color: #F5F5F5;
		color: #757575;
	}

	/* 确认按钮 - 使用微信绿 */
	.modal-button.confirm {
		background-color: #07C160;
		color: white;
		box-shadow: 0 4rpx 12rpx rgba(7, 193, 96, 0.3);
	}

	.screen {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	/* 弹窗标题 */
	.modal-title {
		text-align: center;
		font-size: 32rpx;
		font-weight: 500;
		color: #212121;
		position: relative;
	}

	/* 关闭按钮 */
	.modal-close {
		position: absolute;
		right: 0rpx;
		top: 0rpx;
		color: #757575;
		font-size: 36rpx;
	}


	/* 输入框容器 */
	.input-container {
		margin-top: 32rpx;
	}

	/* 字符计数 */
	.char-count {
		text-align: right;
		font-size: 24rpx;
		color: #757575;
		margin-top: 8rpx;
	}

	/* 输入框样式 */
	.modal-input {
		padding: 24rpx;
		border: 2rpx solid #E0E0E0;
		border-radius: 16rpx;
		font-size: 28rpx;
		color: #212121;
	}

	.modal-input:focus {
		border-color: #07C160;
	}

	.profile-bg {
		height: 360rpx;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		position: relative;
	}

	.avatar-container {
		overflow: inherit !important;
		position: absolute;
		bottom: -80rpx;
		left: 32rpx;
		width: 160rpx;
		height: 160rpx;
		border: 8rpx solid white;
		border-radius: 50%;
		background-color: white;
		z-index: 10;
		box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.15);
		padding: 0; /* 修复 button 默认 padding */
		margin: 0; /* 修复 button 默认 margin */

		&:active {
			transform: scale(1) !important;
			opacity: 1 !important;
		}
		
		/* 修复 button 默认伪元素边框 */
		&::after {
			border: none;
		}

		.avatar-image {
			width: 100%;
			height: 100%;
			border-radius: 50%;
			display: block; /* 防止图片底部留白 */
		}

		.camera-icon {
			position: absolute;
			bottom: 0rpx;
			right: 0rpx;
			background: white;
			padding: 4rpx;
			border-radius: 50%;

			.camera-bg {
				width: 40rpx;
				height: 40rpx;
				background: #10b981;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;

				.fa-camera {
					color: white;
					font-size: 20rpx;
				}
			}
		}
	}

	.content-area {
		flex: 1;
		overflow-y: auto;

		&::-webkit-scrollbar {
			display: none;
		}
	}

	.content-container {
		padding: 0 32rpx;
	}

	.user-info {
		margin-top: 120rpx;

		.user-name-container {
			display: flex;
			align-items: center;
			gap: 16rpx;

			text {
				font-size: 36rpx;
			}
		}

		.user-name {
			font-size: 48rpx;
			font-weight: bold;
			margin: 0;
			color: #333; /* 补充颜色 */
		}

		.vip-badge {
			padding: 4rpx 16rpx;
			background: #fef3c7;
			color: #d97706;
			border-radius: 24rpx;
			font-size: 24rpx;
			
			/* 修改选择器以匹配 text 标签 */
			text {
				margin-right: 8rpx;
			}
		}

		.user-id {
			font-size: 24rpx;
			color: #6b7280;
			margin-top: 8rpx;
			display: block; /* 确保 text 换行 */
		}
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 32rpx;
		margin-top: 48rpx;

		.stat-item {
			background: white;
			border-radius: 16rpx;
			padding: 24rpx;
			text-align: center;
			display: flex;
			flex-direction: column;

			.stat-value {
				font-size: 48rpx;
				font-weight: bold;
				color: #2563eb;
			}

			.stat-label {
				font-size: 24rpx;
				color: #6b7280;
				margin-top: 8rpx;
			}
		}
	}

	.function-list {
		margin-top: 64rpx;
		display: flex;
		flex-direction: column;
		gap: 32rpx;

		.function-item {
			background: white;
			border-radius: 16rpx;
			padding: 24rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.function-icon {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 24rpx;

				&.blue {
					background: #dbeafe;
					color: #2563eb;
				}

				&.orange {
					background: #ffedd5;
					color: #ea580c;
				}

				&.red {
					background: #fee2e2;
					color: #dc2626;
				}

				&.gray {
					background: #f3f4f6;
					color: #4b5563;
				}
			}

			.function-name {
				flex: 1;
				font-size: 28rpx;
				color: #374151;
			}

			.arrow-icon {
				color: #9ca3af;
				font-size: 24rpx;
			}
		}
	}
</style>