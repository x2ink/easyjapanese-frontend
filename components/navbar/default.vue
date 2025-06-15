<template>
	<!-- 顶部导航栏 -->
	<div class="navbar" :style="{paddingTop:navBarHeight}">
		<view @click="back()" class="nav-btn">
			<text class="fas fa-arrow-left"></text>
		</view>
		<div class="navbar-title">{{title}}</div>
	</div>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import $http from "@/api/index.js"
	const navBarHeight = ref(0)
	const back = () => {
		uni.navigateBack({
			delta: 1
		})
	}
	onMounted(() => {
		const systemInfo = wx.getSystemInfoSync();
		const statusBarHeight = systemInfo.statusBarHeight;
		navBarHeight.value = statusBarHeight + 'px'
	})
	const props = defineProps({
		title: {
			type: String,
			default: ""
		}
	})
</script>

<style scoped lang="scss">

	.navbar {
		background-color: white;
		height: 45px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 12px;

		.navbar-title {
			font-weight: 600;
			font-size: 18px;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
		}

		.nav-btn {
			width: 40px;
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #333;
			font-size: 18px;
		}

	}
</style>