<template>
	<view>
		<view>
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
		<view style="height: calc(env(safe-area-inset-bottom) + 48px);">
			<!-- 占位 -->
		</view>
		<!-- 底部导航 -->
		<view class="tab-bar">
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
		onLoad,
		onShow
	} from '@dcloudio/uni-app'
	import $http from "@/api/index.js"
	import {
		userStore
	} from "@/stores"
	import Home from '../home/home.vue';
	import Word from '../word/word.vue';
	import Self from '../self/self.vue';
	const tabbar = ref(0)
	onMounted(() => {
		userStore().setUserInfo()
	})
</script>

<style lang="scss" scoped>
	.tab-bar {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		z-index: 1;
		justify-content: space-around;
		padding: 8px 0 env(safe-area-inset-bottom) 0;
		background-color: #fff;
		border-top: 1px solid #f0f0f0;

		.tab-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;

			.tab-icon {
				font-size: 20px;
				color: #999;
			}

			.tab-text {
				font-size: 12px;
				color: #999;
				margin-top: 4px;
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
					bottom: -7px;
					left: 50%;
					transform: translateX(-50%);
					width: 18px;
					height: 3px;
					background-color: #07C160;
					border-radius: 3px;
				}
			}
		}
	}
</style>