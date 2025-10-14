<template>
	<view v-html="text">

	</view>
</template>

<script setup>
	import {
		ref
	} from "vue"
	const text = ref(`
	<table><tr><th><span>接続</span></th><td><span>Ｎ（の）＋いかんで</span></td><td><span>F</span></td><td><span>W</span></td></tr></table>
	`)
</script>

<style lang="scss">

</style>