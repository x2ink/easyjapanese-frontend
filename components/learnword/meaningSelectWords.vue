<template>
	<view>
		<view class="quest _GCENTER">
			<p>{{wordinfo.meaning}}</p>
		</view>
		<Option ref="optionRef" @answer="answer" :data="wordinfo.word_option"></Option>
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
	const innerAudioContext = uni.createInnerAudioContext()
	const optionRef=ref(null)
	const setOption=(option)=>{
		optionRef.value.setOption(option)
	}
	defineExpose({
		setOption
	})
</script>

<style lang="scss" scoped>
	.quest {
		padding: 50px;
		font-size: $uni-font-size-title;
		font-weight: bold;
	}

	.success {
		border: #34d19d 2px solid !important;
		background-color: #34d19d !important;
		color: white;
	}

	.fail {
		border: #fa4350 2px solid !important;
		background-color: #fa4350 !important;
		color: white;
	}

	.options {

		margin: 15px;
		display: flex;
		flex-direction: column;
		gap: 15px;

		.option {
			border: #f5f5f5 2px solid;
			border-radius: $uni-border-radius-base;
			background-color: white;
			padding: 15px;
		}
	}
</style>