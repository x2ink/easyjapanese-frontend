<template>
	<view class="wrap _BACKGROUND">
		<NavBar color="#ffffff">
		</NavBar>
		<!-- <view class="_GCENTER">
			<view class="avatarbg _GCENTER">
				<image src="/static/logo.png" mode="aspectFill"></image>
			</view>
		</view> -->
		<view class="musk center">
			「がいる」的基本结构是：名词（表示有生命的事物）&ensp;+&ensp;が&ensp;+&ensp;いる接续规则的具体示例：-&ensp;人&ensp;+&ensp;が&ensp;+&ensp;いる-&ensp;猫&ensp;+&ensp;が&ensp;+&ensp;いる
		</view>
		<view class="musk bottom">
			<view class="player">
				<text>12:12</text>
				<wd-progress :percentage="30" hide-text />
				<text>12:12</text>
			</view>
			<view class="btns">
				<wd-icon color="#ffffff" name="previous" size="40px"></wd-icon>
				<wd-icon color="#ffffff" name="pause-circle" size="40px"></wd-icon>
				<wd-icon color="#ffffff" name="next" size="40px"></wd-icon>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import NavBar from '@/components/navbar.vue'
</script>

<style scoped lang="scss">
	.bottom {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 40px;
	}

	.center {
		height: calc(100vh - 300px);
		position: absolute;
		left: 0;
		right: 0;
		color: #ffffff;
		bottom: 180px;
	}

	.avatarbg {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 580px;
		width: 180px;
		height: 180px;
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 100%;

		image {
			width: 160px;
			height: 160px;
			border-radius: 100%;
		}
	}

	.wrap {
		height: 100vh;
		background-color: #f5f5f5;
		position: relative;
		background-image: url('/static/playerbg.png');
	}

	.player {
		padding: 0 15px;
		display: flex;
		align-items: center;
		gap: 10px;

		text {
			color: #ffffff;
			font-size: 14px;
		}
	}

	.btns {
		margin-top: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 40px;
	}

	.musk {
		margin: 20px;
		border-radius: 8px;
		padding: 20px;
		background-color: rgba(255, 255, 255, 0.3);
	}
</style>