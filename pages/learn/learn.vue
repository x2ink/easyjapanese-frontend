<template>
	<scroll-view scroll-y="true" class="page-scroll">
		<Loading v-if="loading"></Loading>
		<view v-else class="main-container">
			<view class="head">
				<NavbarDefault :title="`单词${typeTitle}`"></NavbarDefault>
			</view>

			<view v-if="doneTask" class="content-wrapper done-wrapper">
				<view class="completion-icon">
					<i class="fas fa-circle-check"></i>
				</view>
				<h1 class="completion-title">{{typeTitle}}完成！</h1>
				<p class="completion-desc">
					你已经完成了本组的{{total}}个单词{{typeTitle}}<br>
					坚持就是胜利，继续加油！
				</p>

				<view class="stats-block">
					<view class="stat-item">
						<view class="stat-value">{{total}}</view>
						<view class="stat-label">本组{{typeTitle}}</view>
					</view>
					<view class="stat-divider"></view>
					<view class="stat-item">
						<view class="stat-value">{{rightPercentage}}%</view>
						<view class="stat-label">正确率</view>
					</view>
				</view>

				<view class="button-container">
					<button @click="writefrommemory()" class="primary-button">立即默写</button>
					<button @click="init(learnType, true)" class="secondary-button">再来一组</button>
				</view>
			</view>

			<view v-else class="content-wrapper">
				<view class="progress-container">
					<view class="progress-text">
						<span>今日进度: {{learned}}/{{total}}</span>
						<span>{{progressPercent}}%</span>
					</view>
					<view class="progress-bar">
						<view class="progress-fill" :style="{width:`${progressPercent}%`}"></view>
					</view>
				</view>

				<view class="content-block word-block">
					<button v-if="showAnswer || (wordinfo.step < 2)" @click="playUserRecord(wordinfo.voice)"
						class="pronounce-btn" title="发音">
						<i class="fas fa-volume-up"></i>
					</button>

					<view class="word-header-container">
						<view v-if="!showAnswer && quizType === 'kana'" class="definition-question">
							<view class="question-label">请选择对应的假名</view>
							<view class="question-content">{{wordinfo.description}}</view>
						</view>

						<view v-else-if="!showAnswer && quizType === 'meaning'" class="audio-block"
							@click="playUserRecord(wordinfo.voice)">
							<view class="play-icon-wrapper">
								<text class="fas fa-volume-up"></text>
							</view>
							<view class="audio-hint">点击播放发音</view>
						</view>

						<view v-else class="word-text-group">
							<view class="word-kanji">{{wordinfo.words.join('·')}}</view>
							<view class="word-furigana">{{wordinfo.kana}}</view>
							<view class="word-romaji">{{wordinfo.rome}}</view>
						</view>
					</view>

					<view class="word-details">
						<view v-if="showAnswer" class="detail-list">
							<view class="detail-row">
								<view class="detail-tag">词性</view>
								<view class="detail-content">{{wordinfo.types}}</view>
							</view>
							<view class="detail-row">
								<view class="detail-tag">释义</view>
								<view class="detail-content">
									{{wordinfo.description}}
								</view>
							</view>
						</view>
						<wd-skeleton v-else-if="options.length === 0" theme="paragraph"
							:row-col="[[{width: '80rpx'},{width: '100%', marginLeft: '20rpx' }], [{width: '80rpx'},{width: '100%', marginLeft: '20rpx' }]]"></wd-skeleton>
					</view>
				</view>

				<view v-if="options.length > 0" class="options-container">
					<view class="divider-wrap" v-if="!showAnswer">
						<wd-divider>请选择正确答案</wd-divider>
					</view>
					<view class="options">
						<view :class="['option-item', item.class]" @click="select(index,item)"
							v-for="(item,index) in options" :key="index">
							<view class="index-tag">
								{{optionKey.get(index)}}
							</view>

							<view class="option-content">
								<template v-if="quizType === 'kana'">
									{{item.word.kana}}
								</template>
								<template v-else-if="quizType === 'meaning'">
									{{item.word.description}}
								</template>
							</view>

							<view v-if="item.class=='fail'" class="status-icon fail">
								<text class="fas fa-xmark"></text>
							</view>
							<view v-if="item.class=='success'" class="status-icon success">
								<text class="fas fa-check"></text>
							</view>
						</view>
					</view>
				</view>

				<view class="content-block example-block" v-if="showAnswer||wordinfo.step==0">
					<view class="block-label">
						<i class="fas fa-quote-left"></i> 例句
					</view>
					<view class="example-item"
						@click="playUserRecord(`https://jpx2ink.oss-cn-shanghai.aliyuncs.com/audio/dict/jc/${wordinfo.id}/${item.voice}`)"
						v-for="(item,index) in wordinfo.examples" :key="`example=${index}`">
						<view class="example-sentence" v-html="renderRubyHTMLWeb(item.read)"></view>
						<view v-if="showAnswer" class="example-translation">{{item.zh}}</view>
					</view>
				</view>

				<view v-if="showAnswer" @click="goPage('/pages/word/worddetail/worddetail',{
					id:wordinfo.id
				})" class="search-link">
					查看完整词典详情 <i class="fas fa-chevron-right"></i>
				</view>

				<view class="safe-area-spacer"></view>
				<view v-if="showAnswer" class="action-bar">
					<button v-if="know && options.length === 0" @click="misremember()" class="action-btn btn-warning">
						<text>记错了</text>
					</button>
					<button @click="getNext()" class="action-btn btn-primary"
						:style="{flex: options.length > 0 ? 1 : ''}">
						<text>下一个</text>
					</button>
				</view>
				<view v-else class="action-bar">
					<template v-if="options.length === 0">
						<button @click="unknowBtn()" class="action-btn btn-danger">
							<text>不认识</text>
						</button>
						<button @click="knowBtn()" class="action-btn btn-success">
							<text>认识</text>
						</button>
					</template>
				</view>
			</view>
			<!-- 手写板 -->
			<view @click="openWriteBoard" class="write-btn _GCENTER">
				<view>
					<text class="fas fa-pen"></text>
					<view>手写</view>
				</view>
			</view>
		</view>
	</scroll-view>
	<wd-toast />
	<!-- 手写板 -->
	<view :style="{zIndex:boardShow?99:-1}" class="drawingboard">
		<l-signature disableScroll :minLineWidth="8" ref="signatureRef" penColor="black" :penSize="15"
			:openSmooth="true"></l-signature>
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		watch
	} from 'vue'
	import NavbarDefault from "@/components/navbar/default"
	import $http from "@/api/index.js"
	import Loading from "@/components/loading/loading.vue"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	import {
		goPage
	} from "@/utils/common.js"
	import {
		userStore,
		localwordsStore
	} from '@/stores'
	import {
		onLoad,
		onUnload
	} from "@dcloudio/uni-app"
	onUnload(() => {
		if (innerAudioContext) {
			innerAudioContext.stop()
			innerAudioContext.destroy()
		}
	})
	// 手写板
	const boardShow = ref(false)
	const signatureRef = ref(null)
	const openWriteBoard = () => {
		signatureRef.value.clear()
		boardShow.value = !boardShow.value
	}

	const WINDOW_SIZE = 6
	const MIN_BUFFER = 4
	const MAX_ERROR_TOLERANCE = 3
	const MAX_SESSION_LEARN = 10

	const optionKey = new Map([
		[0, 'A'],
		[1, 'B'],
		[2, 'C'],
		[3, 'D']
	])

	const renderRubyHTMLWeb = (rubyList) => {
		return rubyList.map(item => `<ruby>${item.base}<rt>${item.ruby}</rt></ruby>`).join('');
	}
	const toast = useToast()
	const innerAudioContext = uni.createInnerAudioContext()
	innerAudioContext.autoplay = false

	const playUserRecord = (url) => {
		if (!url) return;
		innerAudioContext.stop()
		innerAudioContext.src = url
		innerAudioContext.play()
	}

	const writefrommemory = () => {
		localwordsStore().setWriteWordList(queueCompleted.value.map(item => item.word))
		goPage('/pages/word/writefrommemory/writefrommemory', {
			type: 'local'
		})
	}


	const loading = ref(true)
	const doneTask = ref(false)
	const showAnswer = ref(false)
	const know = ref(false)
	const total = ref(0)
	const sessionStep = ref(0)
	const learnType = ref('learn')
	const lastWordId = ref(null)

	const options = ref([]) // 选择题选项
	const quizType = ref('') // 'kana' | 'meaning'

	const wordList = ref([])
	const queuePending = ref([])
	const queueActive = ref([])
	const queueHard = ref([])
	const queueCompleted = ref([])

	const nextShouldBeNew = ref(true)

	const qualityMap = ref(new Map([
		[0, 5],
		[1, 4],
		[2, 3],
		[3, 2],
		[4, 1]
	]))

	const wordinfo = ref({
		words: [],
		tone: '',
		types: '',
		rome: '',
		kana: '',
		voice: '',
		id: null,
		examples: [],
		description: "",
		step: 0,
		isLearned: false
	})
	const currentItem = ref(null)

	// Step 2 (看义选假名) 时不自动播放，防止泄题
	watch(() => wordinfo.value.id, (newVal) => {
		if (newVal && wordinfo.value.step !== 2) playUserRecord(wordinfo.value.voice)
	})

	const typeTitle = computed(() => learnType.value == "learn" ? "学习" : "复习")

	const rightPercentage = computed(() => {
		if (sessionStep.value === 0) return 100;
		const totalError = wordList.value.reduce((sum, item) => sum + (item.error || 0), 0)
		const correctCount = Math.max(0, sessionStep.value - totalError)
		return Math.round((correctCount / sessionStep.value) * 100)
	})

	const learned = computed(() => queueCompleted.value.length)
	const progressPercent = computed(() => total.value === 0 ? 0 : Math.round((learned.value / total.value) * 100))

	onLoad((e) => {
		init(e.type, false)
	})

	const resetAlgorithmState = () => {
		sessionStep.value = 0
		lastWordId.value = null
		nextShouldBeNew.value = true
		wordList.value = []
		queuePending.value = []
		queueActive.value = []
		queueHard.value = []
		queueCompleted.value = []
		showAnswer.value = false
		doneTask.value = false
		options.value = []
		quizType.value = ''
	}

	const init = async (type, forceRefresh = false) => {
		learnType.value = type
		loading.value = true

		const store = localwordsStore()
		let cache = type == "learn" ? store.learnCache : store.reviewCache

		const hasCache = cache && cache.wordList && cache.wordList.length > 0;

		if (hasCache && !forceRefresh) {
			console.log("恢复现场：从缓存加载");
			loadFromCache(cache)
		} else {
			console.log("新任务：网络加载");
			const apiCall = type == "learn" ? $http.word.learnWord : $http.word.getReview;
			const clearFunc = type == "learn" ? store.clearLearnCache : store.clearReviewCache;

			resetAlgorithmState()
			clearFunc()

			const res = await apiCall()

			let rawData = []
			if (Array.isArray(res.data)) {
				rawData = res.data
			} else if (res.data && Array.isArray(res.data.data)) {
				rawData = res.data.data
			}

			wordList.value = rawData.map(item => {
				const examples = item.detail.flatMap(d => d.meanings).flatMap(m => m.examples)
				const types = item.detail.flatMap(d => d.type).join(';')
				return {
					word: {
						...item,
						step: 0,
						isLearned: false,
						examples: examples,
						types: types
					},
					error: 0,
					consecutiveError: 0,
					submitted: false
				}
			})

			total.value = Math.min(wordList.value.length, MAX_SESSION_LEARN)
			queuePending.value = [...wordList.value]

			if (total.value === 0) {
				doneTask.value = true
			} else {
				getWord()
			}
		}
		loading.value = false
	}

	const loadFromCache = (cache) => {
		wordList.value = cache.wordList || []
		doneTask.value = cache.doneTask || false
		sessionStep.value = cache.sessionStep || 0
		total.value = cache.total || wordList.value.length
		nextShouldBeNew.value = cache.nextShouldBeNew ?? true
		showAnswer.value = cache.showAnswer || false
		know.value = cache.know || false
		lastWordId.value = cache.lastWordId || null
		quizType.value = cache.quizType || ''

		const link = (list) => list.map(i => wordList.value.find(w => w.word.id === i.word.id)).filter(i => i)
		queuePending.value = link(cache.queuePending || [])
		queueActive.value = link(cache.queueActive || [])
		queueCompleted.value = link(cache.queueCompleted || [])
		queueHard.value = link(cache.queueHard || [])

		if (lastWordId.value) {
			const target = wordList.value.find(i => i.word.id === lastWordId.value)
			if (target) {
				currentItem.value = target
				wordinfo.value = target.word
				// 恢复时重新获取选项
				if (wordinfo.value.step >= 2) {
					getOptions(wordinfo.value.id)
				}
			}
		} else if (cache.wordinfo && cache.wordinfo.id) {
			const target = wordList.value.find(i => i.word.id === cache.wordinfo.id)
			if (target) {
				currentItem.value = target
				wordinfo.value = target.word
				if (wordinfo.value.step >= 2) {
					getOptions(wordinfo.value.id)
				}
			}
		}
	}

	const writeCache = () => {
		const cache = {
			wordinfo: wordinfo.value,
			doneTask: doneTask.value,
			showAnswer: showAnswer.value,
			know: know.value,
			sessionStep: sessionStep.value,
			lastWordId: lastWordId.value,
			nextShouldBeNew: nextShouldBeNew.value,
			queuePending: queuePending.value,
			queueActive: queueActive.value,
			queueCompleted: queueCompleted.value,
			queueHard: queueHard.value,
			wordList: wordList.value,
			total: total.value,
			quizType: quizType.value
		}

		if (learnType.value == "learn") {
			localwordsStore().setLearnTime(new Date().getTime())
			localwordsStore().setLearnCache(cache)
		} else {
			localwordsStore().setReviewTime(new Date().getTime())
			localwordsStore().setReviewCache(cache)
		}
	}

	const getWord = () => {
		if (queueCompleted.value.length >= total.value && total.value > 0) {
			finishTask()
			return
		}

		if (queuePending.value.length === 0 && queueActive.value.length === 0 && queueHard.value.length === 0) {
			finishTask()
			return
		}

		let nextItem = null
		let source = ''
		let reason = ''

		const activeCount = queueActive.value.length
		const pendingCount = queuePending.value.length

		if (activeCount >= WINDOW_SIZE) {
			source = 'review'
			reason = '书桌已满'
		} else if (activeCount < MIN_BUFFER) {
			if (pendingCount > 0) {
				source = 'new'
				reason = '补充新词'
			} else if (queueHard.value.length > 0) {
				source = 'rescue'
				reason = '复活难词'
			} else {
				source = 'review'
				reason = '最后冲刺'
			}
		} else {
			source = nextShouldBeNew.value ? 'new' : 'review'
			if (source === 'new' && pendingCount === 0) {
				source = queueHard.value.length > 0 ? 'rescue' : 'review'
			}
		}

		if (source === 'new') {
			nextItem = queuePending.value.shift()
			nextShouldBeNew.value = false
		} else if (source === 'rescue') {
			nextItem = queueHard.value.shift()
			nextItem.consecutiveError = 0
			queueActive.value.push(nextItem)
			nextItem = queueActive.value.pop()
			nextShouldBeNew.value = false
		} else {
			nextItem = queueActive.value.shift()
			if (nextItem && nextItem.word.id === lastWordId.value && queueActive.value.length > 0) {
				queueActive.value.push(nextItem)
				nextItem = queueActive.value.shift()
				reason += '(防连续)'
			}
			nextShouldBeNew.value = true
		}

		console.log(
			`[调度] ${source === 'new' ? '🆕' : (source === 'rescue' ? '🚑' : '🔄')} ${nextItem?.word?.words ? nextItem.word.words.join('·') : 'End'} | ${reason}`
		);

		if (!nextItem) {
			finishTask()
			return
		}

		currentItem.value = nextItem
		wordinfo.value = nextItem.word
		lastWordId.value = nextItem.word.id

		showAnswer.value = false
		know.value = false
		options.value = [] // 重置选项
		quizType.value = ''

		// 判断阶段，请求选项
		if (wordinfo.value.step == 2) {
			quizType.value = 'kana' // 选假名
			getOptions(wordinfo.value.id)
		} else if (wordinfo.value.step == 3) {
			quizType.value = 'meaning' // 选释义
			getOptions(wordinfo.value.id)
		}

		writeCache()
	}

	const finishTask = () => {
		doneTask.value = true
		if (learnType.value == "learn") localwordsStore().clearLearnCache()
		else localwordsStore().clearReviewCache()
	}

	const knowBtn = () => {
		know.value = true
		showAnswer.value = true
		if (currentItem.value) {
			currentItem.value.word.step += 1
			currentItem.value.consecutiveError = 0
		}
		writeCache()
	}

	const unknowBtn = () => {
		know.value = false
		showAnswer.value = true
		if (currentItem.value) {
			currentItem.value.word.step = 0
			currentItem.value.error += 1
			currentItem.value.consecutiveError += 1
		}
		writeCache()
	}

	const misremember = () => {
		if (currentItem.value) {
			currentItem.value.word.step = 0
			currentItem.value.error += 1
			currentItem.value.consecutiveError += 1
		}
		know.value = false
		getNext()
	}

	const getNext = async () => {
		const item = currentItem.value
		if (!item) return

		// 完成判定：Step >= 4 (0, 1, 2, 3 都过)
		if (item.word.step >= 4) {
			if (!queueCompleted.value.find(i => i.word.id === item.word.id)) {
				queueCompleted.value.push(item)
			}
			if (!item.submitted) {
				try {
					await $http.word.submitWord({
						word_id: item.word.id,
						quality: qualityMap.value.get(item.error) || 1
					})
					item.submitted = true
				} catch (e) {
					console.error(e)
				}
			}
		} else {
			if (know.value) {
				queueActive.value.push(item)
			} else {
				if (item.consecutiveError >= MAX_ERROR_TOLERANCE) {
					if (queuePending.value.length > 0) {
						queueHard.value.push(item)
						toast.show({
							message: '太难了？换个词先试试！'
						})
					} else {
						insertToPenaltyPosition(item)
					}
				} else {
					insertToPenaltyPosition(item)
				}
			}
		}

		sessionStep.value++
		getWord()
	}

	const insertToPenaltyPosition = (item) => {
		const len = queueActive.value.length
		const minIdx = 2
		const maxIdx = 4
		let insertIndex = len <= minIdx ? len : Math.floor(Math.random() * (Math.min(len, maxIdx) - minIdx + 1)) +
			minIdx
		queueActive.value.splice(insertIndex, 0, item)
	}

	// 获取选项
	const getOptions = async (id) => {
		try {
			const res = await $http.word.getListenOptions({
				wordId: id
			})
			options.value = res.data
		} catch (e) {
			console.error(e)
			toast.error("选项加载失败")
		}
	}

	// 选项选择逻辑
	const select = (index, item) => {
		if (showAnswer.value) return

		// 点击选项播放音频（假名发音或单词发音）
		playUserRecord(item.word.voice)

		if (item.anwser) {
			options.value[index].class = "success"
			knowBtn()
		} else {
			options.value[index].class = "fail"
			// 标出正确答案
			let correctIndex = options.value.findIndex(it => it.anwser)
			if (correctIndex !== -1) options.value[correctIndex].class = "success"
			unknowBtn()
		}
	}
</script>

<style>
	page {
		background-color: #ffffff;
		height: 100%;
		overflow: hidden;
	}
</style>

<style scoped lang="scss">
	.drawingboard {
		background-color: rgba(0, 0, 0, 0.3);
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
	}

	.page-scroll {
		height: 100vh;
		background-color: #ffffff;
	}

	.main-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		background-color: #ffffff;
	}

	.head {
		position: sticky;
		top: 0;
		z-index: 10;
		background-color: #ffffff;
	}

	.content-wrapper {
		padding: 24rpx 40rpx 0;
	}

	.done-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 80rpx;
	}


	.content-block {
		background-color: #f7f8fa;
		border-radius: 32rpx;
		padding: 40rpx;

		margin-bottom: 48rpx;
		position: relative;
	}

	.block-label {
		font-size: 26rpx;
		color: #999;
		margin-bottom: 24rpx;
		font-weight: 600;
	}


	.completion-icon {
		font-size: 160rpx;
		color: #07C160;
		margin-bottom: 48rpx;
	}

	.completion-title {
		font-size: 48rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 24rpx;
	}

	.completion-desc {
		font-size: 30rpx;
		color: #888;
		text-align: center;
		margin-bottom: 80rpx;
		line-height: 1.6;
	}


	.stats-block {
		display: flex;
		align-items: center;
		justify-content: space-around;
		background-color: #f7f8fa;
		width: 100%;
		padding: 40rpx 0;
		border-radius: 32rpx;
		margin-bottom: 80rpx;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.stat-divider {
		width: 2rpx;
		height: 60rpx;
		background-color: #e0e0e0;
	}

	.stat-value {
		font-size: 48rpx;
		font-weight: 600;
		color: #07C160;
		margin-bottom: 8rpx;
		font-family: 'DIN', sans-serif;
	}

	.stat-label {
		font-size: 26rpx;
		color: #999;
	}




	.progress-container {
		margin-bottom: 40rpx;
	}

	.progress-text {
		display: flex;
		justify-content: space-between;
		margin-bottom: 16rpx;
		font-size: 26rpx;
		color: #999;
		font-weight: 500;
	}

	.progress-bar {
		height: 12rpx;
		background-color: #f0f0f0;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background-color: #07C160;
		transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}


	.word-block {

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: stretch;
	}

	.word-header-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 48rpx;
		min-height: 160rpx;
	}

	.word-text-group {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.word-kanji {
		text-align: center;
		font-size: 64rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 12rpx;
		line-height: 1.2;
	}

	.word-furigana {
		text-align: center;
		font-size: 32rpx;
		color: #888;
		margin-bottom: 8rpx;
	}

	.word-romaji {
		text-align: center;
		font-size: 28rpx;
		color: #ccc;
		font-family: monospace;
	}

	.pronounce-btn {
		width: 80rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #ffffff;
		border-radius: 50%;
		border: none;
		color: #666;
		font-size: 32rpx;
		position: absolute;
		right: 32rpx;
		top: 32rpx;
		margin: 0;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);

		&:active {
			background-color: #f0f0f0;
			transform: scale(0.95);
		}
	}

	.pronounce-center {
		position: relative !important;
		right: auto !important;
		top: auto !important;
		width: 128rpx !important;
		height: 128rpx !important;
		font-size: 48rpx !important;
		margin-top: 20rpx;
	}


	.word-details {
		padding-top: 40rpx;
		border-top: 2rpx dashed #e0e0e0;
	}

	.detail-list {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
	}

	.detail-row {
		display: flex;
		align-items: baseline;
	}

	.detail-tag {
		font-size: 24rpx;
		color: #fff;
		background-color: #b0b0b0;
		padding: 4rpx 12rpx;
		border-radius: 8rpx;
		margin-right: 20rpx;
		white-space: nowrap;
		font-weight: 600;
	}

	.detail-content {
		font-size: 30rpx;
		color: #444;
		line-height: 1.6;
		font-weight: 500;
	}


	.example-item {
		margin-bottom: 32rpx;
		padding-bottom: 32rpx;
		border-bottom: 2rpx solid rgba(0, 0, 0, 0.03);

		&:last-child {
			margin-bottom: 0;
			padding-bottom: 0;
			border-bottom: none;
		}
	}

	.example-sentence {
		font-size: 32rpx;
		color: #333;
		line-height: 1.6;
		margin-bottom: 8rpx;
	}

	.example-translation {
		font-size: 28rpx;
		color: #888;
	}

	.search-link {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20rpx;
		gap: 12rpx;
		font-size: 28rpx;
		color: #07C160;
	}


	.safe-area-spacer {
		height: calc(env(safe-area-inset-bottom) + 180rpx);
		width: 100%;
	}


	.action-bar {
		position: fixed;
		left: 40rpx;
		right: 40rpx;
		bottom: calc(env(safe-area-inset-bottom) + 40rpx);
		display: flex;
		gap: 32rpx;
		z-index: 9;
		pointer-events: none;
	}

	.write-btn {
		position: fixed;
		bottom: 80rpx;
		right: 40rpx;
		background: rgba(7, 193, 96, 0.16);
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		bottom: calc(env(safe-area-inset-bottom) + 160rpx);
		z-index: 100;
		color: white;

		>view {
			flex-direction: column;
			background: #07C160;
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;

			text {
				font-size: 36rpx;
			}

			>view {
				font-size: 24rpx;
			}
		}


	}

	.button-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 32rpx;
		margin-bottom: 80rpx;
	}

	.action-btn {
		pointer-events: auto;
		flex: 1;
		min-width: 0;
		height: 90rpx;
		border-radius: 200rpx;
		border: none;
		font-size: 28rpx;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
		padding: 0;
		margin: 0;

		&::after {
			border: none;
		}

		&:active {
			opacity: 0.85;
			transform: scale(0.98);
		}
	}

	.primary-button,
	.secondary-button {
		flex: none;
		width: 100%;
		height: 90rpx;
		border-radius: 200rpx;
		border: none;
		font-size: 28rpx;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;

		&::after {
			border: none;
		}

		&:active {
			opacity: 0.8;
		}
	}

	.btn-primary,
	.primary-button {
		background-color: #07C160;
		color: white;
	}

	.btn-secondary,
	.secondary-button {
		background-color: #f5f5f5;
		color: #333;
	}

	.btn-danger {
		background-color: #ff4d4f;
		color: white;
	}

	.btn-success {
		background-color: #07C160;
		color: white;
	}

	.btn-warning {
		background-color: #ffa940;
		color: white;
	}

	:deep(ruby) {
		font-family: inherit;
	}

	:deep(rt) {
		font-size: 60%;
		color: #888;
	}

	/* 新增/适配样式 */
	.definition-question {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 160rpx;
		width: 100%;
	}

	.question-label {
		font-size: 24rpx;
		color: #999;
		margin-bottom: 24rpx;
	}

	.question-content {
		font-size: 40rpx;
		color: #333;
		font-weight: 600;
		text-align: center;
		line-height: 1.4;
	}

	.audio-block {
		background-color: #f0f2f5;
		border-radius: 32rpx;
		width: 100%;
		padding: 40rpx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		transition: opacity 0.2s;
		margin-bottom: 20rpx;

		&:active {
			opacity: 0.8;
		}

		.play-icon-wrapper {
			width: 100rpx;
			height: 100rpx;
			background-color: #ffffff;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #07C160;
			font-size: 40rpx;
			margin-bottom: 20rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		}

		.audio-hint {
			font-size: 26rpx;
			color: #999;
		}
	}

	.options-container {
		margin-bottom: 48rpx;
	}

	.divider-wrap {
		margin: 0 0 32rpx;
	}

	.options {
		display: flex;
		flex-direction: column;
		gap: 24rpx;

		.option-item {
			background-color: #f7f8fa;
			border-radius: 24rpx;
			padding: 30rpx 32rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			transition: background-color 0.2s;
			border: none;
			position: relative;

			&:active {
				background-color: #eceef1;
			}

			.index-tag {
				width: 48rpx;
				height: 48rpx;
				background-color: #e5e7eb;
				color: #6b7280;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 24rpx;
				font-weight: 600;
				margin-right: 24rpx;
				flex-shrink: 0;
			}

			.option-content {
				flex: 1;
				font-size: 30rpx;
				color: #333;
				line-height: 1.5;
			}

			.status-icon {
				margin-left: 20rpx;
				width: 40rpx;
				height: 40rpx;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #fff;
				font-size: 20rpx;
			}

			&.success {
				background-color: #e8fff3;

				.index-tag {
					background-color: #c6f6d5;
					color: #065f46;
				}

				.option-content {
					color: #047857;
					font-weight: 500;
				}

				.status-icon.success {
					background-color: #10B981;
				}
			}

			&.fail {
				background-color: #ffeef0;

				.index-tag {
					background-color: #fed7d7;
					color: #9b2c2c;
				}

				.option-content {
					color: #c53030;
				}

				.status-icon.fail {
					background-color: #ef4444;
				}
			}
		}
	}
</style>