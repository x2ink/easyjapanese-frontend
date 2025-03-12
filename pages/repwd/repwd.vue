<template>
	<view>
		<NavBar title="修改密码"></NavBar>
		<view class="input">
			<wd-input :disabled="email" custom-class="input1" no-border type="text" v-model="formData.email"
				placeholder="请输入邮箱">
			</wd-input>
			<wd-input custom-class="input1" no-border type="text" v-model="formData.password" placeholder="请输入新密码" />
			<view style="display: flex;align-items: center;justify-content: space-between;gap: 10px;">
				<wd-input style="flex: 1;" custom-class="input1" no-border type="text" v-model="formData.captcha"
					placeholder="请输入验证码" />
				<wd-button :disabled="countdown>0" style="width: 80px;" @click="getCaptcha()" type="warning"
					plain>{{btnText}}</wd-button>
			</view>

			<wd-button custom-class="btn" @click="submit()">立即修改</wd-button>
		</view>
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import NavBar from '@/components/navbar.vue'
	import $http from "@/api/index.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	import {
		isEmail
	} from "@/utils/common.js"
	const submit = async () => {
		try {
			const res = await $http.user.repwd(formData.value)
			toast.success('修改成功')
			setTimeout(() => {
				uni.navigateTo({
					url: "/pages/login/login"
				})
			}, 1000)
		} catch (err) {
			toast.warning('验证码错误或表单有误')
		}
	}
	const email = ref(null)
	onLoad((e) => {
		if (e.email) {
			email.value = e.email
			formData.value.email = e.email
		}
	})
	const toast = useToast()
	const formData = ref({
		email: "",
		captcha: "",
		password: ""
	})
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
	const getCaptcha = async () => {
		if (countdown.value > 0) {
			toast.warning(`请在${countdown.value}s之后尝试`)
			return
		}
		if (isEmail(formData.value.email)) {
			try {
				const res = await $http.user.getCaptcha('repwd', formData.value.email)
				toast.success('发送成功，请注意查收')
				startCountDown()
			} catch (error) {
				toast.warning(`操作频繁，稍后再试`)
			}
		} else {
			toast.warning('邮箱验证失败')
		}
	}
</script>

<style scoped lang="scss">
	:deep(.input1) {
		padding: 8px 15px;
		border-radius: 44px;
	}

	.input {
		margin-top: 5px;
		padding: 0 15px;
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	:deep(.btn) {
		width: 100%;
	}
</style>