<template>
	<scroll-view scroll-y="true" class="scroll-container">
		<view class="content-container">
			<!-- 顶部区 -->
			<view class="word-header" :style="{ paddingTop: `calc(${navBarHeight} + 4px)` }">
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
				<!-- 占位 -->
				<view class="bottom-space"></view>
			</view>
			<!-- 操作 -->
			<view @click="openSheet()" class="sheet-btn _GCENTER">
				<text class="fa-regular fa-pen-to-square"></text>
				<view>操作</view>
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
</script>
<style>
	page {
		background-color: white;
	}
</style>
<style lang="scss" scoped>
	/* 通用样式 */
	.flex-between {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}


	.mb-12 {
		margin-bottom: 12px;
	}

	/* 布局容器 */
	.scroll-container {
		height: 100vh;
	}

	.content-container {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	/* 头部区域 */
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

	.header-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.action-buttons {
		display: flex;
		align-items: center;
		gap: 8px;
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

	/* 主要内容区域 */
	.main-content {
		flex: 1;
		overflow: auto;
		padding: 16px;
	}

	.card {
		padding: 8px;
	}

	.card-header {
		@extend .flex-between;
		margin-bottom: 12px;
	}

	.tag {
		display: inline-block;
		padding: 4px 12px;
		border-radius: 4px;
		font-size: 14px;
	}

	.tag-blue {
		background: #E8F5E9;
		color: #2E7D32;
	}

	.meaning-text {
		font-weight: bold;
	}

	.examples {
		margin: 10px 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.example {
		border-radius: 8px;
		padding: 12px;
		background-color: #f8f9fa;

		.ja {
			font-size: 14px;
		}

		.ch {
			padding-top: 4px;
			font-size: 14px;
			color: #6b7280;
		}
	}

	.volume-icon {
		font-size: 12px;
		color: #07C160;
		margin-left: 4px;
	}

	.bottom-space {
		height: calc(env(safe-area-inset-bottom) + 40px);
	}

	/* 操作按钮 */
	.sheet-btn {
		flex-direction: column;
		font-size: 12px;
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
</style>