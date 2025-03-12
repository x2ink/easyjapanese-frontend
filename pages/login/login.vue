<template>
	<view>
		<Navbar></Navbar>
		<view class="_GCENTER body">
			<image class="logo" src="http://jp.x2.ink/images/logo.png" mode="aspectFit"></image>
			<view class="title">轻松日语APP</view>
			<view class="describe">日语单词百科全书</view>
			<wd-button @click="wxLogin()" custom-class="login">微信一键登录</wd-button>
			<view class="agree">
				<wd-checkbox v-model="agree">
					<view class="agreement">我已同意并阅读<text>《用户协议》</text>与<text>《隐私政策》</text></view>
				</wd-checkbox>
			</view>
		</view>
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import Navbar from '@/components/navbar/navbar.vue';
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	import {
		userStore
	} from "@/stores/index.js"
	import $http from "@/api/index.js"
	const toast = useToast()
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
			toast.warning(`请同意《用户协议》与隐私政策`)
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
						console.log(loginResult);
						toast.close()
						userStore().setToken(loginResult.data)
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
	:deep(.login) {
		width: 100%;
		margin-top: 30px;
	}

	.agree {
		margin-top: 30px;

		.agreement {
			font-size: 12px;
			color: #999;

			text {
				color: #5880F2;
			}
		}
	}


	.body {
		padding: 30px 15px;
		flex-direction: column;

		.title {
			font-size: 18px;
			margin-top: 10px;
			font-weight: 600;
		}

		.describe {
			margin-top: 5px;
			color: #999;
			font-size: 12px;
		}

		.logo {
			width: 100px;
			height: 100px;
			border-radius: 50%;
		}
	}
</style>