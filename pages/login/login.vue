<template>
	<view class="login-container">
		<!-- 主要内容 -->
		<view class="main-content">
			<!-- APP Logo -->
			<view class="_GCENTER" style="flex-direction: column;margin-bottom: 40px;">
				<image src="https://jpx2ink.oss-cn-shanghai.aliyuncs.com/images/logo.png" mode="aspectFit"
					class="app-logo"></image>
				<view class="text-2xl font-medium text-gray-800">轻松日语</view>
				<view class="text-gray-500 text-sm mt-1">单词学习小助手</view>
			</view>
			<!-- 登录按钮 -->
			<button class="login-btn w-full mb-6 wave-effect" @click="wxLogin()">
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
		onLoad
	} from "@dcloudio/uni-app"
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
		uni.login({
			provider: 'weixin',
			success: async function(loginRes) {
				let data = {
					code: loginRes.code,
					os: from.value.os,
					device: from.value.device
				}
				const loginResult = await $http.user.wxLogin(data)
				toast.close()
				userStore().setToken(loginResult.data)
				userStore().setUserInfo()
				if (backLastPage.value) {
					uni.navigateBack({
						delta: 1
					})
				} else {
					uni.reLaunch({
						url: "/pages/index/index/index"
					})
				}
			}
		});
	}
	const from = ref({
		os: '',
		device: ''
	})
	const backLastPage = ref(false)
	onLoad((e) => {
		if (e.toast) {
			backLastPage.value = true
			toast.warning(e.toast)
		}
	})
</script>

<style scoped lang="scss">
	.app-logo {
		width: 80px;
		height: 80px;
		border-radius: 16px;
		margin-bottom: 16px;
	}

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

		.text-green-500 {
			color: #07c160;
		}

		.flex {
			display: flex;
			align-items: center;
			font-size: 12px;
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