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
		if (op.type == "dict") {
			src.value = `https://cn.bing.com/search?q=site:www.weblio.jp%20${op.word}`
		} else {
			src.value = op.src
		}
	})
</script>