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
			<wd-skeleton style="margin-top: 15px;"
				:rowCol="[{height:'20px'},{height:'20px'},{height:'20px'},{height:'20px',width: '50%'}]"
				theme="paragraph" animation="gradient" />
		</view>
		<view class="next">
			<wd-button @click="answer(false)" custom-class="btn" :round="false" size="large" type="info">忘记了</wd-button>
			<wd-button @click="answer(true)" custom-class="btn" :round="false" size="large">认识</wd-button>
		</view>
	</view>
</template>
<script setup>
	import {
		ref
	} from 'vue'
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

	}

	.btn {
		width: 50%;
	}

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