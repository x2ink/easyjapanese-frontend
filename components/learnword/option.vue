<template>
	<view>
		<wd-divider>请选择你的答案</wd-divider>
		<!-- 选项 -->
		<view class="options">
			<view :key="item.text" @click="select(item.answer,index)" class="option" :class="item.class"
				v-for="item in options">
				<view class="han">蒸発</view>
				<view style="font-size: 14px;">{{item.text.join('；')}}</view>
			</view>
		</view>
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	import {
		onShow
	} from '@dcloudio/uni-app'
	const toast = useToast()
	const props = defineProps({
		data: {
			type: Array
		}
	})
	const options = ref([])
	const emits = defineEmits(['answer'])
	const done = ref(false)
	const select = (anwser, index) => {
		if (done.value) {
			return
		}
		if (anwser) {
			options.value[index].class = "success"
			toast.success(`选择正确`)
			emits("answer", true)
		} else {
			options.value[index].class = "fail"
			toast.error(`选择错误`)
			emits("answer", false)
		}
		done.value = true
	}
	onMounted(() => {
		done.value = false
		options.value = props.data.sort(() => Math.random() - 0.5).map((item) => {
			item.class = ''
			return item
		})
	})
</script>

<style lang="scss">
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
			display: flex;
			flex-direction: column;
			.han {
				font-weight: bold;
			}
		}
	}
</style>