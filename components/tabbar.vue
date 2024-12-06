<template>
	<wd-tabbar v-model="tabbar" @change="(e)=>{emits('change',e)}" :zIndex="3" fixed safeAreaInsetBottom placeholder>
		<wd-tabbar-item title="首页" icon="home"></wd-tabbar-item>
		<wd-tabbar-item title="交流" icon="chat"></wd-tabbar-item>
		<wd-tabbar-item title="学习" icon="video1"></wd-tabbar-item>
		<wd-tabbar-item title="我的" icon="user"></wd-tabbar-item>
	</wd-tabbar>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	const tabbar = ref(0)
	const emits = defineEmits(["change"])
	defineExpose({
		tabbar
	})
</script>

<style>
</style>