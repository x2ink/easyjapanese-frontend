<template>
	<view>
		<view class="quest _GCENTER">
			<p>{{data.meaning}}</p>
		</view>
		<wd-divider>请选择你的答案</wd-divider>
		<!-- 选项 -->
		<view class="options">
			<view :class="item.class" class="option" v-for="(item,index) in data.options">
				<p>{{noList[index]}}.{{item.word}}</p>
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
					word: "愛しい"
				}, {
					class: "",
					word: "愛しい"
				}, {
					class: "",
					word: "愛しい"
				}, {
					class: "",
					word: "愛しい"
				}]
			},
			type: Object
		}
	})
	const noList = ref(["A", "B", "C", "D"])
	const innerAudioContext = uni.createInnerAudioContext()
</script>

<style lang="scss">
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

	.quest {
		padding: 50px 0;
		font-size: $uni-font-size-title;
		font-weight: bold;
	}

	.success {
		background-color: #34d19d !important;
		color: white;
	}

	.fail {
		background-color: #fa4350 !important;
		color: white;
	}
</style>