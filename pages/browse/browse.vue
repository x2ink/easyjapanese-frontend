<template>
	<view>
		<web-view :src="src" update-title></web-view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	const src = ref("")
	onLoad((op) => {
		src.value = op.src
	})
</script>