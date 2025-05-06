<template>
	<view>
		<view class="head">
			<NavbarDefault title="单词学习"></NavbarDefault>
		</view>
		<div v-if="doneTask" class="container">
			<!-- 完成图标 -->
			<div class="completion-icon">
				<i class="fa-solid fa-circle-check"></i>
			</div>

			<!-- 完成标题 -->
			<h1 class="completion-title">学习完成！</h1>

			<!-- 完成描述 -->
			<p class="completion-desc">
				你已经完成了本组的{{total}}个单词学习<br>
				坚持就是胜利，继续加油！
			</p>

			<!-- 统计信息 -->
			<!-- 		<div class="stats-container">
				<div class="stat-item">
					<div class="stat-value">{{total}}</div>
					<div class="stat-label">本组学习</div>
				</div>
				<div class="stat-item">
					<div class="stat-value">85%</div>
					<div class="stat-label">正确率</div>
				</div>
			</div> -->

			<!-- 按钮组 -->
			<div class="button-container">
				<button class="primary-button">立即默写</button>
				<button class="secondary-button">再学一组</button>
			</div>
		</div>
		<view v-else>
			<!-- 学习进度 -->
			<div class="progress-container">
				<div class="progress-text">
					<span>今日进度: {{learned.length}}/{{total}}</span>
					<span>{{(learned.length/total)*100}}%</span>
				</div>
				<div class="progress-bar">
					<div class="progress-fill" :style="{width:`${(learned.length/total)*100}%`}"></div>
				</div>
			</div>
			<!-- 单词卡片 -->
			<div class="word-card">
				<button v-if="answerShow||pattern!=2" class="pronounce-btn" title="发音">
					<i class="fas fa-volume-up"></i>
				</button>
				<div class="word-header _GCENTER">
					<button v-if="pattern==2&&!answerShow" class="pronounce-btn pronounce-header" title="发音">
						<i class="fas fa-volume-up"></i>
					</button>
					<view class="_GCENTER" style="flex-direction: column;" v-else>
						<div class="word-kanji">{{wordinfo.word}}</div>
						<div class="word-furigana">{{wordinfo.kana}}</div>
						<div class="word-romaji">{{wordinfo.rome}}</div>
					</view>
				</div>

				<div class="word-details">
					<wd-skeleton v-if="!answerShow" theme="paragraph"
						:row-col="[
			[{width: '40px'},{width: '100%', marginLeft: '10px' }], [{width: '40px'},{width: '100%', marginLeft: '10px' }]]"></wd-skeleton>
					<div v-if="answerShow" class="detail-row">
						<div class="detail-label">词性</div>
						<div class="detail-content">{{extractBracketContents(wordinfo.wordtype).join('；')}}</div>
					</div>
					<div v-if="answerShow" class="detail-row">
						<div class="detail-label">释义</div>
						<div class="detail-content" v-html="wordinfo.meaning.map(item=>item.meaning).join('<br>')">
						</div>
					</div>
				</div>
			</div>
			<view class="example" v-if="answerShow||pattern==0">
				<div v-for="item in wordinfo.example.sort((a, b) => b.ja.length - a.ja.length).slice(0, 4)"
					:key="item.id">
					<div class="example-sentence">{{item.ja}}</div>
					<div v-if="answerShow" class="example-translation">{{item.ch}}</div>
				</div>
			</view>
			<!-- 占位 -->
			<view style="height: calc(env(safe-area-inset-bottom) + 77px);">

			</view>
			<!-- 操作按钮 -->
			<div class="action-buttons" v-if="knowBtnShow">
				<button @click="unknowBtn();misrememberShow = false" class="action-btn dont-know-btn">
					<text class="fa-solid fa-face-sad-cry"></text>
					<text>不认识</text>
				</button>
				<button @click="knowBtn()" class="action-btn know-btn">
					<text class="fa-solid fa-face-smile"></text>
					<text>认识</text>
				</button>
			</div>
			<div class="action-buttons" v-else>
				<button v-if="misrememberShow" @click="misremember()" class="action-btn dont-know-btn">
					<text class="fa-solid fa-face-sad-cry"></text>
					<text>记错了</text>
				</button>
				<button @click="getNext()" class="action-btn next-btn">
					<text class="fa-solid fa-hand-point-right"></text>
					<text>下一个</text>
				</button>
			</div>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		watch
	} from 'vue'
	import NavbarDefault from "@/components/navbar/default"
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import $http from "@/api/index.js"
	import {
		goPage,
		extractBracketContents,
	} from "@/utils/common.js"
	const doneTask = ref(false)
	const recordWord = async (data) => {
		doneTask.value = true
		let temp = learned.value.map(item => {
			return {
				error: item.error,
				word_id: item.word.id
			}
		})
		const res = await $http.word.recordlearn({
			words: temp
		})

	}
	const total = ref(0)
	const pattern = ref(0)
	const wordinfo = ref({
		word: '',
		wordtype: '',
		meaning: [],
		example: []
	})
	const current = ref({})
	const wordList = ref([])
	// 未学习的新词
	const pendingNew = ref()
	// 需要复习的词
	const reviewQueue = ref([])
	// 已掌握的单词
	const learned = ref([])
	// 下一个单词是否要复习
	const nextIsReview = ref(false)
	// 初始化前4个新词
	const initialQueue = ref([])
	const knowBtnShow = ref(true)
	const answerShow = ref(false)
	const init = async () => {
		const res = await $http.word.learnWord()
		wordList.value = res.data.map(item => {
			return {
				word: item,
				id: item.id,
				pattern: 0,
				interval: 1,
				error: 0
			}
		})
		total.value = res.total
		pendingNew.value = [...wordList.value];
		reviewQueue.value = [];
		learned.value = [];
		nextIsReview.value = false;
		initialQueue.value = pendingNew.value.splice(0, 4);
		getNext()
	}
	const misrememberShow = ref(false)
	const misremember = () => {
		learned.value = learned.value.filter(item => item.word.id != current.value.word.id)
		unknowBtn()
		getNext()
	}
	const unknowBtn = () => {
		knowBtnShow.value = false
		answerShow.value = true
		current.value.pattern = 0;
		current.value.error++;
		reviewQueue.value = reviewQueue.value.filter(item => item.word.id != current.value.word.id)
		reviewQueue.value.sort((a, b) => a.interval - b.interval);
		if (reviewQueue.value.length == 0) {
			current.value.interval = 1
		} else {
			current.value.interval = reviewQueue.value[0].interval
		}
		reviewQueue.value.splice(3, 0, current.value)
		console.log(reviewQueue.value);
	}
	const knowBtn = () => {
		misrememberShow.value = true
		knowBtnShow.value = false
		answerShow.value = true
		current.value.pattern++;
		if (current.value.pattern >= 3) {
			learned.value.push(current.value);
			return;
		}
		current.value.interval *= 2;
		reviewQueue.value = reviewQueue.value.filter(item => item.word.id != current.value.word.id)
		reviewQueue.value.push(current.value);
		reviewQueue.value.sort((a, b) => a.interval - b.interval);
		console.log(reviewQueue.value);
	}
	// 私有方法：获取复习词
	const getReviewWord = () => {
		if (reviewQueue.value.length > 0) {
			nextIsReview.value = false; // 下一个取新词
			return reviewQueue.value.shift();
		}
		return getNewWord(); // 没有复习词则继续取新词
	}

	// 私有方法：获取新词
	const getNewWord = () => {
		console.log("获取新词", pendingNew.value);
		if (pendingNew.value.length > 0) {
			const word = pendingNew.value.shift();
			nextIsReview.value = true;
			return word;
		}
		console.log("获取复习的词", reviewQueue.value);
		return reviewQueue.value.shift(); // 新词取完后只取复习词
	}
	// 获取下一个要学习的单词
	const getNext = () => {
		if (learned.value.length == total.value) {
			recordWord()
			return
		}
		knowBtnShow.value = true
		answerShow.value = false
		// 阶段1：初始4个新词
		if (initialQueue.value.length > 0) {
			let temp = initialQueue.value.shift()
			pattern.value = temp.pattern
			wordinfo.value = temp.word
			current.value = temp
			console.log("阶段1", wordinfo.value.word);
			return
		}
		// 阶段2：交替获取复习词和新词
		if (nextIsReview.value) {
			let temp = getReviewWord();
			pattern.value = temp.pattern
			wordinfo.value = temp.word
			current.value = temp
			console.log("阶段2复习", wordinfo.value.word);
			return
		} else {
			let temp = getNewWord();
			console.log("下一个词", temp);
			pattern.value = temp.pattern
			wordinfo.value = temp.word
			current.value = temp
			console.log("阶段2新词", wordinfo.value.word);
			return
		}
	}

	onMounted(() => {
		init()
	})
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

	/* 单词卡片 */
	.card-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

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
		margin-bottom: 12px;
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