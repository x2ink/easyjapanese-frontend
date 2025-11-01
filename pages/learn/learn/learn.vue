<template>
	<Loading v-if="loading"></Loading>
	<view v-else>
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

			<!-- 按钮组 -->
			<div class="button-container">
				<button @click="writefrommemory()" class="primary-button">立即默写</button>
				<button @click="againLearn()" class="secondary-button">再学一组</button>
			</div>
		</div>
		<view v-else>
			<!-- 学习进度 -->
			<div class="progress-container">
				<div class="progress-text">
					<span>今日进度: {{learned}}/{{total}}</span>
					<span>{{(learned/total).toFixed(0)*100}}%</span>
				</div>
				<div class="progress-bar">
					<div class="progress-fill" :style="{width:`${(learned/total)*100}%`}"></div>
				</div>
			</div>
			<!-- 单词卡片 -->
			<div class="word-card">
				<button class="pronounce-btn" title="发音">
					<i class="fas fa-volume-up"></i>
				</button>
				<div class="word-header _GCENTER">
					<button v-if="wordinfo.step==2" class="pronounce-btn pronounce-header" title="发音">
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
			<!-- 占位 -->
			<view style="height: calc(env(safe-area-inset-bottom) + 77px);">

			</view>
			<!-- 操作按钮 -->
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
		watch,
		computed
	} from 'vue'
	import NavbarDefault from "@/components/navbar/default"
	import $http from "@/api/index.js"
	import Loading from "@/components/loading/loading.vue"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	import {
		goPage
	} from "@/utils/common.js"
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = false;
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
	const playUserRecord = (url) => {
		innerAudioContext.stop();
		innerAudioContext.src = url;
		innerAudioContext.play();
	}
	const doneTask = ref(false)
	const loading = ref(true)
	const total = ref(0)
	const wordList = ref([])
	const showAnswer = ref(false)
	onMounted(() => {
		init()
	})
	const getWord = () => {
		let temp = wordList.value.filter(item => !item.isLearned)
		if (temp.length == 0) {
			console.log("单词全部学习完毕");
			return
		}
		wordinfo.value = temp[0]
		wordinfo.value.examples = wordinfo.value.detail
			.flatMap(d => d.meanings)
			.flatMap(m => m.examples);
		wordinfo.value.types = wordinfo.value.detail
			.flatMap(d => d.type).join(';')
	}
	const init = async () => {
		const res = await $http.word.learnWord()
		total.value = res.total
		wordList.value = res.data.map(item => {
			item.step = 0
			item.isLearned = false
			return item
		})
		loading.value = false
		getWord()
	}
	const know = ref(false)
	const knowBtn = () => {
		know.value = true
		showAnswer.value = true
	}
	const unknowBtn = () => {
		know.value = false
		showAnswer.value = true
	}
	const misremember = () => {
		know.value = false
		getNext()
	}
	const learned = computed(() => {
		return wordList.value.filter(item => item.isLearned).length
	})
	const getNext = () => {
		let temp = wordinfo.value
		wordList.value = wordList.value.filter(item => item.id != wordinfo.value.id)
		getWord()
		showAnswer.value = false
		if (know.value) {
			if (temp.step == 2) {
				temp.isLearned = true
			} else {
				temp.step += 1
			}
		} else {
			temp.step = 0
		}
		wordList.value.splice(3, 0, temp);
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