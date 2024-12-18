<template>
	<view class="navbar">
		<view class="left" @click="back">
			<wd-icon name="thin-arrow-left" size="20px"></wd-icon>
		</view>
		<view class="center" :class="{textcenter:title!==''}">
			<text class="title" v-if="title!==''">{{title}}</text>
			<slot v-else name="center"></slot>
		</view>
		<view class="right">
			<slot name="right"></slot>
		</view>
	</view>
</template>

<script setup>
	const back = () => {
		uni.navigateBack({
			delta: 1
		})
	}
	const props = defineProps({
		title: {
			default: '',
			type: String
		}
	})
</script>

<style lang="scss">
	.textcenter {
		left: 50%;
		transform: translateX(-50%);
	}

	.navbar {
		height: 45px;
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

		.right {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			right: 10px;
		}

		.center {
			transform: translateY(-50%);
			position: absolute;
			top: 50%;
			left: 30px;
			right: 10px;

			.title {
				margin-left: 10px;
				font-size: $uni-font-size-lg;
				font-weight: bold;
			}
		}
	}
</style>