<template>
	<view class="head">
		<NavbarDefault border title="单词听写"></NavbarDefault>
	</view>
	<view class="progress-bar">
		<view class="progress-fill" :style="{width:`${progress}%`}"></view>
	</view>
	
	<div v-if="isBatchComplete" class="container">
		<div class="completion-icon">
			<i class="fa-solid fa-circle-check"></i>
		</div>
		<h1 class="completion-title">本组听写完成！</h1>
		<p class="completion-desc">
			你已经完成了本组的{{doneList.length}}个单词听写<br>
			<text v-if="serverRemaining > 0" style="font-size: 14px; color: #999; margin-top: 8px; display: block;">
				今日剩余待听写: {{serverRemaining}} 个
			</text>
			<text v-else>今日任务已全部完成，太棒了！</text>
		</p>
		<div class="button-container">
			<button v-if="serverRemaining > 0" class="primary-button" @click="getAllWords()">继续听写</button>
			<button class="secondary-button" @click="goLearn()">去学习新词</button>
		</div>
	</div>
	
	<view v-else>
		<view class="word-display _GCENTER">
			<button @click="playUserRecord(wordinfo.voice)" class="pronounce-btn pronounce-header" title="发音">
				<text class="fas fa-volume-up"></text>
			</button>
			<view style="margin-top: 20px; color: #999; font-size: 14px;">点击喇叭再次播放</view>
		</view>
		
		<wd-divider>请选择正确答案</wd-divider>
		
		<view class="options">
			<view 
				:class="['option', item.class]" 
				@click="select(index,item)" 
				class="option" 
				v-for="(item,index) in options"
				:key="item.word.id"
			>
				<view class="index _GCENTER">
					{{optionKey.get(index)}}
				</view>
				<view class="option-text">
					{{item.word.description}}
				</view>
				
				<view v-if="item.class=='fail'" class="anwser _GCENTER fail-bg">
					<text class="fa-solid fa-xmark"></text>
				</view>
				<view v-if="item.class=='success'" class="anwser _GCENTER success-bg">
					<text class="fa-solid fa-check"></text>
				</view>
			</view>
		</view>

		<view class="_GCENTER" v-if="showManualContinue">
			<view class="continue" @click="getNext()">
				<text>继续下一个</text>
				<i style="font-size: 22px;" class="fa-solid fa-arrow-right"></i>
			</view>
		</view>
		
		<view v-if="showDetailCard" @click="goPage('/pages/word/worddetail/worddetail',{ id:wordinfo.id })" class="word-card">
			<view class="card-header">
				<view>
					<view class="card-japanese">{{formatWordName(wordinfo.words,wordinfo.kana)}}</view>
					<view class="card-pronunciation">{{wordinfo.rome}}</view>
				</view>
				<view class="icon">
					<i class="fa-solid fa-chevron-right"></i>
				</view>
			</view>
		</view>
	</view>
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
		useToast
	} from '@/uni_modules/wot-design-uni'

	const toast = useToast()
	const optionKey = new Map([[0, 'A'], [1, 'B'], [2, 'C'], [3, 'D']])
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

			// 4. 自动跳转 (延迟改为 1000ms)
			setTimeout(() => {
				getNext()
			}, 1000)
			
		} else {
			// --- 答错逻辑 ---
			options.value[index].class = "fail"
			// 标出正确答案
			let correctIndex = options.value.findIndex(it => it.anwser)
			if(correctIndex !== -1) options.value[correctIndex].class = "success"
			
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
			const res = await $http.word.getListenOptions({ wordId: id })
			options.value = res.data
		} catch (e) {
			console.error(e)
			toast.error("选项加载失败")
		}
	}

	const getAllWords = async () => {
		uni.showLoading({ title: '加载单词中' })
		try {
			const res = await $http.word.getLearnt({ filter: "listen" })
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
	page {
		background-color: white;
	}
	
	.head {
		position: sticky;
		top: 0;
		z-index: 9;
		background: white;
	}

	/* 进度条 */
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

	/* 单词发音展示区 */
	.word-display {
		background-color: #FFFFFF;
		padding: 32px 24px;
		flex-direction: column;
	}

	.pronounce-btn {
		width: 90px;
		height: 90px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #07C160;
		box-shadow: 0 4px 12px rgba(7, 193, 96, 0.3);
		border-radius: 50%;
		border: none;
		color: #ffffff;
		font-size: 32px;
		margin: 0;
		transition: transform 0.1s;
		
		&:active {
			transform: scale(0.95);
		}
	}

	/* 选项样式 */
	.options {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 24px 16px;

		.option {
			border-radius: 12px;
			padding: 16px;
			background-color: #F9FAFB;
			border: 1px solid #E5E7EB;
			display: flex;
			align-items: center;
			gap: 16px;
			position: relative;
			transition: all 0.2s;

			&:active {
				background-color: #F3F4F6;
			}
			
			&.success {
				border-color: #10B981;
				background-color: #ECFDF5;
				color: #065F46;
			}
			
			&.fail {
				border-color: #EF4444;
				background-color: #FEF2F2;
				color: #991B1B;
			}

			.index {
				border-radius: 50%;
				width: 32px;
				height: 32px;
				background-color: #E5E7EB;
				color: #4B5563;
				font-weight: 600;
				font-size: 14px;
				flex-shrink: 0;
			}
			
			.option-text {
				flex: 1;
				font-size: 16px;
				line-height: 1.4;
			}

			.anwser {
				border-radius: 50%;
				height: 24px;
				width: 24px;
				color: white;
				font-size: 14px;
				flex-shrink: 0;
			}
			
			.success-bg { background-color: #10B981; }
			.fail-bg { background-color: #EF4444; }
		}
	}

	/* 单词详情卡片 - 阴影优化 */
	.word-card {
		margin: 0 16px 24px;
		padding: 16px 20px;
		background: white;
		border: 1px solid #F3F4F6; /* 边框也稍微变淡一点 */
		border-radius: 12px;
		/* 修改点：更柔和简约的阴影 */
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03); 
		transition: opacity 0.2s;
		
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
		color: #111827;
		margin-bottom: 4px;
	}

	.card-pronunciation {
		font-size: 14px;
		color: #6B7280;
	}

	/* 底部继续按钮区 */
	.continue {
		background-color: #07C160;
		color: white;
		padding: 12px 32px;
		border-radius: 50px;
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 16px;
		font-weight: 600;
		margin-bottom: 24px;
		box-shadow: 0 4px 12px rgba(7, 193, 96, 0.25);
	}

	/* 完成页容器 */
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
</style>