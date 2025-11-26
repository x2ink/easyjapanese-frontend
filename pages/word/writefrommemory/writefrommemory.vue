<template>
	<view class="head">
		<NavbarDefault border title="单词默写"></NavbarDefault>
	</view>
	<view class="progress-bar">
		<view class="progress-fill" :style="{width:`${progress}%`}"></view>
	</view>
	
	<div v-if="isBatchComplete" class="container">
		<div class="completion-icon">
			<i class="fa-solid fa-circle-check"></i>
		</div>
		<h1 class="completion-title">默写完成！</h1>
		<view class="completion-desc">
			你已经完成了本组的{{doneList.length}}个单词默写<br>
			<text v-if="serverRemaining > 0" style="font-size: 14px; color: #999; margin-top: 8px; display: block;">
				今日剩余待默写: {{serverRemaining}} 个
			</text>
			<text v-else>今日任务已全部完成，继续加油！</text>
		</view>
		<view class="button-container">
			<button v-if="serverRemaining > 0" class="primary-button" @click="getAllWords()">继续默写</button>
			<button class="secondary-button" @click="goLearn()">去学习新词</button>
		</view>
	</div>
	
	<view v-else>
		<div class="word-display">
			<div class="japanese-word">{{wordinfo.description}}</div>
			<div class="play-icon" @click="playUserRecord(wordinfo.voice)">
				<i class="fas fa-volume-up"></i>
			</div>
		</div>
		
		<div class="input-section">
			<div class="input-wrapper" :class="{'error': isError}">
				<input 
					v-model="value" 
					type="text" 
					confirm-type="done"
					@confirm="submit()"
					:disabled="showAnwser && !isError" 
					placeholder="请输入日语单词、假名或罗马音"
				/>
				<view class="keyboard-trigger" @click.stop="toggleKeyboard">
					<i class="fa-solid fa-keyboard"></i>
				</view>
				
				<view class="clear-btn" v-if="value" @click="value=''">
					<i class="fa-solid fa-circle-xmark"></i>
				</view>
			</div>
			
			<button v-if="!showAnwser" class="submit-btn" @click="submit()">确认</button>
			
			<button v-else class="continue-btn" @click="getNext()">
				继续下一个 <i class="fa-solid fa-arrow-right"></i>
			</button>
			
			<view v-if="!showAnwser" @click="giveUp()" class="look-answer">
				<text>不记得了，查看答案</text>
			</view>
		</div>

		<div v-if="showAnwser" @click="goPage('/pages/word/worddetail/worddetail',{ id:wordinfo.id })" class="word-card">
			<div class="card-header">
				<div>
					<div class="card-japanese">
						<text style="color: #07C160;">{{formatWordName(wordinfo.words,wordinfo.kana)}}</text>
					</div>
					<div class="card-pronunciation">{{wordinfo.rome}}</div>
				</div>
				<view class="icon">
					<i class="fa-solid fa-chevron-right"></i>
				</view>
			</div>
		</div>
	</view>
	
	<wd-popup v-model="showSoftKeyboard" position="bottom" safe-area-inset-bottom>
		<view class="keyboard-container">
			<view class="keyboard-header">
				<view class="keyboard-tabs">
					<text :class="{active: kbTab==='hira'}" @click="kbTab='hira'">平假名</text>
					<text :class="{active: kbTab==='kata'}" @click="kbTab='kata'">片假名</text>
				</view>
				<view class="keyboard-close" @click="showSoftKeyboard=false">完成</view>
			</view>
			
			<scroll-view scroll-y class="keyboard-body">
				<view class="key-grid">
					<view 
						class="key-btn" 
						v-for="(char, idx) in currentKeys" 
						:key="idx"
						@click="onKeyClick(char)"
					>
						{{char}}
					</view>
					<view class="key-btn action-key" @click="onKeyBackspace">
						<i class="fa-solid fa-delete-left"></i>
					</view>
				</view>
			</scroll-view>
		</view>
	</wd-popup>

	<wd-toast />
	<wd-message-box />
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'
	import {
		onLoad
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
		useToast
	} from '@/uni_modules/wot-design-uni'

	const toast = useToast()
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = false;

	const wordinfo = ref({})
	const wordList = ref([])
	const doneList = ref([])
	const value = ref('')
	
	// 状态控制
	const isBatchComplete = ref(false)
	const showAnwser = ref(false)
	const isError = ref(false) 
	
	// 软键盘相关
	const showSoftKeyboard = ref(false)
	const kbTab = ref('hira') // hira | kata
	
	// 基础五十音数据
	const hiragana = [
		'あ','い','う','え','お',
		'か','き','く','け','こ',
		'さ','し','す','せ','そ',
		'た','ち','つ','て','と',
		'な','に','ぬ','ね','の',
		'は','ひ','ふ','へ','ほ',
		'ま','み','む','め','も',
		'や','ゆ','よ','わ','を',
		'ら','り','る','れ','ろ',
		'ん','っ','ゃ','ゅ','ょ',
		'゛','゜','ー','、','。'
	]
	const katakana = [
		'ア','イ','ウ','エ','オ',
		'カ','キ','ク','ケ','コ',
		'サ','シ','ス','セ','ソ',
		'タ','チ','ツ','テ','ト',
		'ナ','ニ','ヌ','ネ','ノ',
		'ハ','ヒ','フ','ヘ','ホ',
		'マ','ミ','ム','メ','モ',
		'ヤ','ユ','ヨ','ワ','ヲ',
		'ラ','リ','ル','レ','ロ',
		'ン','ッ','ャ','ュ','ョ',
		'゛','゜','ー','、','。'
	]
	
	const currentKeys = computed(() => kbTab.value === 'hira' ? hiragana : katakana)
	
	// 统计
	const batchTotal = ref(0)
	const serverTotal = ref(0)

	const progress = computed(() => {
		if (batchTotal.value === 0) return 0
		return (doneList.value.length / batchTotal.value) * 100
	})
	
	const serverRemaining = computed(() => {
		let left = serverTotal.value - doneList.value.length
		return left < 0 ? 0 : left
	})

	const playUserRecord = (url) => {
		if(!url) return
		innerAudioContext.stop();
		innerAudioContext.src = url;
		innerAudioContext.play();
	}

	const goLearn = async () => {
		const res = await $http.word.getHomeInfo()
		if (res.data.learnnum == res.data.wordnum) {
			toast.warning("暂无新词需要学习")
		} else {
			goPage('/pages/learn/learn')
		}
	}

	const getAllWords = async () => {
		uni.showLoading({ title: '加载中' })
		try {
			const res = await $http.word.getLearnt({ filter: "write" })
			const list = res.data || []
			
			if (list.length === 0) {
				isBatchComplete.value = true
				serverTotal.value = 0
				uni.hideLoading()
				return
			}
			
			wordList.value = list
			doneList.value = []
			batchTotal.value = list.length
			serverTotal.value = res.total || list.length
			isBatchComplete.value = false
			
			getNext()
		} catch (e) {
			console.error(e)
		} finally {
			uni.hideLoading()
		}
	}

	const getNext = () => {
		if(wordList.value.length === 0) {
			isBatchComplete.value = true
			return
		}
		
		value.value = ""
		showAnwser.value = false
		isError.value = false
		// 关闭键盘以免遮挡
		showSoftKeyboard.value = false 
		wordinfo.value = wordList.value[0]
	}

	const submit = async () => {
		if (value.value.trim().length == 0) {
			toast.warning(`请输入答案`)
			return
		}
		
		const inputVal = value.value.trim()
		const targetWord = wordinfo.value
		
		// 核心判定逻辑优化：兼容 汉字、假名、罗马音(不区分大小写)
		const isKanji = targetWord.words.includes(inputVal)
		const isKana = inputVal == targetWord.kana
		const isRome = targetWord.rome && (inputVal.toLowerCase() == targetWord.rome.toLowerCase())
		
		const isCorrect = isKanji || isKana || isRome
		
		if (isCorrect) {
			// --- 答对 ---
			$http.word.setLearnt({
				type: "write",
				word_id: targetWord.id
			})
			
			doneList.value.push(targetWord)
			wordList.value.shift()
			
			toast.success("正确")
			value.value = "" 
			showSoftKeyboard.value = false
			
			setTimeout(() => {
				getNext()
			}, 500)
			
		} else {
			// --- 答错 ---
			isError.value = true
			showAnwser.value = true
			playUserRecord(targetWord.voice)
			showSoftKeyboard.value = false // 答错后收起键盘看答案
			
			const current = wordList.value.shift()
			wordList.value.push(current)
		}
	}
	
	const giveUp = () => {
		isError.value = true 
		showAnwser.value = true
		playUserRecord(wordinfo.value.voice)
		showSoftKeyboard.value = false
		
		const current = wordList.value.shift()
		wordList.value.push(current)
	}
	
	// --- 软键盘逻辑 ---
	const toggleKeyboard = () => {
		showSoftKeyboard.value = !showSoftKeyboard.value
	}
	
	const onKeyClick = (char) => {
		// 简单的浊音处理逻辑可以在这里扩展，目前简化为直接追加字符
		if (char === '゛' || char === '゜') {
			// 简单的浊音附加逻辑（可选，为了简化代码这里仅作为字符输入）
			// 如果需要复杂的浊音转换，建议引入 wanakana 库
		}
		value.value += char
	}
	
	const onKeyBackspace = () => {
		if (value.value.length > 0) {
			value.value = value.value.slice(0, -1)
		}
	}

	onLoad(op => {
		if (op.type == "local") {
			const localList = localwordsStore().writeWordList
			if(localList && localList.length > 0) {
				wordList.value = [...localList]
				batchTotal.value = localList.length
				serverTotal.value = localList.length 
				getNext()
			} else {
				isBatchComplete.value = true
			}
		} else {
			getAllWords()
		}
	})
</script>

<style lang="scss">
	page {
		background-color: white;
	}
	
	.head {
		position: sticky;
		top: 0;
		z-index: 9;
		background: white;
	}

	.progress-bar {
		height: 4px;
		background-color: #F3F4F6;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background-color: #07C160;
		transition: width 0.3s ease;
	}

	.container {
		padding: 60px 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 80vh;
	}

	.completion-icon {
		font-size: 80px;
		margin-bottom: 24px;
		color: #07C160;
	}

	.completion-title {
		font-size: 24px;
		font-weight: 700;
		color: #111827;
		margin-bottom: 12px;
	}

	.completion-desc {
		font-size: 16px;
		color: #6B7280;
		text-align: center;
		line-height: 1.6;
		margin-bottom: 60px;
	}

	/* 单词展示区 */
	.word-display {
		padding: 40px 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
	}

	.japanese-word {
		font-size: 24px;
		font-weight: bold;
		color: #111827;
		text-align: center;
	}
	
	.play-icon {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #F3F4F6;
		border-radius: 50%;
		color: #6B7280;
		
		&:active {
			background-color: #E5E7EB;
		}
	}

	/* 输入区域 */
	.input-section {
		padding: 0 20px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		border: 1px solid #E5E7EB;
		border-radius: 12px;
		padding: 4px 12px;
		background-color: #F9FAFB;
		transition: all 0.3s;
		
		&.error {
			border-color: #EF4444;
			background-color: #FEF2F2;
		}
		
		input {
			flex: 1;
			height: 48px;
			font-size: 18px;
			color: #111827;
		}
		
		.keyboard-trigger {
			padding: 8px;
			color: #6B7280;
			font-size: 20px;
			margin-right: 4px;
			&:active { color: #07C160; }
		}
		
		.clear-btn {
			padding: 8px;
			color: #9CA3AF;
		}
	}

	.submit-btn {
		background-color: #07C160;
		color: white;
		border-radius: 50px;
		font-size: 16px;
		font-weight: 600;
		height: 48px;
		line-height: 48px;
		
		&:active {
			opacity: 0.9;
		}
	}
	
	.continue-btn {
		background-color: #07C160;
		color: white;
		border-radius: 50px;
		font-size: 16px;
		font-weight: 600;
		height: 48px;
		line-height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		box-shadow: 0 4px 12px rgba(7, 193, 96, 0.25);
	}

	.look-answer {
		text-align: center;
		color: #6B7280;
		font-size: 14px;
		padding: 10px;
		text-decoration: underline;
	}

	/* 单词卡片 */
	.word-card {
		margin: 24px 20px;
		padding: 16px 20px;
		background: white;
		border: 1px solid #F3F4F6;
		border-radius: 12px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
		
		&:active {
			opacity: 0.7;
		}
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.card-japanese {
		font-size: 20px;
		font-weight: bold;
		margin-bottom: 4px;
	}

	.card-pronunciation {
		font-size: 14px;
		color: #6B7280;
	}
	
	.button-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	
	.primary-button {
		background-color: #07C160;
		color: white;
		border: none;
		border-radius: 12px;
		padding: 14px 0;
		font-size: 16px;
		font-weight: 600;
		width: 100%;
		
		&:active {
			background-color: #059669;
		}
	}
	
	.secondary-button {
		background-color: white;
		color: #07C160;
		border: 1px solid #07C160;
		border-radius: 12px;
		padding: 14px 0;
		font-size: 16px;
		font-weight: 600;
		width: 100%;
		
		&:active {
			background-color: #ECFDF5;
		}
	}
	
	/* 软键盘样式 */
	.keyboard-container {
		background-color: #F3F4F6;

	}
	
	.keyboard-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 16px;
		background: white;
		border-bottom: 1px solid #E5E7EB;
		
		.keyboard-tabs {
			display: flex;
			gap: 16px;
			font-size: 14px;
			color: #6B7280;
			
			text.active {
				color: #07C160;
				font-weight: 600;
			}
		}
		
		.keyboard-close {
			color: #07C160;
			font-weight: 600;
			padding: 4px 8px;
		}
	}
	
	.keyboard-body {
		height: 260px; /* 固定高度 */
		padding: 8px;
	}
	
	.key-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		justify-content: center;
	}
	
	.key-btn {
		width: calc(20% - 6px); /* 5列 */
		height: 44px;
		background: white;
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18px;
		color: #1F2937;
		box-shadow: 0 1px 2px rgba(0,0,0,0.1);
		
		&:active {
			background-color: #E5E7EB;
		}
		
		&.action-key {
			background-color: #E5E7EB;
			color: #4B5563;
		}
	}
</style>