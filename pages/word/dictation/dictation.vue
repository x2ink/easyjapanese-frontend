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

				<view style="height: 120rpx;"></view>
			</view>
		</scroll-view>

		<wd-toast />
		<wd-message-box />
	</view>
</template>

<script setup>
	
	
	
	import {
		ref,
		computed
	} from 'vue'
	import {
		onLoad,
		onUnload
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

	
	const isBatchComplete = ref(false) 
	const showManualContinue = ref(false) 
	const showDetailCard = ref(false) 
	const isSelecting = ref(false) 

	
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

	const select = async (index, item) => {
		
		if (isSelecting.value || options.value.some(it => it.class)) return
		isSelecting.value = true

		if (item.anwser) {
			
			options.value[index].class = "success"
			showDetailCard.value = true

			
			doneList.value.push(wordinfo.value)
			wordList.value.shift() 

			
			$http.word.setLearnt({
				type: "listen",
				word_id: wordinfo.value.id
			})

			
			setTimeout(() => {
				getNext()
			}, 1000)

		} else {
			
			options.value[index].class = "fail"
			
			let correctIndex = options.value.findIndex(it => it.anwser)
			if (correctIndex !== -1) options.value[correctIndex].class = "success"

			
			const currentWord = wordList.value.shift()
			wordList.value.push(currentWord) 

			
			showManualContinue.value = true
			showDetailCard.value = true
			isSelecting.value = false 
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

		
		isSelecting.value = false
		options.value = []
		showManualContinue.value = false
		showDetailCard.value = false

		
		wordinfo.value = wordList.value[0]

		
		playUserRecord(wordinfo.value.voice)
		getOptions(wordinfo.value.id)
	}
	onUnload(() => {
		if (innerAudioContext) {
			innerAudioContext.stop()
			innerAudioContext.destroy()
		}
	})
	onLoad(() => {
		getAllWords()
	})
</script>

<style lang="scss">
	
	$bg-color: #ffffff;
	$block-bg: #f7f8fa; 
	$primary-color: #07C160; 
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

	
	.progress-bar {
		height: 8rpx;
		background-color: #f0f0f0;
		width: 100%;
	}

	.progress-fill {
		height: 100%;
		background-color: $primary-color;
		border-radius: 0 8rpx 8rpx 0;
		transition: width 0.3s ease;
	}

	.dictation-wrap {
		padding: 40rpx;
	}

	
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
			
			
		}

		.audio-hint {
			font-size: 26rpx;
			color: $text-sub;
		}
	}

	.divider-wrap {
		margin: 40rpx 0 20rpx;
	}

	
	.options {
		display: flex;
		flex-direction: column;
		gap: 24rpx;

		.option-item {
			background-color: $block-bg;
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

	
	.detail-block {
		margin-top: 40rpx;
		padding: 30rpx 40rpx;
		background-color: $block-bg;
		
		border-radius: 24rpx;
		

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

	
	.continue-wrap {
		display: flex;
		justify-content: center;
		margin-top: 60rpx;
	}

	.continue-btn {
		background-color: $primary-color;
		color: white;
		padding: 24rpx 60rpx;
		border-radius: 1998rpx;
		
		display: flex;
		align-items: center;
		gap: 12rpx;
		font-size: 30rpx;
		font-weight: 500;
		

		&:active {
			opacity: 0.8;
		}

		.icon-right {
			font-size: 28rpx;
		}
	}

	
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
		border-radius: 1998rpx;
		
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
		
		color: $text-main;
		
	}
</style>