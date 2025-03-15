<template>
	<view>
		<Navbar title="设置"></Navbar>
		<view class="cell" style="margin-top: 5px;">
			<view class="cellitem" @click="goPage('repwd','?email='+userInfo.email)">
				<p>修改密码</p>
				<wd-icon name="arrow-right" size="20px"></wd-icon>
			</view>
			<view class="cellitem" @click="goPage('mybooks')">
				<p>更换邮箱</p>
				<view class="_GCENTER">
					<text style="font-size: 14px;color: #000;">{{userInfo.email}}</text>
					<wd-icon name="arrow-right" size="20px"></wd-icon>
				</view>
			</view>
			<view class="cellitem" @click="goPage('mybooks')">
				<p>注销账号</p>
				<wd-icon name="arrow-right" size="20px"></wd-icon>
			</view>
		</view>
		<view class="cell">
			<view class="cellitem" @click="goPage('mybooks')">
				<p>背单计划</p>
				<wd-icon name="arrow-right" size="20px"></wd-icon>
			</view>
		</view>
		<view class="cell">
			<view class="cellitem" @click="goPage('mybooks')">
				<p>服务条款</p>
				<wd-icon name="arrow-right" size="20px"></wd-icon>
			</view>
			<view class="cellitem" @click="goPage('mybooks')">
				<p>隐私协议</p>
				<wd-icon name="arrow-right" size="20px"></wd-icon>
			</view>
			<view class="cellitem" @click="goPage('mybooks')">
				<p>个人信息收集清单</p>
				<wd-icon name="arrow-right" size="20px"></wd-icon>
			</view>
			<view class="cellitem" @click="goPage('mybooks')">
				<p>应用权限说明</p>
				<wd-icon name="arrow-right" size="20px"></wd-icon>
			</view>
			<view class="cellitem" @click="goPage('mybooks')">
				<p>ICP备案号</p>
				<text>皖ICP备2024032367号-2A</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import Navbar from '@/components/navbar/navbar.vue';
	import $http from "@/api/index.js"
	const userInfo = ref({
		avatar: '',
		nickname: '',
		role: "",
		email: ''
	})
	import {
		userStore
	} from "@/stores/index.js"
	onMounted(() => {
		getUserInfoSimple()
	})
	const getUserInfoSimple = async () => {
		try {
			const res = await $http.user.getUserInfoSimple()
			userInfo.value = res.data
			userStore().setUserInfo(userInfo.value)
		} catch (err) {
			console.log("登录错误", err);
		}
	}
	const goPage = (path, params) => {
		if (params) {
			uni.navigateTo({
				url: `/pages/${path}/${path}${params}`
			})
		} else {
			uni.navigateTo({
				url: `/pages/${path}/${path}`
			})
		}
	}
</script>

<style scoped lang="scss">
	.cell {
		padding: 5px 15px;
		margin: 15px;
		background-color: white;
		border-radius: $uni-border-radius-base;

		.cellitem {
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 14px;

			text {
				font-size: 12px;
				color: #999;
			}
		}
	}
</style>