<template>
	<view class="scroll-container">
		<view class="word-header" :style="{ paddingTop: `calc(${navBarHeight} + 8rpx)` }">
			<view class="back-btn" @click="back">
				<text class="fas fa-arrow-left"></text>
			</view>
			<view class="word-header-content">
				<view class="header-row">
					<view>
						<view class="word-title">{{ jcinfo.words.join('·') }}</view>
						<view class="word-reading">{{ jcinfo.kana }} · {{ jcinfo.rome }}</view>
						<view class="pitch-accent">
							<view class="pitch-accent-bar" style="width: 40%; left: 30%;"></view>
						</view>
					</view>
					<view class="action-buttons">
						<view @click="playUserRecord(jcinfo.voice)" class="action-btn">
							<text class="fas fa-volume-up"></text>
						</view>
						<view @click="goPage('/pages/word/followread/followread', {
							id: id,
							word: JSON.stringify({id:jcinfo.id, words: jcinfo.words, kana: jcinfo.kana, description: jcinfo.description })
						})" class="action-btn">
							<text class="fas fa-microphone"></text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="main-content">
			<view v-for="item in jcinfo.detail" :key="item.type" class="card">
				<view class="card-header">
					<view><text class="tag tag-blue">{{ item.type }}</text></view>
				</view>
				<view v-for="(meaning, index) in item.meanings" :key="`meaning-${index}`">
					<view class="meaning-text">{{ meaning.zh }}</view>
					<view class="examples">
						<view class="example" v-for="(e, i) in meaning.examples" :key="`example-${i}`">
							<view
								@click="playUserRecord(`https://jpx2ink.oss-cn-shanghai.aliyuncs.com/audio/dict/jc/${jcinfo.id}/${e.voice}`)">
								<view class="ja" v-html="renderRubyHTMLWeb(e.read)"></view>
								<view class="ch">{{ e.zh }}<i class="volume-icon fas fa-volume-up"></i>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="bottom-space"></view>
		</view>
		<view @click="openSheet()" class="sheet-btn _GCENTER">
			<text class="fa-regular fa-pen-to-square"></text>
			<view>操作</view>
		</view>
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		onLoad,
		onUnload
	} from '@dcloudio/uni-app'
	import $http from '@/api/index.js'
	import {
		goPage,
		back
	} from '@/utils/common.js'
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	import word from '@/api/word'
	const toast = useToast()
	const navBarHeight = ref(0)
	const jcinfo = ref({
		words: [],
		detail: []
	})
	const renderRubyHTMLWeb = (rubyList) => {
		return rubyList.map(item => `<ruby>${item.base}<rt>${item.ruby}</rt></ruby>`).join('');
	}
	const id = ref(null)
	const getJcInfo = async () => {
		const res = await $http.word.jcInfo({
			id: id.value
		})
		jcinfo.value = res.data
	}

	const innerAudioContext = uni.createInnerAudioContext()
	innerAudioContext.autoplay = false
	const playUserRecord = url => {
		innerAudioContext.stop()
		innerAudioContext.src = url
		innerAudioContext.play()
	}

	onMounted(() => {
		const {
			statusBarHeight
		} = uni.getSystemInfoSync()
		navBarHeight.value = statusBarHeight + 'px'
	})

	onLoad(e => {
		id.value = e.id
		getJcInfo()
	})
	onUnload(() => {
		if (innerAudioContext) {
			innerAudioContext.stop()
			innerAudioContext.destroy()
		}
	})
	const openSheet = () => {
		wx.showActionSheet({
			itemList: ["加入单词本", "记笔记", "编辑单词", "问题反馈"],
			success(e) {
				if (e.tapIndex == 0) {
					goPage("/pages/word/thesaurus/thesaurus", {
						self: true,
						wordId: jcinfo.value.id
					})
				} else if (e.tapIndex == 1) {
					goPage("/pages/tools/addnote/addnote", {
						id: jcinfo.value.id,
						type: 'word_jp'
					})
				} else if (e.tapIndex == 2) {
					goPage("/pages/word/editword/editword", {
						wordId: jcinfo.value.id
					})
				} else if (e.tapIndex == 3) {
					goPage("/pages/other/feedback/feedback", {
						type: "单词纠错",
						wordId: jcinfo.value.id,
						wordType: 'jc'
					})
				}
			}
		})
	}
</script>
<style>
	page {
		background-color: white;
	}
</style>
<style lang="scss" scoped>
	
	.flex-between {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}


	.mb-12 {
		margin-bottom: 24rpx;
	}

	
	.scroll-container {
		height: 100vh;
		overflow-y: hidden;
		display: flex;
		flex-direction: column;
	}

	.content-container {
		display: flex;
		flex-direction: column;
		min-height: 100%;
	}


	.word-header {
		flex-shrink: 0;
		background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
		color: #fff;
		padding: 0 32rpx 64rpx;
		z-index: 100;
	}

	.back-btn {
		color: #fff;
		font-size: 44rpx;
	}

	.word-header-content {
		margin-top: 32rpx;
	}

	.header-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.action-buttons {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}

	.word-title {
		font-size: 56rpx;
		font-weight: bold;
		margin-bottom: 16rpx;
	}

	.word-reading {
		font-size: 28rpx;
		opacity: 0.9;
	}

	.pitch-accent {
		height: 4rpx;
		background: #e0e0e0;
		margin-top: 16rpx;
		position: relative;

		.pitch-accent-bar {
			position: absolute;
			height: 8rpx;
			top: -2rpx;
			background: #07c160;
			border-radius: 4rpx;
		}
	}

	.action-btn {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.2);
		color: #fff;
		font-size: 36rpx;
		border: none;
	}

	.main-content {
		flex: 1;
		padding: 32rpx;
		overflow: auto;
	}

	.card {
		padding: 16rpx;
	}

	.card-header {
		@extend .flex-between;
		margin-bottom: 24rpx;
	}

	.tag {
		display: inline-block;
		padding: 8rpx 24rpx;
		border-radius: 8rpx;
		font-size: 28rpx;
	}

	.tag-blue {
		background: #E8F5E9;
		color: #2E7D32;
	}

	.meaning-text {
		font-weight: bold;
	}

	.examples {
		margin: 20rpx 0;
		display: flex;
		flex-direction: column;
		gap: 24rpx;
	}

	.example {
		border-radius: 16rpx;
		padding: 24rpx;
		background-color: #f8f9fa;

		.ja {
			font-size: 28rpx;
		}

		.ch {
			padding-top: 8rpx;
			font-size: 28rpx;
			color: #6b7280;
		}
	}

	.volume-icon {
		font-size: 24rpx;
		color: #07C160;
		margin-left: 8rpx;
	}

	.bottom-space {
		height: env(safe-area-inset-bottom);
	}

	
	.sheet-btn {
		flex-direction: column;
		font-size: 24rpx;
		position: fixed;
		bottom: 80rpx;
		right: 40rpx;
		background-color: white;
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		box-shadow: rgba(100, 100, 111, 0.2) 0rpx 14rpx 58rpx 0rpx;

		text {
			font-size: 36rpx;
			margin-bottom: 8rpx;
		}
	}
</style>