<template>
	<view>
		<view class="quest _GCENTER">
			<p style="font-size: 18px;">{{data.meaning}}</p>
		</view>
		<view class="next">
			<wd-button custom-class="btn" :round="false" size="large" type="info">记错了</wd-button>
			<wd-button custom-class="btn" :round="false" size="large" type="success">记住了</wd-button>
			<!-- <uv-button @click="verify(false)" text="不认识" class="btn" style="margin-right: 5px;"></uv-button>
			<uv-button @click="verify(true)" text="认识" type="primary" class="btn" style="margin-left: 5px;"></uv-button> -->
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

<style>
	.btn {
		width: 100%;
	}

	.next {
		padding: 0 15px;
		gap: 15px;
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 60px;
		position: absolute;
		bottom: 15px;
		right: 0;
		left: 0;
		z-index: 9999;
	}

	.btn {
		width: 50%;
	}

	.quest {
		padding: 50px 0;
		font-size: $uni-font-size-title;
		font-weight: bold;
	}
</style>