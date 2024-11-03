<template>
	<view>
		<StatusBar></StatusBar>
		<NavBar></NavBar>
		<view style="padding:80px 30px;">
			<p class="title">你好，</p>
			<p class="title">欢迎加入轻松日语</p>
			<wd-input style="margin-top: 40px;" size="large" type="text" label="邮箱" label-width="40px"
				v-model="from.email" placeholder="请输入邮箱" center />
			<wd-input style="margin-top: 15px;" size="large" type="text" label="密码" label-width="40px"
				v-model="from.password" placeholder="请输入账户密码" showPassword center />
			<wd-input style="margin-top: 15px;" size="large" type="text" label="确认密码" label-width="65px"
				v-model="from.password" placeholder="请输入账户确认密码" showPassword center />
			<wd-input style="margin-top: 15px;" size="large" type="text" label="验证码" label-width="50px"
				v-model="from.password" placeholder="请输入验证码" center>
				<template #suffix>
					<wd-button type="warning" size="small">获取验证码</wd-button>
				</template>
			</wd-input>
			<wd-button style="margin-top: 30px;width: 100%;">注册</wd-button>
			<view class="more">
				<p>
					返回登录
				</p>
			</view>
		</view>

	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import StatusBar from '@/components/statusBar.vue';
	import NavBar from '@/components/navbar.vue'
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