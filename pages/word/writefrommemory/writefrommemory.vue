<template>
	<Navbar title="单词默写">
	</Navbar>
	<view v-if="doneTask" class="learnsuccess">
		<wd-icon style="margin-top: 40px;" name="check-circle-filled" size="80px" color="#34D19D"></wd-icon>
		<text>单词已默写完成！</text>
	</view>
	<view v-else>
		<wd-progress :percentage="progress" hide-text />
		<view class="input">
			<wd-input custom-class="input" no-border type="text" clearable size="large" v-model="value"
				placeholder="请输入单词" />
		</view>
		<view class="body">
			<view class="meaning">单词意思</view>
		</view>
	</view>
	<!-- 	<view class="keyboard">
		<Keyboard></Keyboard>
	</view> -->
	<wd-toast />
	<wd-message-box />
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed
	} from 'vue'
	import $http from "@/api/index.js"
	import Navbar from '@/components/navbar/navbar.vue';
	import Keyboard from '@/components/keyboard/keyboard.vue';
	import {
		useToast,
		useMessage
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	const message = useMessage()
	const doneTask = ref(false)
	const wordinfo = ref({})
	const wordList = ref([])
	const total = ref(0)
	const value = ref('')
	const progress = computed(() => {
		return 100
	})
	const segmentation = (text) => {
		return text.match(/[\u3040-\u309F\u30A0-\u30FF][\u3099\u309A\uFF9E\uFF9F]?|./g) || [];
	}
	const init = async () => {
		const res = await $http.word.todayWord()
		wordList.value = res.data.map(item => {
			console.log(segmentation(item.word));
		})
		total.value = res.total
		wordinfo.value = res.data[0]
	}
	onMounted(() => {
		init()
	})

	// const value = ref('')
	// const List = ref([])
	// const current = ref(0)
	// 
	// const getInfo = (id) => {
	// 	uni.navigateTo({
	// 		url: "/pages/worddetail/worddetail?id=" + List.value[current.value].id + "&type=jc"
	// 	})
	// }

	// const doneTask = ref(false)
	// const updateStore = () => {
	// 	let index = todaylearnStore().wordList.findIndex(item => item.id == List.value[current.value].id)
	// 	List.value[current.value].done = true
	// 	todaylearnStore().update(index, List.value[current.value])
	// }
	// const nextWord = (a) => {
	// 	value.value = ''
	// 	let dele = current.value
	// 	let temp = current.value + 1
	// 	if (temp >= List.value.length - 1) {
	// 		current.value = 0
	// 	} else {
	// 		current.value = temp
	// 	}
	// 	if (a) {
	// 		List.value.splice(dele, 1)
	// 	}
	// 	if (List.value.length === 0) {
	// 		doneTask.value = true
	// 	}
	// }
	// const verify = () => {
	// 	if (value.value == List.value[current.value].kana || value.value == List.value[current.value].word) {
	// 		updateStore()
	// 		nextWord(true)
	// 	} else {
	// 		message.alert({
	// 			msg: List.value[current.value].kana == List.value[current.value].word ? List.value[current
	// 					.value].word : List.value[current.value].word + '或' +
	// 				List.value[current.value].kana,
	// 			title: '正确答案',
	// 			confirmButtonText: '继续',
	// 			closeOnClickModal: false
	// 		}).then(() => {
	// 			nextWord(false)
	// 		})
	// 	}
	// }
	// onMounted((e) => {
	// 	todaylearnStore().wordList.forEach(item => {
	// 		if (!item.done) {
	// 			List.value.unshift(item)
	// 		}
	// 	})
	// 	total.value = List.value.length
	// 	if (total.value == 0) {
	// 		doneTask.value = true
	// 	}
	// })
</script>

<style scoped lang="scss">
	
	.keyboard {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding-bottom: env(safe-area-inset-bottom);
	}

	:deep(.input) {
		text-align: center;
		border-radius: 8px;
		margin: 20px;
	}

	:deep(.wd-progress) {
		padding-top: 0px;
	}

	.learnsuccess {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 15px;
		margin-top: 40px;
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
		.meaning {
			margin-top: 20px;
			font-size: $uni-font-size-lg;
			font-weight: bold;
			text-align: center;
		}
	}
</style>