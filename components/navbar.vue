<template>
	<view class="navbar">
		<view class="left">
			<wd-icon name="thin-arrow-left" size="20px"></wd-icon>
		</view>
		<view class="center">
			{{title}}
		</view>
		<view class="right">
			<slot></slot>
		</view>
	</view>
</template>

<script setup>
	const props = defineProps({
		title: {
			default: '',
			type: String
		}
	})
</script>

<style lang="scss">
	.navbar {
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;

		.left {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			left: 10px;
		}

		.center {
			position: absolute;
			top: 50%;
			left: 50%;
			font-size: $uni-font-size-lg;
			font-weight: bold;
			transform: translate(-50%, -50%);
		}
	}
</style>