<template>
	<view>
		<view class="quest _GCENTER">
			<p>{{wordinfo.word}}</p>
		</view>
		<Option ref="optionRef" @answer="answer" :data="wordinfo.kana_option"></Option>
	</view>
</template>
<script setup>
	import {
		ref
	} from 'vue'
	import Option from '@/components/learnword/option.vue'
	const props = defineProps({
		wordinfo: {
			type: Object
		}
	})
	const emits = defineEmits(['answer'])
	const answer = (e) => {
		emits("answer", e)
	}
	const optionRef = ref(null)
	const setOption = (option) => {
		optionRef.value.setOption(option)
	}
	defineExpose({
		setOption
	})
</script>

<style lang="scss" scoped>
	.quest {
		padding: 50px 0;
		font-size: $uni-font-size-subtitle;
		font-weight: bold;
	}
</style>