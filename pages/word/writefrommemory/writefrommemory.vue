<template>
	<view class="page-container">
		<view class="top-header">
			<NavbarDefault title="单词默写"></NavbarDefault>
			<view class="progress-bar">
				<view class="progress-fill" :style="{width:`${progress}%`}"></view>
			</view>
		</view>

		<scroll-view scroll-y class="scroll-content">
			<div v-if="isBatchComplete" class="container">
				<view class="result-icon-box">
					<i class="fa-solid fa-circle-check"></i>
				</view>
				<h1 class="completion-title">默写完成</h1>
				<view class="completion-desc">
					本次练习 {{doneList.length}} 个单词<br>
					<text v-if="serverRemaining > 0" class="sub-text">
						今日剩余待默写: {{serverRemaining}} 个
					</text>
					<text v-else class="sub-text">今日任务已全部完成，继续加油！</text>
				</view>
				<view class="button-container">
					<button v-if="serverRemaining > 0" class="action-btn primary-btn"
						@click="getAllWords()">继续默写</button>
					<button class="action-btn secondary-btn" @click="goLearn()">去学习新词</button>
				</view>
			</div>

			<view v-else class="write-wrap">
				<div class="word-block">
					<div class="word-text">{{wordinfo.description}}</div>
					<div class="play-btn-area" @click="playUserRecord(wordinfo.voice)">
						<i class="fas fa-volume-up play-icon"></i>
						<text class="play-hint">点击播放读音</text>
					</div>
				</div>

				<div class="input-section">
					<div class="input-block" :class="{'is-error': isError}">
						<input class="main-input" v-model="value" type="text" confirm-type="done" @confirm="submit()"
							:disabled="showAnwser && !isError" placeholder="请输入日语单词、假名或罗马音"
							placeholder-class="input-placeholder" />

						<view class="input-actions">
							<view class="action-icon" @click="value=''" v-if="value">
								<i class="fa-solid fa-circle-xmark clear-icon"></i>
							</view>
							<view class="action-icon keyboard-trigger" @click.stop="toggleKeyboard">
								<i class="fa-solid fa-keyboard"></i>
							</view>
						</view>
					</div>

					<button v-if="!showAnwser" class="action-btn primary-btn submit-btn" @click="submit()">确认提交</button>

					<button v-else class="action-btn primary-btn continue-btn" @click="getNext()">
						继续下一个 <i class="fa-solid fa-arrow-right icon-right"></i>
					</button>

					<view v-if="!showAnwser" @click="giveUp()" class="link-btn">
						<text>不记得了，查看答案</text>
					</view>
				</div>

				<div v-if="showAnwser" @click="goPage('/pages/word/worddetail/worddetail',{ id:wordinfo.id })"
					class="answer-block">
					<div class="answer-content">
						<div class="answer-info">
							<div class="japanese-text">{{formatWordName(wordinfo.words,wordinfo.kana)}}</div>
							<div class="rome-text">{{wordinfo.rome}}</div>
						</div>
						<view class="arrow-icon">
							<i class="fa-solid fa-chevron-right"></i>
						</view>
					</div>
				</div>

				<view style="height: 60px;"></view>
			</view>
		</scroll-view>

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
						<view class="key-btn" v-for="(char, idx) in currentKeys" :key="idx" @click="onKeyClick(char)">
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
	</view>
</template>

<script setup>
	// ----------------------------------------------------------------
	// 逻辑部分完全保持你提供的原样，未做任何修改
	// ----------------------------------------------------------------
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
		'あ', 'い', 'う', 'え', 'お',
		'か', 'き', 'く', 'け', 'こ',
		'さ', 'し', 'す', 'せ', 'そ',
		'た', 'ち', 'つ', 'て', 'と',
		'な', 'に', 'ぬ', 'ね', 'の',
		'は', 'ひ', 'ふ', 'へ', 'ほ',
		'ま', 'み', 'む', 'め', 'も',
		'や', 'ゆ', 'よ', 'わ', 'を',
		'ら', 'り', 'る', 'れ', 'ろ',
		'ん', 'っ', 'ゃ', 'ゅ', 'ょ',
		'゛', '゜', 'ー', '、', '。'
	]
	const katakana = [
		'ア', 'イ', 'ウ', 'エ', 'オ',
		'カ', 'キ', 'ク', 'ケ', 'コ',
		'サ', 'シ', 'ス', 'セ', 'ソ',
		'タ', 'チ', 'ツ', 'テ', 'ト',
		'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
		'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
		'マ', 'ミ', 'ム', 'メ', 'モ',
		'ヤ', 'ユ', 'ヨ', 'ワ', 'ヲ',
		'ラ', 'リ', 'ル', 'レ', 'ロ',
		'ン', 'ッ', 'ャ', 'ュ', 'ョ',
		'゛', '゜', 'ー', '、', '。'
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
		if (!url) return
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
		uni.showLoading({
			title: '加载中'
		})
		try {
			const res = await $http.word.getLearnt({
				filter: "write"
			})
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
		if (wordList.value.length === 0) {
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
			if (localList && localList.length > 0) {
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
	/* 基础变量定义 */
	$bg-color: #ffffff;
	$block-bg: #f7f8fa;
	$primary-color: #07C160;
	$error-bg: #fff5f5;
	$text-main: #333333;
	$text-sub: #999999;
	$border-radius: 32rpx;

	page {
		background-color: $bg-color;
	}

	.page-container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: $bg-color;
	}

	.top-header {
		background: $bg-color;
		z-index: 10;
		flex-shrink: 0;
	}

	.scroll-content {
		flex: 1;
		height: 0;
	}

	/* 极简进度条 */
	.progress-bar {
		height: 4px;
		background-color: #f0f0f0;
	}

	.progress-fill {
		height: 100%;
		background-color: $primary-color;
		border-radius: 0 4px 4px 0;
		transition: width 0.3s ease;
	}

	.write-wrap {
		padding: 40rpx;
	}

	/* 单词展示块 - 色块化 */
	.word-block {
		background-color: $block-bg;
		border-radius: $border-radius;
		padding: 60rpx 40rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-bottom: 40rpx;

		.word-text {
			font-size: 40rpx;
			font-weight: 700;
			color: $text-main;
			margin-bottom: 24rpx;
			text-align: center;
		}

		.play-btn-area {
			display: flex;
			align-items: center;
			gap: 12rpx;
			padding: 16rpx 32rpx;
			background-color: #ffffff;
			/* 白色子块 */
			border-radius: 999px;
			transition: opacity 0.2s;

			&:active {
				opacity: 0.7;
			}

			.play-icon {
				color: $primary-color;
				font-size: 28rpx;
			}

			.play-hint {
				font-size: 24rpx;
				color: $text-sub;
			}
		}
	}

	/* 输入区域 */
	.input-section {
		display: flex;
		flex-direction: column;
		gap: 30rpx;
	}

	/* 输入块 - 无框设计 */
	.input-block {
		background-color: $block-bg;
		border-radius: $border-radius;
		padding: 10rpx 30rpx;
		display: flex;
		align-items: center;
		height: 110rpx;
		transition: background-color 0.2s;

		&.is-error {
			background-color: $error-bg;

			/* 错误时可以使用红色文字提示，但尽量不加边框 */
			.main-input {
				color: #e53e3e;
			}
		}

		.main-input {
			flex: 1;
			height: 100%;
			font-size: 32rpx;
			color: $text-main;
			background: transparent;
		}

		.input-placeholder {
			color: #c0c4cc;
		}

		.input-actions {
			display: flex;
			align-items: center;
			gap: 20rpx;

			.action-icon {
				padding: 10rpx;
				font-size: 36rpx;
				color: #c0c4cc;
				display: flex;
				align-items: center;

				&:active {
					color: $text-main;
				}
			}

			.keyboard-trigger {
				color: $text-sub;
				font-size: 40rpx;

				&:active {
					color: $primary-color;
				}
			}

			.clear-icon {
				font-size: 32rpx;
			}
		}
	}

	/* 通用按钮样式 */
	.action-btn {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		border-radius: 999px;
		font-size: 32rpx;
		font-weight: 600;
		text-align: center;
		border: none;
		box-shadow: none;
		/* 去除阴影 */

		&::after {
			border: none;
		}

		&:active {
			opacity: 0.8;
		}
	}

	.primary-btn {
		background-color: $primary-color;
		color: white;
	}

	.secondary-btn {
		background-color: $block-bg;
		color: $text-main;
	}

	.continue-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12rpx;

		.icon-right {
			font-size: 28rpx;
		}
	}

	.link-btn {
		text-align: center;
		padding: 20rpx;

		text {
			font-size: 28rpx;
			color: $text-sub;
			text-decoration: underline;
		}
	}

	/* 答案展示块 - 扁平化 */
	.answer-block {
		margin-top: 40rpx;
		padding: 30rpx 40rpx;
		background-color: $block-bg;
		/* 融入背景 */
		border-radius: 24rpx;
		transition: opacity 0.2s;

		&:active {
			opacity: 0.8;
		}

		.answer-content {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.japanese-text {
			font-size: 36rpx;
			font-weight: bold;
			color: $primary-color;
			margin-bottom: 8rpx;
		}

		.rome-text {
			font-size: 26rpx;
			color: $text-sub;
		}

		.arrow-icon {
			color: #dcdfe6;
			font-size: 28rpx;
		}
	}

	/* 完成页面 */
	.container {
		padding: 100rpx 40rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 60vh;
	}

	.result-icon-box {
		font-size: 100rpx;
		color: $primary-color;
		margin-bottom: 40rpx;
	}

	.completion-title {
		font-size: 40rpx;
		font-weight: 600;
		color: $text-main;
		margin-bottom: 20rpx;
	}

	.completion-desc {
		font-size: 28rpx;
		color: $text-sub;
		text-align: center;
		line-height: 1.8;
		margin-bottom: 80rpx;
	}

	.sub-text {
		display: block;
		margin-top: 10rpx;
	}

	.button-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 30rpx;
	}

	/* 软键盘样式重构 - 扁平化 */
	.keyboard-container {
		background-color: #f0f2f5;
	}

	.keyboard-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 30rpx;
		background: #ffffff;
		/* 移除边框线，用极淡的阴影区分，或者完全去掉 */

		.keyboard-tabs {
			display: flex;
			gap: 40rpx;
			font-size: 30rpx;
			color: $text-sub;

			text.active {
				color: $primary-color;
				font-weight: 600;
				position: relative;

				&::after {
					content: '';
					position: absolute;
					bottom: -10rpx;
					left: 0;
					right: 0;
					height: 4rpx;
					background-color: $primary-color;
					border-radius: 2rpx;
				}
			}
		}

		.keyboard-close {
			color: $primary-color;
			font-size: 28rpx;
			font-weight: 600;
			padding: 10rpx 20rpx;
		}
	}

	.keyboard-body {
		height: 540rpx;
		/* 增加高度适应 */
		padding: 20rpx 10rpx;
	}

	.key-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 12rpx;
		justify-content: center;
	}

	.key-btn {
		width: calc(20% - 12rpx);
		/* 5列布局 */
		height: 90rpx;
		background: #ffffff;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 36rpx;
		color: $text-main;
		/* 去除阴影，纯平 */
		box-shadow: 0 2rpx 0 rgba(0, 0, 0, 0.05);

		&:active {
			background-color: #e6e6e6;
		}

		&.action-key {
			background-color: #e1e4e9;
			/* 功能键深一点 */
			color: #555;
			font-size: 32rpx;
			box-shadow: none;
		}
	}
</style>