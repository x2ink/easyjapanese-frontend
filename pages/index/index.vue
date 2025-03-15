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
			<scroll-view v-show="tabbar===2" scroll-y="true" class="scroll learn">
				<Message :msgTotal="msgTotal"></Message>
			</scroll-view>
			<scroll-view v-show="tabbar===3" scroll-y="true" class="scroll self">
				<Self></Self>
			</scroll-view>
		</view>
		<Tabbar :msg="msgTotal.comment_total+msgTotal.like_total" @change="tabbarChange"></Tabbar>
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
	import Community from "./pages/community/index.vue"
	import Message from "./pages/message/index.vue"
	import Home from "./pages/home/index.vue"
	import Self from "./pages/self/index.vue"
	import Tabbar from "./components/tabbar/tabbar.vue"
	import {
		userStore
	} from "@/stores"
	const tabbar = ref(1)
	const tabbarChange = (e) => {
		tabbar.value = e.value
	}
	const communityRef = ref(null)
	const msgTotal = ref({
		comment_total: 0,
		like_total: 0
	})
	const getUnread = async () => {
		const res = await $http.common.getUnread()
		msgTotal.value = res
	}
	onShow(() => {
		getUnread()
	})
	onMounted(() => {
		userStore().setUserInfo()
		// $http.user.getChartList().then(res => {
		// 	console.log(res);
		// })
		// console.log(store.state.username);
		// console.log(process.env.NODE_ENV);
	})
</script>

<style lang="scss" scoped>
	:deep(.recitebtn) {
		width: 100% !important;
	}
	:deep(.wd-tabs__nav-item) {
		font-size: 16px;
	}

	:deep(.tabs) {
		background-color: transparent!important;
		width: 250px!important;
	}

	:deep(.wd-tabs) {
		background-color: transparent!important;
	}

	:deep(.wd-tabs__nav) {
		background-color: transparent!important;
	}
	:deep(.reviewbtn) {
		color: #4D80F0 !important;
	}

	:deep(.wd-progress__outer) {
		height: 5px !important;
		border-radius: 5px !important;
	}

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