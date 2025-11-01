<template>
	<Loading v-if="loading"></Loading>
	<view v-else>
		<view class="head">
			<NavbarDefault title="单词学习"></NavbarDefault>
		</view>
		<div v-if="doneTask" class="container">
			<div class="completion-icon">
				<i class="fa-solid fa-circle-check"></i>
			</div>

			<h1 class="completion-title">学习完成！</h1>

			<p class="completion-desc">
				你已经完成了本组的{{total}}个单词学习<br>
				坚持就是胜利，继续加油！
			</p>

			<div class="stats-container">
				<div class="stat-item">
					<div class="stat-value">{{total}}</div>
					<div class="stat-label">本组学习</div>
				</div>
				<div class="stat-item">
					<div class="stat-value">85%</div>
					<div class="stat-label">正确率</div>
				</div>
			</div>

			<div class="button-container">
				<button @click="writefrommemory()" class="primary-button">立即默写</button>
				<button @click="againLearn()" class="secondary-button">再学一组</button>
			</div>
		</div>
		<view v-else>
			<div class="progress-container">
				<div class="progress-text">
					<span>今日进度: {{learned}}/{{total}}</span>
					<span>{{progressPercent}}%</span>
				</div>
				<div class="progress-bar">
					<div class="progress-fill" :style="{width:`${progressPercent}%`}"></div>
				</div>
			</div>
			<div class="word-card">
				<button class="pronounce-btn" title="发音">
					<i class="fas fa-volume-up"></i>
				</button>
				<div class="word-header _GCENTER">
					<button v-if="wordinfo.step==2&&!showAnswer" class="pronounce-btn pronounce-header" title="发音">
						<i class="fas fa-volume-up"></i>
					</button>
					<view v-else class="_GCENTER" style="flex-direction: column;">
						<div class="word-kanji">{{wordinfo.words.join('·')}}</div>
						<div class="word-furigana">{{wordinfo.kana}}</div>
						<div class="word-romaji">{{wordinfo.rome}}</div>
					</view>
				</div>

				<view class="word-details">
					<view v-if="showAnswer" style="display: flex;flex-direction: column;gap: 12px;">
						<view class="detail-row">
							<view class="detail-label">词性</view>
							<view class="detail-content">{{wordinfo.types}}</view>
						</view>
						<view class="detail-row">
							<view class="detail-label">释义</view>
							<view class="detail-content">
								{{wordinfo.description}}
							</view>
						</view>
					</view>
					<wd-skeleton v-else theme="paragraph"
						:row-col="[
					[{width: '40px'},{width: '100%', marginLeft: '10px' }], [{width: '40px'},{width: '100%', marginLeft: '10px' }]]"></wd-skeleton>
				</view>
			</div>
			<view class="example" v-if="showAnswer||wordinfo.step==0">
				<view v-for="(item,index) in wordinfo.examples" :key="`example=${index}`">
					<view class="example-sentence">{{item.jp}}</view>
					<view v-if="showAnswer" class="example-translation">{{item.zh}}</view>
				</view>
			</view>
			<view style="height: calc(env(safe-area-inset-bottom) + 77px);">

			</view>
			<view v-if="showAnswer" class="action-buttons">
				<button v-if="know" @click="misremember()" class="action-btn dont-know-btn">
					<text class="fa-solid fa-face-sad-cry"></text>
					<text>记错了</text>
				</button>
				<button @click="getNext()" class="action-btn next-btn">
					<text class="fa-solid fa-hand-point-right"></text>
					<text>下一个</text>
				</button>
			</view>
			<view v-else class="action-buttons">
				<button @click="unknowBtn()" class="action-btn dont-know-btn">
					<text class="fa-solid fa-face-sad-cry"></text>
					<text>不认识</text>
				</button>
				<button @click="knowBtn()" class="action-btn know-btn">
					<text class="fa-solid fa-face-smile"></text>
					<text>认识</text>
				</button>
			</view>
		</view>
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed
	} from 'vue'
	import NavbarDefault from "@/components/navbar/default"
	import $http from "@/api/index.js" // 你的 $http 仍然保留
	import Loading from "@/components/loading/loading.vue"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	import {
		goPage
	} from "@/utils/common.js"
	import {
		userStore
	} from '../../../stores'

	const toast = useToast()
	const innerAudioContext = uni.createInnerAudioContext()
	innerAudioContext.autoplay = false

	// 当前单词信息
	const wordinfo = ref({
		words: [],
		tone: '',
		types: '',
		rome: '',
		kana: '',
		id: null,
		examples: [],
		description: "",
		step: 0,
		isLearned: false
	})

	const loading = ref(true)
	const doneTask = ref(false)
	const showAnswer = ref(false)
	const know = ref(false)
	const total = ref(0) // 本组目标
	const sessionStep = ref(0)
	const wordHistory = ref([])

	// 算法状态机
	const learningPhase = ref('initial') // 'initial', 'interleave_1_1', 'main_2_1'
	const interleaveCounter = ref(0) // 阶段2 (1:1) 的新词计数器 (0-4)
	const isReviewTurn = ref(true) // 阶段2 (1:1) 的开关
	const reviewTurnsLeft = ref(2) // 阶段3 (2:1) 的计数器

	// 暂存被“反转”的复习词
	const heldReviewWord = ref(null)

	// 四大队列
	const initialQueue = ref([]) // 初始 4 个新词
	const pendingNew = ref([]) // 还没学的新词
	const reviewQueue = ref([]) // 待复习词
	const learnedQueue = ref([]) // 已掌握词
	const wordList = ref([]) // 全部词记录

	onMounted(() => {
		init()
	})

	/**
	 * 初始化 (你的 uni.request 版本)
	 */
	const init = async () => {
		const {
			data
		} = await uni.request({
			url: "http://192.168.1.7:8000/test",
			method: "GET",
			header: {
				"Authorization": userStore().token
			}
		})
		const res = data
		console.log(res);

		total.value = 10 // 本组目标 10 个

		wordList.value = res.data.map(item => {
			const examples = item.detail
				.flatMap(d => d.meanings)
				.flatMap(m => m.examples)
			const types = item.detail
				.flatMap(d => d.type)
				.join(';')

			return {
				word: {
					...item,
					step: 0,
					isLearned: false,
					examples: examples,
					types: types
				},
				error: 0
			}
		})

		initialQueue.value = wordList.value.slice(0, 4)
		pendingNew.value = wordList.value.slice(4)
		loading.value = false
		getWord()
	}

	/**
	 * 获取一个新单词
	 */
	const getNewWord = () => {
		if (pendingNew.value.length > 0) {
			return pendingNew.value.shift()
		}
		return null
	}

	/**
	 * 获取一个需要复习的单词
	 */
	const getReviewWord = () => {
		if (reviewQueue.value.length > 0) {
			return reviewQueue.value.shift()
		}
		return null
	}

	/**
	 * 获取下一个单词的主逻辑 (三阶段 + 反转)
	 */
	const getWord = () => {

		if (learned.value >= total.value) {
			doneTask.value = true
			return
		}

		let temp = null;

		// --- 阶段1: 'initial' (前4个词) ---
		if (learningPhase.value === 'initial') {
			if (initialQueue.value.length > 0) {
				temp = initialQueue.value.shift();
			} else {
				learningPhase.value = 'interleave_1_1';
				isReviewTurn.value = true;
			}
		}

		// --- 阶段2: 'interleave_1_1' (R, N, R, N... 循环4次) ---
		if (learningPhase.value === 'interleave_1_1') {
			if (isReviewTurn.value) {
				temp = getReviewWord();
			} else {
				temp = getNewWord();
				if (temp) {
					interleaveCounter.value++;
				}
			}
			
			if (!temp) {
				isReviewTurn.value = !isReviewTurn.value;
				temp = isReviewTurn.value ? getReviewWord() : getNewWord();
				if (temp && !isReviewTurn.value) {
					interleaveCounter.value++;
				}
			}

			isReviewTurn.value = !isReviewTurn.value;

			if (interleaveCounter.value >= 4) {
				learningPhase.value = 'main_2_1';
				reviewTurnsLeft.value = 2;
			}
		}
		
		// --- 阶段3: 'main_2_1' (R, R, N... 循环) ---
		else if (learningPhase.value === 'main_2_1') {

			if (heldReviewWord.value) {
				temp = heldReviewWord.value;
				heldReviewWord.value = null;
				reviewTurnsLeft.value = 0;
			}
			else if (reviewTurnsLeft.value > 0) {
				const tempR1 = getReviewWord(); 
				const tempR2 = getReviewWord(); 

				if (tempR1 && tempR2) {
					temp = tempR2; 
					heldReviewWord.value = tempR1;
					reviewTurnsLeft.value = 1;
				} else if (tempR1 || tempR2) {
					temp = tempR1 || tempR2;
					reviewTurnsLeft.value = 0;
				} else {
					temp = getNewWord();
					if (temp) {
						reviewTurnsLeft.value = 2;
					}
				}
			}
			else {
				temp = getNewWord();
				if (temp) {
					reviewTurnsLeft.value = 2;
				} else {
					temp = getReviewWord();
					reviewTurnsLeft.value = 0;
				}
			}
		}

		if (!temp) {
			doneTask.value = true
			return
		}

		wordinfo.value = temp.word
		showAnswer.value = false

		wordHistory.value.push({
			step: sessionStep.value,
			word: temp.word.kana, 
			id: temp.word.id,
			wordStep: temp.word.step,
			phase: learningPhase.value
		})
		console.log(`--- 单词历史记录 (当前轮次: ${sessionStep.value}) ---`);
		console.log(wordHistory.value);
	}

	/**
	 * 答对 (逻辑不变)
	 */
	const knowBtn = () => {
		know.value = true
		showAnswer.value = true

		const temp = wordinfo.value
		const wordObj = wordList.value.find(w => w.word.id === temp.id)
		if (!wordObj) return

		wordObj.word.step++

		if (wordObj.word.step >= 3) {
			wordObj.word.isLearned = true
			learnedQueue.value.push(wordObj)
		} else {
			reviewQueue.value.push(wordObj) // 放入队尾 (FIFO)
		}
	}

	/**
	 * 🌟【修改】答错
	 */
	const unknowBtn = () => {
		know.value = false
		showAnswer.value = true

		const temp = wordinfo.value
		const wordObj = wordList.value.find(w => w.word.id === temp.id)
		if (!wordObj) return

		wordObj.word.step = 0
		wordObj.error++

		// 🌟【修改】不再使用 unshift()，而是使用 push()
		// reviewQueue.value.unshift(wordObj) // (旧代码: 导致立即重复)
		reviewQueue.value.push(wordObj)     // (新代码: 放到队尾，提供间隔)
	}

	/**
	 * 🌟【修改】记错
	 */
	const misremember = () => {
		know.value = false

		const temp = wordinfo.value
		const wordObj = wordList.value.find(w => w.word.id === temp.id)
		if (!wordObj) {
			getNext()
			return
		}

		wordObj.word.step = 0
		wordObj.error++

		wordObj.word.isLearned = false
		learnedQueue.value = learnedQueue.value.filter(i => i.word.id !== temp.id)

		// 🌟【修改】不再使用 unshift()，而是使用 push()
		// reviewQueue.value.unshift(wordObj) // (旧代码: 导致立即重复)
		reviewQueue.value.push(wordObj)     // (新代码: 放到队尾，提供间隔)

		getNext()
	}

	/**
	 * 获取下一个单词
	 */
	const getNext = () => {
		sessionStep.value++
		getWord()
	}

	/**
	 * 已掌握数量 (不变)
	 */
	const learned = computed(() => {
		return wordList.value.filter(item => item.word.isLearned).length
	})

	/**
	 * 进度百分比 (不变)
	 */
	const progressPercent = computed(() => {
		if (total.value === 0) {
			return 0
		}
		return Math.round((learned.value / total.value) * 100)
	})

	/**
	 * 播放音频 (不变)
	 */
	const playUserRecord = (url) => {
		innerAudioContext.stop()
		innerAudioContext.src = url
		innerAudioContext.play()
	}
</script>


<style scoped lang="scss">
	/* 内容容器 */
	.container {
		padding: 32px 16px;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
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

	/* 统计信息 */
	.stats-container {
		display: flex;
		justify-content: space-around;
		width: 100%;
		margin-bottom: 72px;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.stat-value {
		font-size: 20px;
		font-weight: 600;
		color: #07C160;
		margin-bottom: 4px;
	}

	.stat-label {
		font-size: 14px;
		color: #757575;
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

	.head {
		position: sticky;
		top: 0;
		z-index: 9;
	}

	.example {
		margin: 16px;
		background-color: white;
		border-radius: 12px;
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 16px;
	}

	/* 学习进度 */
	.progress-container {
		padding: 16px;
		background-color: #FAFAFA;
	}

	.progress-text {
		display: flex;
		justify-content: space-between;
		margin-bottom: 8px;
		font-size: 14px;
		color: #757575;
	}

	.progress-bar {
		height: 6px;
		background-color: #E0E0E0;
		border-radius: 3px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background-color: #07C160;
		border-radius: 3px;
		transition: width 0.3s ease;
	}

	.word-card {
		margin: 16px;
		background-color: white;
		border-radius: 12px;
		padding: 16px;
		position: relative;
	}

	.word-header {
		margin-bottom: 16px;
		flex-direction: column;
	}

	.word-kanji {
		font-size: 32px;
		font-weight: 600;
		color: #212121;
		margin-bottom: 4px;
	}

	.word-furigana {
		font-size: 18px;
		color: #757575;
		margin-bottom: 8px;
	}

	.word-romaji {
		font-size: 14px;
		color: #9E9E9E;
		margin-bottom: 8px;
	}

	.word-details {
		max-height: 500px;
		margin-top: 16px;
		border-top: 1px solid #F0F0F0;
		padding-top: 16px;
	}

	.detail-row {
		display: flex;

	}

	.detail-label {
		width: 50px;
		font-size: 14px;
		color: #757575;
		font-weight: bold;
	}

	.detail-content {
		flex: 1;
		font-size: 14px;
		color: #212121;
		font-weight: bold;
		white-space: pre-line;
	}

	.example-sentence {
		font-size: 16px;
		color: #212121;
	}

	.example-translation {
		font-size: 14px;
		color: #757575;
		margin-top: 8px;
	}

	/* 操作按钮 */
	.action-buttons {
		position: fixed;
		display: flex;
		justify-content: center;
		gap: 16px;
		left: 16px;
		right: 16px;
		bottom: 0;
		padding-bottom: calc(env(safe-area-inset-bottom) + 16px);
	}

	.action-btn {
		flex: 1;
		padding: 12px;
		border-radius: 8px;
		font-size: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}

	.dont-know-btn {
		background-color: #F44336;
		color: white;
	}

	.know-btn {
		background-color: #07C160;
		color: white;
	}

	.next-btn {
		background-color: #2196F3;
		color: white;
	}

	.pronounce-header {
		width: 60px !important;
		height: 60px !important;
		position: relative !important;
		right: 0 !important;
		top: 0 !important;
		font-size: 18px !important;
	}

	.pronounce-btn {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f0f0f0;
		border-radius: 50%;
		border: none;
		color: #555;
		font-size: 16px;
		position: absolute;
		right: 16px;
		top: 16px;
		margin: 0;
	}
</style>