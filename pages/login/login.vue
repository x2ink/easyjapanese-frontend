<template>
	<view>
		<StatusBar></StatusBar>
		<NavBar></NavBar>
		<view style="padding:80px 30px;">
			<p class="title">你好，</p>
			<p class="title">欢迎登录轻松日语</p>
			<wd-input style="margin-top: 40px;" size="large" type="text" label="邮箱" label-width="40px"
				v-model="from.email" placeholder="请输入邮箱" center />
			<wd-input style="margin-top: 15px;" size="large" type="text" label="密码" label-width="40px"
				v-model="from.password" placeholder="请输入账户密码" showPassword center />

			<wd-button style="margin-top: 30px;width: 100%;">登录</wd-button>
			<view class="more">
				<p>
					忘记密码？
				</p>
				<p>
					注册账号
				</p>
			</view>
		</view>
		<view class="otherway">
			<WX></WX>
			<QQ></QQ>
			<ALI></ALI>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import StatusBar from '@/components/statusBar.vue';
	import NavBar from '@/components/navbar.vue'
	import QQ from "./components/qq.vue"
	import WX from "./components/wx.vue"
	import ALI from "./components/alipay.vue"
	const from = ref({
		email: '',
		password: ''
	})
</script>

<style lang="scss">
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