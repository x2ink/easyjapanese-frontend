<template>
	<view class="page-container">
		<view class="top-header">
			<NavbarDefault title="单词听写"></NavbarDefault>
			<view class="progress-bar">
				<view class="progress-fill" :style="{width:`${progress}%`}"></view>
			</view>
		</view>

		<scroll-view scroll-y class="scroll-content">
			<div v-if="isBatchComplete" class="container">
				<view class="result-icon-box">
					<i class="fa-solid fa-circle-check"></i>
				</view>
				<h1 class="completion-title">本组听写完成</h1>
				<p class="completion-desc">
					本次练习 {{doneList.length}} 个单词<br>
					<text v-if="serverRemaining > 0" class="sub-text">
						今日剩余待听写: {{serverRemaining}} 个
					</text>
					<text v-else class="sub-text">今日任务已全部完成，太棒了！</text>
				</p>
				<div class="button-container">
					<button v-if="serverRemaining > 0" class="action-btn primary-btn"
						@click="getAllWords()">继续听写</button>
					<button class="action-btn secondary-btn" @click="goLearn()">去学习新词</button>
				</div>
			</div>

			<view v-else class="dictation-wrap">
				<view class="audio-block" @click="playUserRecord(wordinfo.voice)">
					<view class="play-icon-wrapper">
						<text class="fas fa-volume-up"></text>
					</view>
					<view class="audio-hint">点击播放发音</view>
				</view>

				<view class="divider-wrap">
					<wd-divider>请选择正确答案</wd-divider>
				</view>

				<view class="options">
					<view :class="['option-item', item.class]" @click="select(index,item)"
						v-for="(item,index) in options" :key="item.word.id">
						<view class="index-tag">
							{{optionKey.get(index)}}
						</view>
						<view class="option-content">
							{{item.word.description}}
						</view>

						<view v-if="item.class=='fail'" class="status-icon fail">
							<text class="fa-solid fa-xmark"></text>
						</view>
						<view v-if="item.class=='success'" class="status-icon success">
							<text class="fa-solid fa-check"></text>
						</view>
					</view>
				</view>

				<view v-if="showDetailCard" @click="goPage('/pages/word/worddetail/worddetail',{ id:wordinfo.id })"
					class="detail-block">
					<view class="detail-content">
						<view class="detail-main">
							<view class="word-kana">{{formatWordName(wordinfo.words,wordinfo.kana)}}</view>
							<view class="word-rome">{{wordinfo.rome}}</view>
						</view>
						<view class="detail-arrow">
							<i class="fa-solid fa-chevron-right"></i>
						</view>
					</view>
				</view>

				<view class="continue-wrap" v-if="showManualContinue">
					<view class="continue-btn" @click="getNext()">
						<text>继续下一个</text>
						<i class="fa-solid fa-arrow-right icon-right"></i>
					</view>
				</view>

				<view style="height: 60px;"></view>
			</view>
		</scroll-view>

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
		useToast
	} from '@/uni_modules/wot-design-uni'

	const toast = useToast()
	const optionKey = new Map([
		[0, 'A'],
		[1, 'B'],
		[2, 'C'],
		[3, 'D']
	])
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = false;

	const wordinfo = ref({})
	const wordList = ref([])
	const doneList = ref([])
	const options = ref([])

	// 状态控制
	const isBatchComplete = ref(false) // 本组是否完成
	const showManualContinue = ref(false) // 是否显示手动继续按钮（答错时）
	const showDetailCard = ref(false) // 是否显示单词详情
	const isSelecting = ref(false) // 防抖锁

	// 统计数据
	const batchTotal = ref(0) // 本组总数 (固定值，用于进度条)
	const serverTotal = ref(0) // 服务器总剩余 (动态)

	// 进度条计算
	const progress = computed(() => {
		if (batchTotal.value === 0) return 0
		return (doneList.value.length / batchTotal.value) * 100
	})

	// 计算服务器剩余量 (估算)
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

	const select = async (index, item) => {
		// 1. 防重复点击
		if (isSelecting.value || options.value.some(it => it.class)) return
		isSelecting.value = true

		if (item.anwser) {
			// --- 答对逻辑 ---
			options.value[index].class = "success"
			showDetailCard.value = true

			// 2. 数据处理
			doneList.value.push(wordinfo.value)
			wordList.value.shift() // 移除当前词

			// 3. 提交服务器
			$http.word.setLearnt({
				type: "listen",
				word_id: wordinfo.value.id
			})

			// 4. 自动跳转 (延迟1000ms)
			setTimeout(() => {
				getNext()
			}, 1000)

		} else {
			// --- 答错逻辑 ---
			options.value[index].class = "fail"
			// 标出正确答案
			let correctIndex = options.value.findIndex(it => it.anwser)
			if (correctIndex !== -1) options.value[correctIndex].class = "success"

			// 2. 逻辑处理：错题后置
			const currentWord = wordList.value.shift()
			wordList.value.push(currentWord) // 放到队尾，稍后重试

			// 3. 交互变更：答错不自动跳，展示“继续”按钮和单词卡片
			showManualContinue.value = true
			showDetailCard.value = true
			isSelecting.value = false // 答错时解锁，允许点击继续
		}
	}

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

	const getAllWords = async () => {
		uni.showLoading({
			title: '加载单词中'
		})
		try {
			const res = await $http.word.getLearnt({
				filter: "listen"
			})
			const list = res.data || []

			if (list.length === 0) {
				isBatchComplete.value = true
				serverTotal.value = 0
				uni.hideLoading()
				return
			}

			// 重置状态，开始新的一组
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

		// 重置UI状态
		isSelecting.value = false
		options.value = []
		showManualContinue.value = false
		showDetailCard.value = false

		// 取出下一个词
		wordinfo.value = wordList.value[0]

		// 播放音频 & 获取选项
		playUserRecord(wordinfo.value.voice)
		getOptions(wordinfo.value.id)
	}

	onLoad(() => {
		getAllWords()
	})
</script>

<style lang="scss">
	/* 基础变量 */
	$bg-color: #ffffff;
	$block-bg: #f7f8fa; // 通用浅灰背景
	$primary-color: #07C160; // 主色调
	$text-main: #333333;
	$text-sub: #999999;

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
	}

	.scroll-content {
		flex: 1;
		height: 0;
		background-color: $bg-color;
	}

	/* 极简进度条 */
	.progress-bar {
		height: 4px;
		background-color: #f0f0f0;
		width: 100%;
	}

	.progress-fill {
		height: 100%;
		background-color: $primary-color;
		border-radius: 0 4px 4px 0;
		transition: width 0.3s ease;
	}

	.dictation-wrap {
		padding: 40rpx;
	}

	/* 音频播放块 - 色块化设计 */
	.audio-block {
		background-color: $block-bg;
		border-radius: 32rpx;
		padding: 60rpx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		transition: opacity 0.2s;

		&:active {
			opacity: 0.8;
		}

		.play-icon-wrapper {
			width: 100rpx;
			height: 100rpx;
			background-color: $bg-color;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			color: $primary-color;
			font-size: 40rpx;
			margin-bottom: 20rpx;
			/* 极淡的阴影，几乎不可见，仅增加层次 */
			// box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.02);
		}

		.audio-hint {
			font-size: 26rpx;
			color: $text-sub;
		}
	}

	.divider-wrap {
		margin: 40rpx 0 20rpx;
	}

	/* 选项列表 - 无框扁平化 */
	.options {
		display: flex;
		flex-direction: column;
		gap: 24rpx;

		.option-item {
			background-color: $block-bg;
			border-radius: 24rpx;
			/* 大圆角 */
			padding: 30rpx 32rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			transition: background-color 0.2s;
			border: none;
			/* 去除边框 */
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
				color: $text-main;
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

			/* 状态样式 - 改变背景色而非边框 */
			&.success {
				background-color: #e8fff3;

				/* 浅绿背景 */
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

				/* 浅红背景 */
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

	/* 详情块 - 替代原来的Card */
	.detail-block {
		margin-top: 40rpx;
		padding: 30rpx 40rpx;
		background-color: $block-bg;
		/* 融入背景的色块 */
		border-radius: 24rpx;
		/* 去除 box-shadow 和 border */

		&:active {
			opacity: 0.8;
		}

		.detail-content {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.word-kana {
			font-size: 36rpx;
			font-weight: bold;
			color: $text-main;
			margin-bottom: 6rpx;
		}

		.word-rome {
			font-size: 26rpx;
			color: $text-sub;
		}

		.detail-arrow {
			color: #c0c4cc;
			font-size: 28rpx;
		}
	}

	/* 底部继续按钮 */
	.continue-wrap {
		display: flex;
		justify-content: center;
		margin-top: 60rpx;
	}

	.continue-btn {
		background-color: $primary-color;
		color: white;
		padding: 24rpx 60rpx;
		border-radius: 999px;
		/* 胶囊形状 */
		display: flex;
		align-items: center;
		gap: 12rpx;
		font-size: 30rpx;
		font-weight: 500;
		/* 去除阴影，仅保留纯色填充 */

		&:active {
			opacity: 0.8;
		}

		.icon-right {
			font-size: 28rpx;
		}
	}

	/* 完成页样式优化 */
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

	.action-btn {
		width: 100%;
		height: 96rpx;
		line-height: 96rpx;
		border-radius: 999px;
		/* 全圆角 */
		font-size: 32rpx;
		font-weight: 500;
		text-align: center;
		border: none;

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
		/* 浅灰背景代替描边按钮 */
		color: $text-main;
		/* 如果想强调可以用主色调文字： color: $primary-color; */
	}
</style>