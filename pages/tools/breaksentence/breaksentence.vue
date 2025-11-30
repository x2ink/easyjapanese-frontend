<template>
	<view class="container">
		<NavbarDefault title="句子拆分"></NavbarDefault>
		
		<view class="content-wrapper">
			<view class="form-group">
				<textarea 
					v-model="sentence" 
					class="form-textarea" 
					placeholder="请输入需要拆分的日语句子..." 
					maxlength="500"
				></textarea>
				<view class="word-count">{{ sentence.length }}/500</view>
			</view>

			<button @click="handleBreak" class="action-btn" :loading="loading" :disabled="loading">
				<i class="fas fa-cut" style="margin-right: 8px;"></i> 拆分句子
			</button>

			<view v-if="resultList.length > 0" class="result-area">
				<view class="result-header">
					<text class="title">拆分结果</text>
					<view class="actions">
						<text class="copy-btn" @click="copyResult">复制结果</text>
					</view>
				</view>
				
				<view class="token-list">
					<view v-for="(item, index) in resultList" :key="index" class="token-item">
						<text class="token-reading">{{ item.hiragana || '&nbsp;' }}</text>
						<text class="token-surface">{{ item.surface }}</text>
						<view class="token-pos-tag">
							{{ item.pos[0] }}
						</view>
					</view>
				</view>
			</view>

			<wd-status-tip v-if="!loading && resultList.length === 0 && searched" image="search" tip="未找到结果或解析失败" />
		</view>
		
		<wd-toast />
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	import NavbarDefault from "@/components/navbar/default"
	import $http from "@/api/common.js"
	import { useToast } from '@/uni_modules/wot-design-uni'
	import { copy } from "@/utils/common.js"

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
	page {
		background-color: #f5f5f5;
	}
</style>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.content-wrapper {
		padding: 16px;
		padding-bottom: 40px;
	}

	.form-group {
		position: relative;
		margin-bottom: 24px;
		background-color: #fff;
		border-radius: 12px;
		padding: 16px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	}

	.form-textarea {
		width: 100%;
		height: 120px;
		font-size: 16px;
		line-height: 1.6;
		color: #333;
		border: none;
		outline: none;
	}

	.word-count {
		position: absolute;
		bottom: 12px;
		right: 16px;
		font-size: 12px;
		color: #999;
	}

	.action-btn {
		background: linear-gradient(135deg, #07C160, #05a350);
		color: white;
		border: none;
		border-radius: 50px;
		padding: 12px 0;
		font-size: 16px;
		font-weight: 600;
		box-shadow: 0 4px 12px rgba(7, 193, 96, 0.3);
		display: flex;
		justify-content: center;
		align-items: center;
		
		&:active {
			transform: scale(0.98);
			box-shadow: 0 2px 6px rgba(7, 193, 96, 0.2);
		}
		
		&[disabled] {
			background: #a0dec0;
			box-shadow: none;
		}
	}

	.result-area {
		margin-top: 24px;
		background-color: #fff;
		border-radius: 12px;
		padding: 16px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
		
		.result-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 16px;
			padding-bottom: 12px;
			border-bottom: 1px solid #f0f0f0;
			
			.title {
				font-size: 16px;
				font-weight: bold;
				color: #333;
				border-left: 4px solid #07C160;
				padding-left: 8px;
			}
			
			.copy-btn {
				font-size: 13px;
				color: #07C160;
				padding: 4px 8px;
				background-color: rgba(7, 193, 96, 0.1);
				border-radius: 4px;
				
				&:active {
					opacity: 0.7;
				}
			}
		}
	}

	.token-list {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	.token-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 8px 10px;
		background-color: #f9f9f9;
		border-radius: 8px;
		border: 1px solid #eee;
		min-width: 40px;
		transition: all 0.3s;
		
		&:hover {
			border-color: #07C160;
			background-color: #f0fdf4;
		}

		.token-reading {
			font-size: 12px;
			color: #888;
			margin-bottom: 2px;
			min-height: 16px; // 防止没有读音时高度塌陷
		}

		.token-surface {
			font-size: 18px;
			font-weight: 500;
			color: #333;
			margin-bottom: 4px;
		}

		.token-pos-tag {
			font-size: 10px;
			color: #07C160;
			background-color: rgba(7, 193, 96, 0.1);
			padding: 2px 6px;
			border-radius: 4px;
		}
	}
</style>