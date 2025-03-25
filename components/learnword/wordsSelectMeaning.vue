<template>
	<view>
		
	</view>
</template>
<script setup>
	import {
		ref
	} from 'vue'
	import Option from '@/components/learnword/option.vue'
	import {
		formatWordName
	} from "@/utils/common.js"
	const emits = defineEmits(['answer'])
	const answer = (e) => {
		emits("answer", e)
	}
	const props = defineProps({
		wordinfo: {
			type: Object
		}
	})
	const innerAudioContext = uni.createInnerAudioContext()
</script>

<style lang="scss" scoped>
	
</style>