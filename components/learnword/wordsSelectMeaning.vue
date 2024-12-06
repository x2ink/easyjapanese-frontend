<template>
	<view>
		<view class="wrap">
			<view>
				<p class="word">{{data.py==null?data.words:data.words+'('+data.py+')'}}</p>
				<wd-icon name="sound" size="25px" color="#3c9cff"></wd-icon>
			</view>
			<p class="other">{{data.rome}} {{data.words_type}}</p>
		</view>
		<wd-divider>请选择你的答案</wd-divider>
		<!-- 选项 -->
		<view class="options">
			<view class="option" :class="item.class" v-for="(item,index) in data.options">
				<p>{{noList[index]}}.{{item.meaning}}</p>
			</view>
		</view>
	</view>
</template>
<script setup>
	import {
		ref
	} from 'vue'
	const props = defineProps({
		data: {
			default: {
				py: "いとしい",
				words: "愛しい",
				rome: "itoshii",
				words_type: "【形容词/イ形容词】",
				meaning: "（小孩或恋人）可爱",
				options: [{
					class: "success",
					meaning: "这是选择的意思"
				}, {
					class: "",
					meaning: "这是选择的意思"
				}, {
					class: "",
					meaning: "这是选择的意思"
				}, {
					class: "",
					meaning: "这是选择的意思"
				}]
			},
			type: Object
		}
	})
	const noList = ref(["A", "B", "C", "D"])
	const innerAudioContext = uni.createInnerAudioContext()
</script>

<style lang="scss">
	.success {
		background-color: #34d19d !important;
		color: white;
	}

	.fail {
		background-color: #fa4350 !important;
		color: white;
	}

	.options {
		margin: 15px;
		display: flex;
		flex-direction: column;
		gap: 15px;

		.option {
			border-radius: $uni-border-radius-base;
			background-color: white;
			padding: 15px;
		}
	}

	.wrap {
		padding: 15px;

		.other {
			color: #606266;
			font-size: 14px;
		}

		>view {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.word {
				font-size: 23px;
				font-weight: 600;
			}
		}
	}
</style>