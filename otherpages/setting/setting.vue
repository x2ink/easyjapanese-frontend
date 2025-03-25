<template>
	<view>
		<Navbar title="设置"></Navbar>
		<view class="cell" style="margin-top: 0;">
			<view class="cellitem" @click="setpwd()">
				<p>修改密码</p>
				<wd-icon name="chevron-right" size="20px"></wd-icon>
			</view>
			<view class="cellitem" @click="goPage('/userpages/reemail/reemail')">
				<p>更换邮箱</p>
				<view class="_GCENTER">
					<text>{{email}}</text>
				</view>
			</view>
		</view>
		<view class="cell">
			<view class="cellitem" @click="goPage('/otherpages/setplan/setplan')">
				<p>背单计划</p>
				<wd-icon name="chevron-right" size="20px"></wd-icon>
			</view>
		</view>
		<view class="cell">
			<view class="cellitem"
				@click="goPage('/otherpages/browse/browse',{src:'https://www.yuque.com/xiaoerwangluo/pteeim/ht003yxzz0egvmke'})">
				<p>服务条款&隐私协议</p>
				<wd-icon name="chevron-right" size="20px"></wd-icon>
			</view>
			<view class="cellitem" @click="goPage('mybooks')">
				<p>ICP备案号</p>
				<text>皖ICP备2024032367号-2A</text>
			</view>
		</view>
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed
	} from 'vue'
	import Navbar from '@/components/navbar/navbar.vue';
	import $http from "@/api/index.js"
	import {
		userStore
	} from "@/stores/index.js"
	import {
		goPage
	} from "@/utils/common.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	const email = computed(() => {
		if (userStore().userInfo.email == '' || userStore().userInfo.email == null) {
			return "未绑定"
		} else {
			return userStore().userInfo.email
		}
	})
	const setpwd = () => {
		if (userStore().userInfo.email == '' || userStore().userInfo.email == null) {
			toast.warning(`未绑定邮箱，无法修改密码`)
			return
		}
		goPage('/userpages/repwd/repwd', {
			email: userStore().userInfo.email
		})
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
				font-size: 14px;
				color: #999;
			}
		}
	}
</style>