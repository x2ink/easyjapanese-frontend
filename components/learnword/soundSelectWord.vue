<template>
	<view>
		<view class="quest _GCENTER">
			<view class="sound _GCENTER">
				<wd-icon name="sound" size="30px" color="#ffffff"></wd-icon>
			</view>
		</view>
		<Option ref="optionRef" @answer="answer" :data="wordinfo.voice_option"></Option>
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
	const innerAudioContext = uni.createInnerAudioContext()
	const setOption = (option) => {
		optionRef.value.setOption(option)
	}
	defineExpose({
		setOption
	})
</script>

<style lang="scss">
	.quest {
		padding: 50px 0;
		font-size: $uni-font-size-title;
		font-weight: bold;

		.sound {
			width: 80px;
			height: 80px;
			border-radius: 100%;
			background-color: #4D80F0;
		}
	}
</style>