<template>
	<view>
		<view :style="{height: `${getOs()=='ios'?'calc(100vh - env(safe-area-inset-bottom) - 106rpx)':'calc(100vh - 130rpx)'}`}">
			<scroll-view v-show="tabbar===0" scroll-y="true" class="scroll">
				<Home></Home>
			</scroll-view>
			<scroll-view v-show="tabbar===1" scroll-y="true" class="scroll">
				<Word></Word>
			</scroll-view>
			<scroll-view v-show="tabbar===2" scroll-y="true" class="scroll">
				<Self></Self>
			</scroll-view>
		</view>
		<!-- 底部导航 -->
		<view :class="`${getOs()=='ios'?'ios-bar':'and-bar'}`" class="tab-bar">
			<view @click="tabbar=0" :class="{active:tabbar==0}" class="tab-item">
				<text class="icon-home tab-icon fas fa-home"></text>
				<text class="tab-text">首页</text>
			</view>
			<view @click="tabbar=1" :class="{active:tabbar==1}" class="tab-item">
				<text class="icon-book tab-icon fas fa-book"></text>
				<text class="tab-text">单词</text>
			</view>
			<view @click="tabbar=2" :class="{active:tabbar==2}" class="tab-item">
				<text class="icon-user tab-icon fas fa-user"></text>
				<text class="tab-text">我的</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		userStore
	} from "@/stores"
	import {
		getOs
	} from "@/utils/common.js"
	import Home from '../home/home.vue';
	import Word from '../word/word.vue';
	import Self from '../self/self.vue';
	const tabbar = ref(0)
	onMounted(() => {
		userStore().setUserInfo()
	})
</script>

<style lang="scss" scoped>
	.scroll{
		height: 100%;
	}
	.and-bar{
		padding: 24rpx 0;
	}
	.ios-bar{
		padding: 24rpx 0 env(safe-area-inset-bottom);
	}
	.tab-bar {
		position: fixed;
		bottom: 0;
		height: 80rpx;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-around;
		background-color: #fff;
		border-top: 2rpx solid #f0f0f0;
		.tab-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;

			.tab-icon {
				font-size: 40rpx;
				color: #999;
			}

			.tab-text {
				font-size: 24rpx;
				color: #999;
				margin-top: 8rpx;
			}

			&.active {

				.tab-icon,
				.tab-text {
					color: #07C160;
				}

				position: relative;

				&::after {
					content: '';
					position: absolute;
					bottom: -14rpx;
					left: 50%;
					transform: translateX(-50%);
					width: 36rpx;
					height: 6rpx;
					background-color: #07C160;
					border-radius: 6rpx;
				}
			}
		}
	}
</style>