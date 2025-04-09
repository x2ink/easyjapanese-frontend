<template>
	<div class="screen">
		<!-- 集成背景和标题 -->
		<div class="profile-bg">
			<!-- 头像 -->
			<div @click="selectImg" class="avatar-container">
				<image :src="userStore().userInfo.avatar" class="avatar-image" mode="aspectFill" />
				<!-- 相机图标 -->
				<div class="camera-icon">
					<div class="camera-bg">
						<i class="fas fa-camera"></i>
					</div>
				</div>
			</div>
		</div>

		<view class="content-area">
			<!-- 用户信息容器 -->
			<div class="content-container">
				<!-- 用户信息 -->
				<div class="user-info">
					<div @click="nicknameShow=true" class="user-name-container">
						<h2 class="user-name">{{userStore().userInfo.nickname}}</h2><text
							class="fa-solid fa-pen-to-square"></text>
					</div>
					<p class="user-id">{{userStore().userInfo.email}}</p>
				</div>

				<!-- 学习数据 -->
				<div class="stats-grid">
					<div class="stat-item">
						<div class="stat-value">7</div>
						<div class="stat-label">连续打卡</div>
					</div>
					<div class="stat-item">
						<div class="stat-value">328</div>
						<div class="stat-label">已学词汇</div>
					</div>
					<div class="stat-item">
						<div class="stat-value">86%</div>
						<div class="stat-label">记忆保持率</div>
					</div>
				</div>

				<!-- 功能入口 -->
				<div class="function-list">
					<div class="function-item">
						<div class="function-icon orange">
							<i class="fas fa-cog"></i>
						</div>
						<span class="function-name">系统设置</span>
						<i class="fas fa-chevron-right arrow-icon"></i>
					</div>
					<div @click="goPage('/pages/other/feedback/feedback')" class="function-item">
						<div class="function-icon red">
							<i class="fas fa-comment-dots"></i>
						</div>
						<span class="function-name">意见反馈</span>
						<i class="fas fa-chevron-right arrow-icon"></i>
					</div>
					<div @click="goPage('/pages/other/about/about')" class="function-item">
						<div class="function-icon gray">
							<i class="fas fa-info-circle"></i>
						</div>
						<span class="function-name">关于我们</span>
						<i class="fas fa-chevron-right arrow-icon"></i>
					</div>
					<div class="function-item">
						<div class="function-icon blue">
							<i class="fas fa-share-alt"></i>
						</div>
						<span class="function-name">分享应用</span>
						<i class="fas fa-chevron-right arrow-icon"></i>
					</div>
				</div>
			</div>
		</view>
		<wd-popup v-model="nicknameShow" custom-style="border-radius:16px;width:280px;padding:16px"
			@close="nicknameShow=false">
			<view>
				<div class="modal-title">
					修改昵称
					<div @click="nicknameShow=false" class="modal-close">
						<text class="fas fa-times"></text>
					</div>
				</div>
				<div class="input-container">
					<input type="text" class="modal-input" placeholder="请输入新的昵称" maxlength="12" v-model="nickname">
					<div class="char-count">
						<span class="current-count">5</span>/12
					</div>
				</div>
				<div class="button-container">
					<button @click="nicknameShow=false" class="modal-button cancel _GCENTER">
						取消
					</button>
					<button @click="setnickname" class="modal-button confirm  _GCENTER">
						确定
					</button>
				</div>
			</view>
		</wd-popup>
		<wd-toast />
	</div>
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
	const selectImg = () => {
		uni.chooseImage({
			count: 1,
			sizeType: ['compressed'],
			sourceType: ['album'],
			success: function(res) {
				uni.uploadFile({
					url: `${http.baseUrl}upload`,
					filePath: res.tempFilePaths[0],
					name: 'file',
					success: async (fileRes) => {
						const res = await $http.user.setUserInfo({
							avatar: JSON.parse(fileRes.data).data,
							nickname: userStore().userInfo.nickname,
						})
						userStore().setUserInfo()
					}
				});
			}
		});
	}
</script>

<style lang="scss" scoped>
	/* 按钮容器 - 更新为水平排列 */
	.button-container {
		display: flex;
		gap: 12px;
		margin-top: 16px;
	}

	/* 基础按钮样式 */
	.modal-button {
		flex: 1;
		height: 40px;
		text-align: center;
		font-size: 14px;
		font-weight: 500;
		border-radius: 8px;
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
		box-shadow: 0 2px 6px rgba(7, 193, 96, 0.3);
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
		font-size: 16px;
		font-weight: 500;
		color: #212121;
		position: relative;
	}

	/* 关闭按钮 */
	.modal-close {
		position: absolute;
		right: 0px;
		top: 0px;
		color: #757575;
		font-size: 18px;
	}


	/* 输入框容器 */
	.input-container {
		margin-top: 16px;
	}

	/* 字符计数 */
	.char-count {
		text-align: right;
		font-size: 12px;
		color: #757575;
		margin-top: 4px;
	}

	/* 输入框样式 */
	.modal-input {
		padding: 12px;
		border: 1px solid #E0E0E0;
		border-radius: 8px;
		font-size: 14px;
		color: #212121;
	}

	.modal-input:focus {
		border-color: #07C160;
	}

	.profile-bg {
		height: 180px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		position: relative;
	}

	.avatar-container {
		position: absolute;
		bottom: -40px;
		left: 16px;
		width: 80px;
		height: 80px;
		border: 4px solid white;
		border-radius: 50%;
		background-color: white;
		z-index: 10;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);

		.avatar-image {
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}

		.camera-icon {
			position: absolute;
			bottom: 0px;
			right: 0px;
			background: white;
			padding: 2px;
			border-radius: 50%;

			.camera-bg {
				width: 20px;
				height: 20px;
				background: #10b981;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;

				.fa-camera {
					color: white;
					font-size: 10px;
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
		padding: 0 16px;
	}

	.user-info {
		margin-top: 60px;

		.user-name-container {
			display: flex;
			align-items: center;
			gap: 8px;

			text {
				font-size: 18px;
			}
		}

		.user-name {
			font-size: 24px;
			font-weight: bold;
			margin: 0;
		}

		.vip-badge {
			padding: 2px 8px;
			background: #fef3c7;
			color: #d97706;
			border-radius: 12px;
			font-size: 12px;

			i {
				margin-right: 4px;
			}
		}

		.user-id {
			font-size: 12px;
			color: #6b7280;
			margin-top: 4px;
		}
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
		margin-top: 24px;

		.stat-item {
			background: white;
			border-radius: 8px;
			padding: 12px;
			text-align: center;

			.stat-value {
				font-size: 24px;
				font-weight: bold;
				color: #2563eb;
			}

			.stat-label {
				font-size: 12px;
				color: #6b7280;
				margin-top: 4px;
			}
		}
	}

	.function-list {
		margin-top: 32px;
		display: flex;
		flex-direction: column;
		gap: 16px;

		.function-item {
			background: white;
			border-radius: 8px;
			padding: 12px;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.function-icon {
				width: 32px;
				height: 32px;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 12px;

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
				font-size: 14px;
				color: #374151;
			}

			.arrow-icon {
				color: #9ca3af;
				font-size: 12px;
			}
		}
	}
</style>