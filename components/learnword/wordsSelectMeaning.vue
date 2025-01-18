<template>
	<view>
		<view class="wrap">
			<view>
				<p class="word">{{wordinfo.kana==wordinfo.word?wordinfo.word:wordinfo.word+'('+wordinfo.kana+')'}}</p>
			</view>
			<p class="other">{{wordinfo.rome}}</p>
			<view class="tools">
				<view class="item">
					<text>发音</text>
					<wd-icon name="sound" size="14px"></wd-icon>
				</view>
			</view>
		</view>
		<Option ref="optionRef" @answer="answer" :data="wordinfo.meaning_option"></Option>
	</view>
</template>
<script setup>
	import {
		ref
	} from 'vue'
	import Option from '@/components/learnword/option.vue'
	const emits = defineEmits(['answer'])
	const answer = (e) => {
		emits("answer", e)
	}
	const props = defineProps({
		wordinfo: {
			type: Object
		}
	})
	const optionRef = ref(null)
	const innerAudioContext = uni.createInnerAudioContext()
	const setOption = (option) => {
		optionRef.value.setOption(option)
	}
	defineExpose({
		setOption
	})
</script>

<style lang="scss" scoped>
	.tools {
		display: flex;
		margin-top: 5px;
		gap: 10px;

		>.item {

			display: flex;
			align-items: center;
			justify-content: center;
			gap: 2px;
			padding: 3px 10px;
			color: white;
			border-radius: 18px;

			&:nth-of-type(1) {
				background-color: #5880F2;
			}

			&:nth-of-type(2) {
				background-color: #5880F2;
			}

			text {
				font-size: $uni-font-size-sm;
			}
		}
	}



	.wrap {
		padding: 15px;

		.other {
			color: #606266;
			font-size: 14px;
			margin: 10px 0;
		}

		>view {

			.word {
				font-size: 23px;
				font-weight: 600;
			}
		}
	}
</style>