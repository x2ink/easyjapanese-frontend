<template>
	<view>
		<StatusBar></StatusBar>
		<view>
			<Home v-if="tabbar===0"></Home>
			<Book v-else-if="tabbar===1"></Book>
			<Learn v-else-if="tabbar===2"></Learn>
			<Self v-else-if="tabbar===3"></Self>
		</view>
		<wd-tabbar shape="round" v-model="tabbar" fixed safeAreaInsetBottom placeholder>
			<wd-tabbar-item title="首页" icon="home"></wd-tabbar-item>
			<wd-tabbar-item title="辞书" icon="books"></wd-tabbar-item>
			<wd-tabbar-item title="学习" icon="video1"></wd-tabbar-item>
			<wd-tabbar-item title="我的" icon="user"></wd-tabbar-item>
		</wd-tabbar>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import StatusBar from '@/components/statusBar.vue';
	import store from '@/store/index.js';
	import $http from "@/api/index.js"
	import Book from "./tabbar/book.vue"
	import Home from "./tabbar/home.vue"
	import Learn from "./tabbar/learn.vue"
	import Self from "./tabbar/self.vue"
	const tabbar = ref(0)
	onMounted(() => {
		// $http.user.getChartList().then(res => {
		// 	console.log(res);
		// })
		// console.log(store.state.username);
		// console.log(process.env.NODE_ENV);
	})
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>