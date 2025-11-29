<template>
	<scroll-view scroll-y="true" style="height: 100vh;">
		<Loading v-if="loading"></Loading>
		<view v-else>
			<view class="head">
				<NavbarDefault :title="`单词${typeTitle}`"></NavbarDefault>
			</view>
			<view v-if="doneTask" class="container">
				<view class="completion-icon">
					<i class="fa-solid fa-circle-check"></i>
				</view>
				<h1 class="completion-title">{{typeTitle}}完成！</h1>
				<p class="completion-desc">
					你已经完成了本组的{{total}}个单词{{typeTitle}}<br>
					坚持就是胜利，继续加油！
				</p>
				<view class="stats-container">
					<view class="stat-item">
						<view class="stat-value">{{total}}</view>
						<view class="stat-label">本组{{typeTitle}}</view>
					</view>
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
			<view v-else>
				<view class="progress-container">
					<view class="progress-text">
						<span>今日进度: {{learned}}/{{total}}</span>
						<span>{{progressPercent}}%</span>
					</view>
					<view class="progress-bar">
						<view class="progress-fill" :style="{width:`${progressPercent}%`}"></view>
					</view>
				</view>
				<view class="word-card">
					<button v-if="wordinfo.step!=2" @click="playUserRecord(wordinfo.voice)" class="pronounce-btn"
						title="发音">
						<i class="fas fa-volume-up"></i>
					</button>
					<view class="word-header _GCENTER">
						<button @click="playUserRecord(wordinfo.voice)" v-if="wordinfo.step==2&&!showAnswer"
							class="pronounce-btn pronounce-header" title="发音">
							<i class="fas fa-volume-up"></i>
						</button>
						<view v-else class="_GCENTER" style="flex-direction: column;">
							<view class="word-kanji">{{wordinfo.words.join('·')}}</view>
							<view class="word-furigana">{{wordinfo.kana}}</view>
							<view class="word-romaji">{{wordinfo.rome}}</view>
						</view>
					</view>

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
				</view>
				<view class="example" v-if="showAnswer||wordinfo.step==0">
					<view
						@click="playUserRecord(`https://jpx2ink.oss-cn-shanghai.aliyuncs.com/audio/dict/jc/${wordinfo.id}/${item.voice}`)"
						v-for="(item,index) in wordinfo.examples" :key="`example=${index}`">
						<view class="example-sentence" v-html="renderRubyHTMLWeb(item.read)"></view>
						<view v-if="showAnswer" class="example-translation">{{item.zh}}</view>
					</view>
				</view>
				<view v-if="showAnswer" @click="goPage('/pages/word/worddetail/worddetail',{
					id:wordinfo.id
				})" class="search">
					<text>查看词典</text>
				</view>
				<view style="height: calc(env(safe-area-inset-bottom) + 77px);">

				</view>
				<view v-if="showAnswer" class="action-buttons">
					<button v-if="know" @click="misremember()" class="action-btn dont-know-btn">
						<text>记错了</text>
					</button>
					<button @click="getNext()" class="action-btn next-btn">
						<text>下一个</text>
					</button>
				</view>
				<view v-else class="action-buttons">
					<button @click="unknowBtn()" class="action-btn dont-know-btn">
						<text>不认识</text>
					</button>
					<button @click="knowBtn()" class="action-btn know-btn">
						<text>认识</text>
					</button>
				</view>
			</view>
			<wd-toast />
		</view>
	</scroll-view>
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
		onLoad
	} from "@dcloudio/uni-app"

	// --- 核心配置常量 ---
	const WINDOW_SIZE = 6
	const MIN_BUFFER = 4
	// 删除 TARGET_COUNT 常量，不再硬编码为 10
	const MAX_ERROR_TOLERANCE = 3

	// --- 工具函数 ---
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

	// --- 核心状态 ---
	const loading = ref(true)
	const doneTask = ref(false)
	const showAnswer = ref(false)
	const know = ref(false)
	const total = ref(0)
	const sessionStep = ref(0)
	const learnType = ref('learn')
	const lastWordId = ref(null)

	// --- 单词队列结构 ---
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

	watch(() => wordinfo.value.id, (newVal) => {
		if (newVal) playUserRecord(wordinfo.value.voice)
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
	}

	// forceRefresh: 是否强制刷新（用于“再来一组”按钮）
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

			// --- 修改：兼容数组或对象格式，适配 {data: [], total: x} 结构 ---
			let rawData = []
			if (Array.isArray(res.data)) {
				rawData = res.data
			} else if (res.data && Array.isArray(res.data.data)) {
				rawData = res.data.data
			}
			// -----------------------------------------------------------

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

			// --- 修改：total 不再硬编码，而是使用实际获取的单词数量 ---
			total.value = wordList.value.length
			queuePending.value = [...wordList.value]

			// 如果数据为空，直接显示完成（防止空数据卡死）
			if (total.value === 0) {
				doneTask.value = true
			} else {
				getWord()
			}
		}
		loading.value = false
	}

	const loadFromCache = (cache) => {
		// 1. 基础数据恢复
		wordList.value = cache.wordList || []
		doneTask.value = cache.doneTask || false
		sessionStep.value = cache.sessionStep || 0

		// --- 修改：从缓存恢复 total，如果缓存没有则使用列表长度 ---
		total.value = cache.total || wordList.value.length

		nextShouldBeNew.value = cache.nextShouldBeNew ?? true

		// 2. 关键UI状态恢复 (SnapShot)
		showAnswer.value = cache.showAnswer || false
		know.value = cache.know || false
		lastWordId.value = cache.lastWordId || null

		// 3. 引用链恢复
		const link = (list) => list.map(i => wordList.value.find(w => w.word.id === i.word.id)).filter(i => i)
		queuePending.value = link(cache.queuePending || [])
		queueActive.value = link(cache.queueActive || [])
		queueCompleted.value = link(cache.queueCompleted || [])
		queueHard.value = link(cache.queueHard || [])

		// 4. 恢复当前词
		if (lastWordId.value) {
			const target = wordList.value.find(i => i.word.id === lastWordId.value)
			if (target) {
				currentItem.value = target
				wordinfo.value = target.word
			}
		} else if (cache.wordinfo && cache.wordinfo.id) {
			const target = wordList.value.find(i => i.word.id === cache.wordinfo.id)
			if (target) {
				currentItem.value = target
				wordinfo.value = target.word
			}
		}
	}

	const writeCache = () => {
		const cache = {
			wordinfo: wordinfo.value,
			doneTask: doneTask.value,
			showAnswer: showAnswer.value, // 保存是否显示答案
			know: know.value, // 保存“认识/不认识”状态
			sessionStep: sessionStep.value,
			lastWordId: lastWordId.value,
			nextShouldBeNew: nextShouldBeNew.value,
			queuePending: queuePending.value,
			queueActive: queueActive.value,
			queueCompleted: queueCompleted.value,
			queueHard: queueHard.value,
			wordList: wordList.value,
			total: total.value // --- 修改：将 total 也存入缓存 ---
		}

		if (learnType.value == "learn") {
			localwordsStore().setLearnTime(new Date().getTime())
			localwordsStore().setLearnCache(cache)
		} else {
			localwordsStore().setReviewTime(new Date().getTime())
			localwordsStore().setReviewCache(cache)
		}
	}

	// --- 核心调度算法 ---
	const getWord = () => {
		// --- 修改：判断完成条件改为 >= total.value ---
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
		let reason = '' // 恢复：原因记录

		const activeCount = queueActive.value.length
		const pendingCount = queuePending.value.length

		// 调度策略
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

		// 执行取词
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

		// 恢复：日志输出
		const displayIcon = source === 'new' ? '🆕' : (source === 'rescue' ? '🚑' : '🔄');
		const logWord = nextItem?.word?.words ? nextItem.word.words.join('·') : 'End';
		console.log(
			`[调度] ${displayIcon} ${logWord} | ${reason} | Active:${queueActive.value.length} Pending:${queuePending.value.length} Hard:${queueHard.value.length} Done:${queueCompleted.value.length}`
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

		// 进入新词时也保存一次，防止直接退出
		writeCache()
	}

	const finishTask = () => {
		doneTask.value = true
		if (learnType.value == "learn") localwordsStore().clearLearnCache()
		else localwordsStore().clearReviewCache()
	}

	// --- 交互逻辑 ---
	const knowBtn = () => {
		know.value = true
		showAnswer.value = true
		if (currentItem.value) {
			currentItem.value.word.step += 1
			currentItem.value.consecutiveError = 0
		}
		writeCache() // 状态变更立即保存
	}

	const unknowBtn = () => {
		know.value = false
		showAnswer.value = true
		if (currentItem.value) {
			currentItem.value.word.step = 0
			currentItem.value.error += 1
			currentItem.value.consecutiveError += 1
		}
		writeCache() // 状态变更立即保存
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

		if (item.word.step >= 3) {
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
						console.log(`[熔断] ⛔ ${item.word.words} 连续错误3次，移入待定区`);
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
		console.log(`[反馈] ❌ 答错插队: 位置 ${insertIndex}`)
	}
</script>

<style>
	/* 样式部分保持不变 */
	page {
		background-color: white;
	}
</style>
<style scoped lang="scss">
	.container {
		padding: 32px 16px;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.completion-icon {
		margin-top: 40px;
		font-size: 70px;
		margin-bottom: 20px;
		color: #07C160;
	}

	.completion-title {
		font-size: 24px;
		font-weight: 600;
		color: #212121;
		margin-bottom: 12px;
		text-align: center;
	}

	.completion-desc {
		font-size: 16px;
		color: #757575;
		text-align: center;
		margin-bottom: 48px;
		line-height: 1.5;
	}

	.search {
		display: flex;
		align-items: center;
		justify-content: center;

		text {
			text-decoration: underline;
			font-size: 24rpx;
			color: #212121;
		}
	}

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

	.button-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 16px;
		margin-top: auto;
		margin-bottom: 40px;
	}

	.primary-button {
		background-color: #07C160;
		color: white;
		border: none;
		border-radius: 12px;
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

	.secondary-button {
		background-color: white;
		color: #07C160;
		border: 1px solid #07C160;
		border-radius: 12px;
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

	.progress-container {
		padding: 16px;
	}

	.progress-text {
		display: flex;
		justify-content: space-between;
		margin-bottom: 8px;
		font-size: 14px;
		color: #757575;
	}

	.progress-bar {
		height: 4px;
		background-color: #E0E0E0;
		border-radius: 4px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background-color: #07C160;
		transition: width 0.3s ease;
	}

	.word-card {
		margin: 16px;
		border: 1px solid #E5E7EB;
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
	}

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
		border-radius: 12px;
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