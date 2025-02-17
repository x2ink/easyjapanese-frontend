<template>
	<wd-tabbar custom-class="tabbar" v-model="tabbar" @change="(e)=>{emits('change',e)}" :zIndex="3" fixed
		safeAreaInsetBottom placeholder>
		<wd-tabbar-item title="首页" icon="home"></wd-tabbar-item>
		<wd-tabbar-item title="交流" icon="chat"></wd-tabbar-item>
		<wd-tabbar-item title="消息" :value="msg" icon="notification"></wd-tabbar-item>
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
	const props = defineProps({
		msg: {
			default: 0,
			type: Number
		}
	})
	defineExpose({
		tabbar
	})
</script>

<style scoped lang="scss">
	:deep(.tabbar) {
		height: 56px;
	}
</style>