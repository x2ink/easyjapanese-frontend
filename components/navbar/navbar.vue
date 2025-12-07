<template>
	<view class="navwrap">
		<view :style="{height:navBarHeight}"></view>
		<view class="navbar">
			<view v-if="showleft" class="left" @click="back">
				<wd-icon name="thin-arrow-left" :color="color" size="18px"></wd-icon>
				<slot name="left"></slot>
			</view>
			<view class="center" :class="{textcenter:title!==''}">
				<text class="title" v-if="title!==''">{{title}}</text>
				<slot v-else name="center"></slot>
			</view>
			<view class="right">
				<slot name="right"></slot>
			</view>
		</view>
		<view>
			<slot name="bottom"></slot>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		defineProps,
		onMounted
	} from "vue";
	const back = () => {
		uni.navigateBack({
			delta: 1
		})
	}
	const props = defineProps({
		showleft: {
			default: true,
			type: Boolean
		},
		color: {
			default: '#000000',
			type: String
		},
		title: {
			default: '',
			type: String
		}
	})
	const navBarHeight = ref(0)
	onMounted(() => {
		const systemInfo = uni.getSystemInfoSync();
		const statusBarHeight = systemInfo.statusBarHeight;
		navBarHeight.value = statusBarHeight + 'px'
	})
</script>

<style lang="scss">
	.textcenter {
		left: 50%;
		transform: translateX(-50%);
	}

	.navwrap {
		position: sticky;
		z-index: 999;
		top: 0;
		background-color: #F3F3F5;

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
				display:flex;
				gap: 5px;
				align-items: center;
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
	}
</style>