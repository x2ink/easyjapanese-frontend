<template>
	<view>
		<StatusBar></StatusBar>
		<view>
			<Home v-if="tabbar===0"></Home>
			<Community v-else-if="tabbar===1"></Community>
			<Learn v-else-if="tabbar===2"></Learn>
			<Self v-else-if="tabbar===3"></Self>
		</view>
		<wd-tabbar v-model="tabbar" fixed safeAreaInsetBottom placeholder>
			<wd-tabbar-item title="首页" icon="home"></wd-tabbar-item>
			<wd-tabbar-item title="交流" icon="chat"></wd-tabbar-item>
			<wd-tabbar-item title="学习" icon="video1"></wd-tabbar-item>
			<wd-tabbar-item title="我的" icon="user"></wd-tabbar-item>
		</wd-tabbar>
		<wd-fab type="warning" position="right-bottom">
			<template #trigger>
				<wd-badge :max="10" is-dot modelValue="12" class="wobble">
					<view class="message">
						<wd-icon name="mail" size="25px" color="#ffffff"></wd-icon>
					</view>
				</wd-badge>
			</template>
		</wd-fab>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import StatusBar from '@/components/statusBar.vue';
	import $http from "@/api/index.js"
	import Community from "./tabbar/community.vue"
	import Home from "./tabbar/home.vue"
	import Learn from "./tabbar/learn.vue"
	import Self from "./tabbar/self.vue"
	import {
		userStore
	} from "@/stores"
	const tabbar = ref(0)
	onMounted(() => {
		console.log(userStore().token);
		// $http.user.getChartList().then(res => {
		// 	console.log(res);
		// })
		// console.log(store.state.username);
		// console.log(process.env.NODE_ENV);
	})
</script>

<style lang="scss" scoped>
	:deep(.wd-fab) {
		left: inherit !important;
		top: inherit !important;
		right: 15px !important;
		bottom: calc(60px + env(safe-area-inset-bottom)) !important;
	}

	.message {
		width: 50px;
		height: 50px;
		background-color: #4D80F0;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;

	}

	.wobble {
		animation: wobble 2s infinite;
		/* 动画持续时间2秒，无限循环 */
	}

	@keyframes wobble {

		0%,
		100% {
			transform: translateX(0);
		}

		15% {
			transform: translateX(-25%) rotate(-5deg);
		}

		30% {
			transform: translateX(20%) rotate(3deg);
		}

		45% {
			transform: translateX(-15%) rotate(-3deg);
		}

		60% {
			transform: translateX(10%) rotate(2deg);
		}

		75% {
			transform: translateX(-5%) rotate(-1deg);
		}
	}
</style>