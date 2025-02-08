<template>
	<NavBar title="单词默写"></NavBar>
	<view v-if="doneTask" class="learnsuccess">
		<wd-icon style="margin-top: 40px;" name="check-circle-filled" size="80px" color="#34D19D"></wd-icon>
		<text>单词已默写完成！</text>
	</view>
	<view v-else>
		<wd-progress :percentage="progress" hide-text />
		<view class="body" v-if="List.length>0">
			<view class="input">
				<wd-input custom-class="input" no-border type="text" clearable size="large" v-model="value"
					placeholder="请输入单词" />
			</view>
			<view class="meaning">{{List[current].meaning}}</view>
		</view>
		<view class="next">
			<wd-button @click="getInfo" custom-class="btn" :round="false" size="large" type="info">学习</wd-button>
			<wd-button @click="verify" custom-class="btn" :round="false" size="large">继续</wd-button>
		</view>
	</view>
	<wd-toast />
	<wd-message-box />
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed
	} from 'vue'
	import {
		todaylearnStore
	} from '@/stores/index.js'
	import NavBar from '@/components/navbar.vue'
	import {
		useToast,
		useMessage
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	const message = useMessage()
	const value = ref('')
	const List = ref([])
	const current = ref(0)
	const total = ref(0)
	const getInfo = (id) => {
		uni.navigateTo({
			url: "/pages/worddetail/worddetail?id=" + List.value[current.value].id + "&type=jc"
		})
	}
	const progress = computed(() => {
		return ((total.value - List.value.length) / total.value) * 100
	})
	const doneTask = ref(false)
	const updateStore = () => {
		let index = todaylearnStore().wordList.findIndex(item => item.id == List.value[current.value].id)
		List.value[current.value].done = true
		todaylearnStore().update(index, List.value[current.value])
	}
	const nextWord = (a) => {
		value.value = ''
		let dele = current.value
		let temp = current.value + 1
		if (temp >= List.value.length - 1) {
			current.value = 0
		} else {
			current.value = temp
		}
		if (a) {
			List.value.splice(dele, 1)
		}
		if (List.value.length === 0) {
			doneTask.value = true
		}
	}
	const verify = () => {
		if (value.value == List.value[current.value].kana || value.value == List.value[current.value].word) {
			updateStore()
			nextWord(true)
		} else {
			message.alert({
				msg: List.value[current.value].kana == List.value[current.value].word ? List.value[current
						.value].word : List.value[current.value].word + '或' +
					List.value[current.value].kana,
				title: '正确答案',
				confirmButtonText: '继续',
				closeOnClickModal: false
			}).then(() => {
				nextWord(false)
			})
		}
	}
	onMounted((e) => {
		todaylearnStore().wordList.forEach(item => {
			if (!item.done) {
				List.value.unshift(item)
			}
		})
		total.value = List.value.length
		if (total.value == 0) {
			doneTask.value = true
		}
	})
</script>

<style scoped lang="scss">
	:deep(.input) {
		text-align: center;
		border-radius: 8px;
	}

	:deep(.wd-progress) {
		padding-top: 0px;
	}

	.learnsuccess {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 15px;

		justify-content: center;

		text {
			color: $uni-text-color-grey;
		}
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

		.btn {
			width: 50%;
		}

	}

	.body {
		padding: 50px;



		.meaning {
			margin-top: 20px;
			font-size: $uni-font-size-lg;
			font-weight: bold;
			text-align: center;
		}
	}
</style>