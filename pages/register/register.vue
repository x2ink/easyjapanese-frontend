<template>
	<view>
		<StatusBar></StatusBar>
		<view style="padding:40px 30px;">
			<p class="title">注册</p>
			<wd-input no-border style="margin-top: 20px;" size="large" type="text" v-model="from.email"
				placeholder="请输入邮箱" center />
			<view style="background-color: #f0f0f0;height: 1px;width: 100%;"></view>
			<wd-input no-border size="large" type="text" v-model="from.password" placeholder="请输入密码" showPassword
				center />
			<view style="background-color: #f0f0f0;height: 1px;width: 100%;"></view>
			<wd-input no-border size="large" type="text" v-model="validPassword" placeholder="请输入确认密码" showPassword
				center />
			<view style="background-color: #f0f0f0;height: 1px;width: 100%;"></view>
			<wd-input no-border size="large" type="text" v-model="from.captcha" placeholder="请输入验证码" center>
				<template #suffix>
					<wd-button :disabled="countdown>0" style="width: 80px;" @click="getCaptcha()" type="warning"
						size="small" plain>{{btnText}}</wd-button>
				</template>
			</wd-input>
			<view style="background-color: #f0f0f0;height: 1px;width: 100%;"></view>
			<wd-button style="margin-top: 30px;width: 100%;" @click="register()">注册</wd-button>
			<view class="more">
				<p @click="back">
					返回登录
				</p>
			</view>
		</view>

	</view>
	<wd-toast />
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted
	} from 'vue'
	import StatusBar from '@/components/statusBar.vue';
	import $http from "@/api/index.js"
	import {
		isEmail
	} from "@/utils/common.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	import {
		userStore
	} from "@/stores/index.js"
	const toast = useToast()
	const from = ref({
		email: '339851531@qq.com',
		password: '',
		captcha: '',
		os: '',
		device: '',
		nickname: '默认昵称'

	})
	onMounted(() => {
		uni.getSystemInfo({
			success: (res) => {
				from.value.os = res.osName
				from.value.device = res.deviceBrand || '未知'
			}
		})
	})
	const validPassword = ref('')
	const countdown = ref(0)
	const btnText = computed(() => {
		if (countdown.value > 0) {
			return `${countdown.value}s`
		} else {
			return '获取验证码'
		}
	})
	let timeId;
	const startCountDown = () => {
		countdown.value = 60
		timeId = setInterval(() => {
			if (--countdown.value <= 0) {
				clearInterval(timeId)
			}
		}, 1000)
	}
	const register = async () => {
		if (from.value.password != validPassword.value) {
			toast.warning(`确认密码不一致`)
			return
		}
		if (from.value.email == '' || from.value.password == '' ||
			from.value.captcha == '') {
			toast.warning(`表单不完整`)
			return
		}
		try {
			const res = await $http.user.register(from.value)
			toast.success('注册成功')
			userStore().setToken(res.data)
			setTimeout(() => {
				uni.navigateTo({
					url: "/pages/index/index"
				})
			}, 1000)
		} catch (error) {
			if (error.code === 4001) {
				toast.error('验证码错误或失效')
			} else if (error.code === 4002) {
				toast.error('邮箱已被注册')
			}
		}
	}
	const getCaptcha = async () => {
		if (countdown.value > 0) {
			toast.warning(`请在${countdown.value}s之后尝试`)
			return
		}
		if (isEmail(from.value.email)) {
			try {
				const res = await $http.user.getCaptcha('register', from.value.email)
				toast.success('发送成功，请注意查收')
				startCountDown()
			} catch (error) {
				toast.warning(`操作频繁，稍后再试`)
			}
		} else {
			toast.warning('邮箱验证失败')
		}
	}
	const back = () => {
		uni.navigateBack({
			delta: 1
		})
	}
</script>

<style lang="scss" scoped>
	.more {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 30px;

		p {
			font-size: $uni-font-size-base;

			&:nth-of-type(1) {
				color: $uni-color-primary;
			}
		}
	}

	:deep(.wd-input) {
		border-radius: $uni-border-radius-base;
	}

	.title {
		font-size: $uni-font-size-subtitle;
		font-weight: bold;
	}

	.otherway {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 30px;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 30px;
	}
</style>