<template>
	<view>
		<StatusBar></StatusBar>
		<view style="padding:80px 30px;">
			<p class="title">欢迎回来，</p>
			<p class="title">我们一直在等你！</p>
			<wd-input style="margin-top: 40px;" size="large" type="text" label="邮箱" label-width="40px"
				v-model="from.email" placeholder="请输入邮箱" center />
			<wd-input style="margin-top: 15px;" size="large" type="text" label="密码" label-width="40px"
				v-model="from.password" placeholder="请输入账户密码" showPassword center />

			<wd-button @click="login()" style="margin-top: 30px;width: 100%;">登录</wd-button>
			<view class="more">
				<p @click="show=true">
					忘记密码？
				</p>
				<p @click="register()">
					注册账号
				</p>
			</view>
		</view>
		<!-- 其他登录方式 -->
		<!-- 	<view class="otherway">
			<WX></WX>
			<QQ></QQ>
			<ALI></ALI>
		</view> -->
	</view>
	<wd-action-sheet :safe-area-inset-bottom="false" cancel-text="取消" v-model="show" :actions="actions"
		@close="show=false" @select="select" />
	<wd-toast />
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import StatusBar from '@/components/statusBar.vue';
	import QQ from "./components/qq.vue"
	import WX from "./components/wx.vue"
	import ALI from "./components/alipay.vue"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	import {
		userStore
	} from "@/stores/index.js"
	import $http from "@/api/index.js"
	import {
		isEmail
	} from "@/utils/common.js"
	const toast = useToast()
	const from = ref({
		email: '',
		password: ''
	})
	const actions = ref([{
			name: '验证码登录'
		},
		{
			name: '重置密码'
		}
	])
	const login = async () => {
		if (isEmail(from.value.email)) {
			if (from.value.password == '') {
				toast.warning(`表单不完整`)
				return
			}
			try {
				const res = await $http.user.login('pwd', from.value)
				toast.success('登录成功')
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
					toast.error('邮箱或密码错误')
				}
			}
		} else {
			toast.warning('邮箱验证失败')
		}
	}
	const show = ref(false)
	const register = () => {
		uni.navigateTo({
			url: "/pages/register/register"
		})
	}
</script>

<style scoped lang="scss">
	.more {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 30px;

		p {
			font-size: $uni-font-size-base;

			&:nth-of-type(2) {
				color: $uni-color-primary;
			}

			&:nth-of-type(1) {
				color: $uni-color-subtitle;
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