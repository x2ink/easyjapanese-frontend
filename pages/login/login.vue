<template>
	<view class="login-container">
		<!-- 主要内容 -->
		<view class="main-content">
			<!-- APP Logo -->
			<view class="_GCENTER" style="flex-direction: column;margin-bottom: 40px;">
				<view
					class="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-4">
					<text class="fas fa-language text-white text-3xl"></text>
				</view>
				<view class="text-2xl font-medium text-gray-800">日语背单词</view>
				<view class="text-gray-500 text-sm mt-1">高效记忆日语词汇</view>
			</view>
			<!-- 登录按钮 -->
			<button class="login-btn w-full mb-6 wave-effect" @click="wxLogin()">
				<text class="fab fa-weixin"></text>
				<text>微信一键登录</text>
			</button>

			<!-- 用户协议 -->
			<view class="flex text-xs text-gray-500">
				<checkbox-group @change="change">
					<label>
						<checkbox class="agreement-checkbox" :value="true" />
						<text>
							我已阅读并同意<text class="text-green-500" @click="openAgreement('user')">《用户协议》</text>和<text
								class="text-green-500" @click="openAgreement('privacy')">《隐私政策》</text>
						</text>
					</label>
				</checkbox-group>
			</view>
		</view>
	</view>
	<wd-toast />
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	import {
		userStore
	} from "@/stores/index.js"
	import $http from "@/api/index.js"
	const change = ({
		detail
	}) => {
		if (detail.value[0] == "true") {
			agree.value = true
		} else {
			agree.value = false
		}
	}
	onMounted(() => {
		uni.getSystemInfo({
			success: (res) => {
				from.value.os = res.osName
				from.value.device = res.deviceBrand || '未知'
			}
		})
	})
	const agree = ref(false)

	const wxLogin = () => {
		if (!agree.value) {
			toast.warning(`请同意《用户协议》与《隐私政策》`)
			return
		}
		toast.loading('正在登录中...')
		uni.getUserInfo({
			provider: "weixin",
			lang: "zh_CN",
			success: (InfoRes) => {
				uni.login({
					provider: 'weixin',
					success: async function(loginRes) {
						let data = {
							avatar: InfoRes.userInfo.avatarUrl,
							nickname: InfoRes.userInfo.nickName,
							code: loginRes.code,
							os: from.value.os,
							device: from.value.device
						}
						const loginResult = await $http.user.wxLogin(data)
						toast.close()
						userStore().setToken(loginResult.data)
						userStore().setUserInfo()
						uni.navigateTo({
							url: "/pages/index/index"
						})
					}
				});
			},
			fail: () => {
				toast.warning(`请授权获取用户昵称与头像`)
			}
		})
	}
	const from = ref({
		os: '',
		device: ''
	})
</script>

<style scoped lang="scss">
	.login-container {
		height: 100vh;
		padding: 0 32px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		position: relative;



		.main-content {
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.w-20 {
			width: 80px;
		}

		.h-20 {
			height: 80px;
		}

		.rounded-2xl {
			border-radius: 16px;
		}

		.mb-4 {
			margin-bottom: 16px;
		}

		.text-2xl {
			font-size: 24px;
		}

		.font-medium {
			font-weight: 500;
		}

		.text-gray-800 {
			color: #1f2937;
		}

		.text-gray-500 {
			color: #6b7280;
		}

		.text-sm {
			font-size: 14px;
		}

		.mt-1 {
			margin-top: 4px;
		}

		.w-full {
			width: 100%;
		}

		.mb-6 {
			margin-bottom: 24px;
		}

		.mr-2 {
			margin-right: 8px;
		}

		.text-lg {
			font-size: 18px;
		}

		.text-white {
			color: #fff;
		}

		.text-3xl {
			font-size: 30px;
		}

		.text-green-500 {
			color: #07c160;
		}

		.bg-gradient-to-br {
			background: linear-gradient(135deg, #4ade80, #16a34a);
		}

		.flex {
			display: flex;
			align-items: center;
			font-size: 12px;
		}

		.items-center {
			align-items: center;
		}

		.justify-center {
			justify-content: center;
		}

		.flex-col {
			flex-direction: column;
		}

		.login-btn {
			background: #07c160;
			color: white;
			border-radius: 8px;
			padding: 12px;
			font-size: 16px;
			font-weight: 500;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 2px 10px rgba(7, 193, 96, 0.2);
			border: none;
			gap: 10px;
			position: relative;
			overflow: hidden;

			&::after {
				content: '';
				position: absolute;
				top: 50%;
				left: 50%;
				width: 5px;
				height: 5px;
				background: rgba(7, 193, 96, 0.2);
				opacity: 0;
				border-radius: 100%;
				transform: scale(1) translate(-50%, -50%);
			}

			&:active::after {
				animation: wave 0.4s ease-out;
			}
		}

		.agreement-checkbox {
			transform: scale(0.7);
			appearance: none;
			position: relative;
			flex-shrink: 0;
		}
	}
</style>