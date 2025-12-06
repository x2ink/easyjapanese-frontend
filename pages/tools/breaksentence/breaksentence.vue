<template>
	<view class="container">
		<NavbarDefault title="句子拆分"></NavbarDefault>

		<scroll-view scroll-y class="content-scroll" :enable-back-to-top="true">
			<view class="content-wrapper">

				<view class="input-block">
					<view class="block-header">
						<i class="fas fa-pen" style="color: #999; font-size: 28rpx; margin-right: 12rpx;"></i>
						<text class="block-title">输入句子</text>
					</view>
					<textarea v-model="sentence" class="custom-textarea" placeholder="请输入需要拆分的日语句子..." maxlength="500"
						:disable-default-padding="true"></textarea>
					<view class="word-count">{{ sentence.length }}/500</view>
				</view>

				<button @click="handleBreak" class="action-btn" :loading="loading" :disabled="loading">
					{{ loading ? '拆分中...' : '拆分句子' }}
				</button>

				<view v-if="resultList.length > 0" class="result-block">
					<view class="result-header">
						<text class="block-title">拆分结果</text>
						<view class="copy-action" @click="copyResult">
							<i class="fas fa-copy" style="margin-right: 8rpx;"></i> 复制
						</view>
					</view>

					<view class="token-list">
						<view v-for="(item, index) in resultList" :key="index" class="token-item">
							<text class="token-reading">{{ item.hiragana || '' }}</text>
							<text class="token-surface">{{ item.surface }}</text>
							<view class="token-pos-tag">
								{{ item.pos[0] }}
							</view>
						</view>
					</view>
				</view>

				<wd-status-tip v-if="!loading && resultList.length === 0 && searched" image="search" tip="未找到结果或解析失败" />
			</view>
		</scroll-view>

		<wd-toast />
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import NavbarDefault from "@/components/navbar/default"
	import $http from "@/api/common.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	import {
		copy
	} from "@/utils/common.js"

	const toast = useToast()
	const sentence = ref('')
	const loading = ref(false)
	const resultList = ref([])
	const searched = ref(false)

	// 片假名转平假名函数
	const katakanaToHiragana = (str) => {
		if (!str) return '';
		return str.replace(/[\u30a1-\u30f6]/g, function(match) {
			var chr = match.charCodeAt(0) - 0x60;
			return String.fromCharCode(chr);
		});
	}

	const handleBreak = async () => {
		if (!sentence.value.trim()) {
			toast.warning('请输入句子')
			return
		}

		loading.value = true
		searched.value = true
		resultList.value = []

		try {
			const res = await $http.breakSentence({
				sentence: sentence.value
			})

			if (res.data && Array.isArray(res.data)) {
				// 处理返回的数据，添加平假名转换
				resultList.value = res.data.map(item => {
					return {
						...item,
						hiragana: katakanaToHiragana(item.pronunciation)
					}
				})
			}
		} catch (e) {
			console.error(e)
			toast.error('拆分失败，请稍后重试')
		} finally {
			loading.value = false
		}
	}

	const copyResult = () => {
		if (resultList.value.length === 0) return
		const text = resultList.value.map(item => item.surface).join(' | ')
		copy(text)
	}
</script>

<style>
	/* 页面整体纯白背景 */
	page {
		background-color: #ffffff;
		height: 100%;
		overflow: hidden;
	}
</style>

<style lang="scss" scoped>
	.container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
		overflow: hidden;
	}

	.content-scroll {
		flex: 1;
		height: 0;
		width: 100%;
	}

	.content-wrapper {
		padding: 24rpx 40rpx 80rpx;
		/* 增加内边距，保持通透 */
	}

	/* --- 输入色块 --- */
	.input-block {
		background-color: #f7f8fa;
		/* 浅灰背景 */
		border-radius: 32rpx;
		/* 大圆角 */
		padding: 32rpx;
		margin-bottom: 48rpx;
		position: relative;
	}

	.block-header {
		display: flex;
		align-items: center;
		margin-bottom: 24rpx;
	}

	.block-title {
		font-size: 28rpx;
		color: #999;
		font-weight: 600;
	}

	.custom-textarea {
		width: 100%;
		height: 240rpx;
		font-size: 32rpx;
		line-height: 1.6;
		color: #333;
		border: none;
		outline: none;
		background: transparent;
		/* 透明背景，透出父级色块 */
	}

	.word-count {
		text-align: right;
		font-size: 24rpx;
		color: #ccc;
		margin-top: 16rpx;
	}

	/* --- 按钮样式 --- */
	.action-btn {
		background: #07C160;
		color: white;
		border: none;
		border-radius: 200rpx;
		line-height: 90rpx;
		font-size: 28rpx;
		font-weight: 600;
		box-shadow: none;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 60rpx;
		&:active {
			opacity: 0.85;
			transform: none;
			box-shadow: none;
		}

		&[disabled] {
			background: #a0dec0;
			opacity: 1;
		}
	}

	/* --- 结果色块 --- */
	.result-block {
		background-color: #f7f8fa;
		border-radius: 32rpx;
		padding: 32rpx;

		.result-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 32rpx;

			.copy-action {
				font-size: 26rpx;
				color: #07C160;
				font-weight: 500;
				display: flex;
				align-items: center;
				padding: 8rpx 16rpx;
				border-radius: 8rpx;
				transition: background-color 0.2s;

				&:active {
					background-color: rgba(7, 193, 96, 0.1);
				}
			}
		}
	}

	.token-list {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
	}

	.token-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 16rpx 24rpx;
		/* Token 使用纯白背景，与浅灰底色形成对比 */
		background-color: #ffffff;
		border-radius: 16rpx;
		/* 去除边框线 */
		border: none;
		min-width: 80rpx;
		transition: transform 0.2s;

		/* 极轻微的交互反馈 */
		&:active {
			transform: scale(0.98);
			background-color: #fafafa;
		}

		.token-reading {
			font-size: 22rpx;
			color: #999;
			margin-bottom: 4rpx;
			min-height: 28rpx;
		}

		.token-surface {
			font-size: 34rpx;
			font-weight: 500;
			color: #333;
			margin-bottom: 8rpx;
		}

		.token-pos-tag {
			font-size: 20rpx;
			color: #07C160;
			background-color: rgba(7, 193, 96, 0.08);
			/* 非常淡的绿色背景 */
			padding: 4rpx 12rpx;
			border-radius: 8rpx;
			font-weight: 500;
		}
	}
</style>