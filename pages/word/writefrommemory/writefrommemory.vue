<template>
	<view class="head">
		<NavbarDefault border title="单词默写"></NavbarDefault>
	</view>
	<wd-progress custom-class="wdprogress" :percentage="progress" hide-text />
	<div v-if="wordList.length==0" class="container">
		<!-- 完成图标 -->
		<div class="completion-icon">
			<i class="fa-solid fa-circle-check"></i>
		</div>
		<!-- 完成标题 -->
		<h1 class="completion-title">默写完成！</h1>
		<!-- 完成描述 -->
		<p class="completion-desc">
			你已经完成了本组的{{doneList.length}}个单词默写<br>
			坚持就是胜利，继续加油！
		</p>
		<!-- 按钮组 -->
		<div class="button-container">
			<button class="primary-button" @click="getAllWords()">继续默写</button>
			<button class="secondary-button" @click="goLearn()">再学一组</button>
		</div>
	</div>
	<view v-else>
		<!-- 单词展示区 -->
		<div class="word-display">
			<div class="japanese-word">{{wordinfo.meaning.map(item=>item.meaning).join('；')}}</div>
		</div>
		<!-- 输入区 -->
		<div class="input-container">
			<label class="input-label">请输入日语单词或假名</label>
			<input v-model="value" type="text" placeholder="请输入答案">
			<!-- 按钮区 -->
			<button class="primary-button" @click="submit()">提交答案</button>
			<view @click="showEye()" class="look-answer">
				<text>查看答案</text>
				<i style="margin-left: 4px;" :class="`${answerShow?'fa-eye-slash':'fa-eye'}`"
					class="fa-solid"></i>
			</view>
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
		localwordsStore
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
	const goLearn = async () => {
		const res = await $http.word.getHomeInfo()
		if (res.data.learnnum == res.data.wordnum) {
			toast.warning("没有需要学习的单词了")
		} else {
			goPage('/pages/learn/learn/learn')
		}
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

	const getAllWords = async () => {
		const res = await $http.word.getTodaywords({
			filter: localwordsStore().writeList.map(item => item.id),
			type: "write"
		})
		if (res.data.length == 0) {
			toast.warning("今日没有单词需要默写了")
			return
		}
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
				if (localwordsStore().time > timestamp) {
					localwordsStore().clear()
				}
				localwordsStore().pushWrite(wordinfo.value)
				toast.success("答案正确")
				doneList.value.push(wordinfo.value)
				wordList.value.shift()
			}
			getNext()
		} else {
			// 答案错误
			showAnwser.value = true
			playUserRecord(wordinfo.value.voice)
			toast.error("答案错误，请重新拼写")
		}
		value.value = ""
	}
	const answerShow = ref(false)
	const showEye = () => {
		answerShow.value = !answerShow.value
		showAnwser.value = !showAnwser.value
		playUserRecord(wordinfo.value.voice)
	}
	onLoad(op => {
		if (op.type == "local") {
			wordList.value = localwordsStore().localWritefrommemory
			total.value = wordList.value.length
			getNext()
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

	.look-answer {
		text-align: center;
		color: #07C160;
		margin-top: 16px;
	}

	/* 内容容器 */
	.container {
		padding: 32px 16px;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	/* 按钮容器 */
	.button-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 16px;
		margin-top: auto;
		margin-bottom: 40px;
	}

	/* 主按钮 */
	.primary-button {
		background-color: #07C160;
		color: white;
		border: none;
		border-radius: 8px;
		padding: 12px 0;
		font-size: 16px;
		font-weight: 500;
		width: 100%;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.primary-button:hover {
		background-color: #06AD56;
	}

	/* 次按钮 */
	.secondary-button {
		background-color: white;
		color: #07C160;
		border: 1px solid #07C160;
		border-radius: 8px;
		padding: 12px 0;
		font-size: 16px;
		font-weight: 500;
		width: 100%;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.secondary-button:hover {
		background-color: #F5F5F5;
	}

	.wdprogress {
		padding: 0 !important;
	}

	/* 完成图标 */
	.completion-icon {
		margin-top: 40px;
		font-size: 70px;
		margin-bottom: 20px;
		color: #07C160;
	}

	/* 完成标题 */
	.completion-title {
		font-size: 24px;
		font-weight: 600;
		color: #212121;
		margin-bottom: 12px;
		text-align: center;
	}

	/* 完成描述 */
	.completion-desc {
		font-size: 16px;
		color: #757575;
		text-align: center;
		margin-bottom: 48px;
		line-height: 1.5;
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