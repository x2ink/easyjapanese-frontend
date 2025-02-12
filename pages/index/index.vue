<template>
	<view>
		<view class="swiper">
			<scroll-view v-show="tabbar===0" scroll-y="true" class="scroll home">
				<Home></Home>
			</scroll-view>
			<scroll-view @scrolltolower="communityRef.loadMore()" v-show="tabbar===1" scroll-y="true"
				class="scroll community">
				<Community ref="communityRef"></Community>
			</scroll-view>
	<!-- 		<scroll-view v-show="tabbar===2" scroll-y="true" class="scroll learn">
				<Learn></Learn>
			</scroll-view> -->
			<scroll-view v-show="tabbar===2" scroll-y="true" class="scroll self">
				<Self></Self>
			</scroll-view>
		</view>
		<Tabbar @change="tabbarChange"></Tabbar>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import StatusBar from '@/components/statusBar.vue';
	import $http from "@/api/index.js"
	import Community from "./tabbar/community.vue"
	import Home from "./tabbar/home.vue"
	import Learn from "./tabbar/learn.vue"
	import Self from "./tabbar/self.vue"
	import Tabbar from "@/components/tabbar.vue"
	import {
		userStore
	} from "@/stores"
	const tabbar = ref(0)
	const tabbarChange = (e) => {
		tabbar.value = e.value
	}
	const communityRef = ref(null)
	onMounted(() => {
		// $http.user.getChartList().then(res => {
		// 	console.log(res);
		// })
		// console.log(store.state.username);
		// console.log(process.env.NODE_ENV);
	})
</script>

<style lang="scss" scoped>
	.swiper {
		width: 100%;
		height: calc(100vh - 50px - env(safe-area-inset-bottom));
		.scroll {
			height: 100%;
		}
	}

	:deep(.wd-fab) {
		left: inherit !important;
		top: inherit !important;
		right: 15px !important;
		bottom: calc(80px + env(safe-area-inset-bottom)) !important;
	}
</style>