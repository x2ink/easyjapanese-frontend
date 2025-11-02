<template>
	<scroll-view scroll-y="true" style="height: 100vh;">
		<view class="content-container">
			<!-- 顶部区 -->
			<view class="word-header" :style="{ paddingTop: `calc(${navBarHeight} + 4px)` }">
				<view class="back-btn" @click="back">
					<text class="fas fa-arrow-left"></text>
				</view>
				<view class="word-header-content">
					<view class="row-bt-top">
						<view>
							<view class="word-title">{{ jcinfo.words.join('·') }}</view>
							<view class="word-reading">{{ jcinfo.kana }} · {{ jcinfo.rome }}</view>
							<view class="pitch-accent">
								<view class="pitch-accent-bar" style="width: 40%; left: 30%;"></view>
							</view>
						</view>

						<view class="row-mid" style="gap: 8px;">
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
				<!-- 词性与释义 -->
				<view v-for="item in jcinfo.detail" :key="item.type" class="card">
					<!-- <view class="text-bold mb-9">词性</view> -->
					<view class="row-bt-mid mb-12">
						<view><text class="tag tag-blue">{{ item.type }}</text></view>
					</view>
					<!-- <view class="text-bold mb-9">释义</view> -->
					<view v-for="(meaning, index) in item.meanings" :key="`meaning-${index}`">
						<view style="font-weight: bold;">{{ meaning.zh }}</view>
						<view class="examples">
							<view class="example" v-for="(e, i) in meaning.examples" :key="`example-${i}`">
								<view>
									<view class="ja">{{ e.jp }}</view>
									<view class="ch">{{ e.zh }}<i style="font-size: 12px;" class="fas fa-volume-up"></i>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<!-- 相关单词 -->
			<!-- 	<view class="card">
					<view class="text-bold mb-12">相关单词</view>
					<view class="grid-2">
						<view v-for="(item, index) in relatedWords" :key="index" class="related-item">
							<view class="text-bold">{{ item.word }}</view>
							<view class="text-xs text-gray">{{ item.kana }}</view>
						</view>
					</view>
				</view> -->

				<!-- 占位 -->
				<view style="height: calc(env(safe-area-inset-bottom) + 40px)"></view>
			</view>
			<!-- 操作 -->
			<view @click="openSheet()" class="sheet _GCENTER">
				<text class="fa-regular fa-pen-to-square"></text>
				<view>
					操作
				</view>
			</view>
			<wd-toast />
		</view>
	</scroll-view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import $http from '@/api/index.js'
	import {
		goPage,
		back
	} from '@/utils/common.js'
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	import {
		userStore
	} from '@/stores/index.js'
	import word from '../../../api/word'
	const toast = useToast()
	const navBarHeight = ref(0)
	const jcinfo = ref({
		words: [],
		detail: []
	})
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
	const openSheet = () => {
		wx.showActionSheet({
			itemList: ["加入单词本", "问题反馈"],
			success(e) {
				if (e.tapIndex == 0) {
					goPage("/pages/word/thesaurus/thesaurus", {
						self: true,
						wordId: jcinfo.value.id
					})
				} else if (e.tapIndex == 1) {
					goPage("/pages/other/feedback/feedback", {
						type: "单词纠错",
						wordId: jcinfo.value.id,
						wordType: 'jc'
					})
				}
			}
		})
	}
	const relatedWords = [{
			word: '飲む',
			kana: 'のむ'
		},
		{
			word: '料理',
			kana: 'りょうり'
		},
		{
			word: '食堂',
			kana: 'しょくどう'
		},
		{
			word: 'お腹',
			kana: 'おなか'
		}
	]
</script>

<style lang="scss" scoped>
	.sheet {
		font-size: 12px;
		flex-direction: column;
		position: fixed;
		bottom: 40px;
		right: 20px;
		background-color: white;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

		text {
			font-size: 18px;
			margin-bottom: 4px;
		}
	}

	.row {
		display: flex;
	}

	.row-mid {
		display: flex;
		align-items: center;
	}

	.row-top {
		display: flex;
		align-items: flex-start;
	}

	.row-bt-mid {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.row-bt-top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.text-bold {
		font-weight: bold;
	}

	.text-gray {
		color: #6b7280;
	}

	.text-xs {
		font-size: 12px;
	}

	.mb-9 {
		margin-bottom: 9px;
	}

	.mb-12 {
		margin-bottom: 12px;
	}

	.content-container {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.word-header {
		position: sticky;
		top: 0;
		background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
		color: #fff;
		padding: 0 16px 32px;
	}

	.back-btn {
		color: #fff;
		font-size: 22px;
	}

	.word-header-content {
		margin-top: 16px;
	}

	.word-title {
		font-size: 28px;
		font-weight: bold;
		margin-bottom: 8px;
	}

	.word-reading {
		font-size: 14px;
		opacity: 0.9;
	}

	.pitch-accent {
		height: 2px;
		background: #e0e0e0;
		margin-top: 8px;
		position: relative;

		.pitch-accent-bar {
			position: absolute;
			height: 4px;
			top: -1px;
			background: #07c160;
			border-radius: 2px;
		}
	}

	.action-btn {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.2);
		color: #fff;
		font-size: 18px;
		border: none;
	}

	.main-content {
		flex: 1;
		overflow: auto;
		padding: 16px;
	}

	.card {
		background: #fff;
		border-radius: 9px;
		padding: 16px;
		margin-bottom: 16px;
	}

	.tag {
		display: inline-block;
		padding: 4px 12px;
		border-radius: 4px;
		font-size: 14px;
		margin-right: 8px;
	}

	.tag-blue {
		background: #dbeafe;
		color: #2563eb;
	}

	.examples {
		margin: 10px 0;
		display: flex;
		flex-direction: column;
		gap: 12px;

		.example {
			border-left: 3px solid #07c160;
			padding-left: 12px;

			.ja {
				font-size: 14px;
			}

			.ch {
				padding-top: 4px;
				font-size: 14px;
				color: #6b7280;
			}
		}
	}

	.grid-2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 9px;
	}

	.related-item {
		padding: 9px;
		border-radius: 4.5px;
		background: #f9fafb;
	}
</style>