<template>
	<view>
		<view class="wrap">
			<wd-skeleton :rowCol="[{height:'20px'},{height:'20px'},{height:'20px',width: '50%'}]" theme="paragraph"
				animation="gradient" />
			<view class="meaning">
				<view v-for="item in wordinfo.meaning">
					{{item}}
				</view>
			</view>

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

	.meaning {
		margin-top: 15px;

		>view {
			line-height: 30px;
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