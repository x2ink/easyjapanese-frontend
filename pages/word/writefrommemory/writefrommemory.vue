<template>
	<view class="head">
		<NavbarDefault border title="单词默写"></NavbarDefault>
	</view>
	<wd-progress custom-class="wdprogress" :percentage="progress" hide-text />
	<!-- 单词展示区 -->
	<div class="word-display">
		<div class="japanese-word">{{wordinfo.meaning.map(item=>item.meaning).join('；')}}</div>
	</div>
	<!-- 输入区 -->
	<div class="input-container">
		<label class="input-label">请输入日语单词或假名</label>
		<input v-model="value" type="text" placeholder="请输入答案">
		<!-- 按钮区 -->
		<button class="primary-button" @click="submit()">确认</button>
	</div>


	<div class="word-card" v-if="showAnwser">
		<div class="card-header">
			<div>
				<div class="card-japanese">{{formatWordName(wordinfo.word,wordinfo.kana)}}</div>
				<div class="card-pronunciation">{{wordinfo.rome}}</div>
			</div>
			<view @click="playUserRecord(wordinfo.voice)" class="icon">
				<text class="fas fa-volume-up"></text>
			</view>
		</div>
	</div>
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
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import $http from "@/api/index.js"
	import NavbarDefault from "@/components/navbar/default"
	import {
		goPage,
		formatWordName
	} from "@/utils/common.js"
	import {
		writefrommemoryStore
	} from "@/stores"
	import {
		useToast,
		useMessage
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	const message = useMessage()
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = false;
	const playUserRecord = (url) => {
		innerAudioContext.stop();
		innerAudioContext.src = url;
		innerAudioContext.play();
	}
	const wordinfo = ref({
		meaning: []
	})
	const wordList = ref([])
	const doneList = ref([])
	const value = ref('')
	const progress = computed(() => {
		return (doneList.value.length / total.value) * 100
	})
	const segmentation = (text) => {
		return text.match(/[\u3040-\u309F\u30A0-\u30FF][\u3099\u309A\uFF9E\uFF9F]?|./g) || [];
	}
	const getAllWords = async () => {
		const res = await $http.word.writeFromMemory({
			remove: writefrommemoryStore().wordList.map(item => item.id)
		})
		wordList.value = res.data
		total.value = wordList.value.length
		getNext()
	}
	const getNext = () => {
		value.value = ""
		showAnwser.value = false
		wordinfo.value = wordList.value[0]
	}
	const showAnwser = ref(false)
	const total = ref(0)
	const submit = () => {
		if (value.value.trim().length == 0) {
			toast.warning(`答案不可为空`)
			return
		}
		if (value.value == wordinfo.value.word || value.value == wordinfo.value.kana) {
			// 答案正确
			if (showAnwser.value) {
				wordList.value.shift()
				wordList.value.push(wordinfo.value)
			} else {
				const timestamp = new Date().setHours(0, 0, 0, 0);
				if (writefrommemoryStore().time > timestamp) {
					writefrommemoryStore().clear()
				}
				writefrommemoryStore().push(wordinfo.value)
				toast.success("答案正确")
				doneList.value.push(wordinfo.value)
				wordList.value.shift()
			}
			getNext()
		} else {
			// 答案错误
			value.value = ""
			showAnwser.value = true
			playUserRecord(wordinfo.value.voice)
			toast.error("答案错误，请重新拼写")
		}
	}
	onMounted(() => {

	})
	onLoad(op => {
		if (op.type == "local") {

		} else {
			getAllWords()
		}
	})
</script>

<style lang="scss">
	.head {
		position: sticky;
		top: 0;
		z-index: 9;
	}

	.wdprogress {
		padding: 0 !important;
	}

	.word-display {
		background-color: #FFFFFF;
		padding: 24px;
		text-align: center;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.japanese-word {
		font-size: 20px;
		font-weight: bold;
		color: #212121;
	}


	/* 输入区 */
	.input-container {
		padding: 16px;
		background-color: #FFFFFF;
		margin: 16px 0;

		input {
			flex: 1;
			padding: 12px 16px;
			border: 1px solid #E0E0E0;
			border-radius: 8px;
			font-size: 16px;
			margin-top: 16px;
		}
	}

	.input-label {
		display: block;
		font-size: 14px;
		color: #757575;
		margin-bottom: 8px;
	}



	.primary-button {
		flex: 1;
		background-color: #07C160;
		color: white;
		border: none;
		border-radius: 8px;
		padding: 12px;
		font-size: 16px;
		font-weight: 500;
		margin-top: 16px;
	}

	/* 单词卡片 (初始隐藏) */
	.word-card {
		background-color: white;
		padding: 16px;
		margin: 16px 0;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.card-japanese {
		font-size: 24px;
		font-weight: bold;
	}

	.card-pronunciation {
		font-size: 16px;
		color: #757575;
	}

	/* 图标样式 */
	.icon {
		width: 24px;
		height: 24px;
		color: #757575;
	}


</style>