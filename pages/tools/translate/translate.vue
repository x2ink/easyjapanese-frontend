<template>
	<view class="container">
		<NavbarDefault title="翻译助手"></NavbarDefault>

		<scroll-view scroll-y class="content-scroll" :enable-back-to-top="true">
			<view class="content-wrapper">
				
				<view class="mode-switch">
					<view 
						class="mode-item" 
						:class="{ active: current === '标准翻译' }" 
						@click="current = '标准翻译'"
					>
						标准翻译
					</view>
					<view 
						class="mode-item" 
						:class="{ active: current === 'AI翻译' }" 
						@click="current = 'AI翻译'"
					>
						AI 深度解析
					</view>
				</view>

				<view class="input-block">
					<view v-if="current === '标准翻译'" class="block-header">
						<view class="lang-opt" :class="{ active: pattern === 'cj' }">中文</view>
						<view class="swap-btn" @click="patternChange">
							<i class="fas fa-exchange-alt"></i>
						</view>
						<view class="lang-opt" :class="{ active: pattern === 'jc' }">日语</view>
					</view>
					
					<view v-else class="block-header ai-header">
						<i class="fas fa-robot" style="margin-right: 12rpx;"></i>
						<text>AI 智能助手</text>
					</view>

					<textarea 
						v-model="value" 
						class="custom-textarea" 
						:placeholder="current === '标准翻译' ? '请输入内容...' : '输入句子，AI 将为您解析...'" 
						maxlength="1000"
						:disable-default-padding="true"
					></textarea>
					
					<view class="word-count">{{ value.length }}/1000</view>
				</view>

				<button @click="submit" class="submit-btn" :loading="loading" :disabled="loading">
					{{ loading ? '翻译中...' : '开始翻译' }}
				</button>

				<view v-if="result || loading" class="result-block">
					<view class="block-header">
						<text class="block-title">结果</text>
						<view class="actions">
							<view v-if="current === '标准翻译' && result" class="icon-btn" @click="playVoice">
								<i class="fas fa-volume-up"></i>
							</view>
							<view v-if="result" class="icon-btn" @click="copy(result)">
								<i class="fas fa-copy"></i>
							</view>
						</view>
					</view>
					
					<view v-if="loading" class="loading-wrap">
						<view class="dot-spinner">
							<view class="dot"></view>
							<view class="dot"></view>
							<view class="dot"></view>
						</view>
					</view>

					<view v-else class="result-text">
						<text v-if="current === '标准翻译'" user-select>{{ result }}</text>
						<view v-else class="ai-content" v-html="result"></view>
					</view>
				</view>

				<view v-if="!loading && !result" class="empty-tip">
					在上方输入内容即可开始翻译
				</view>
			</view>
		</scroll-view>

		<ChatSSEClient ref="chatSSEClientRef" @onOpen="openCore" @onError="errorCore" @onMessage="messageCore" @onFinish="finishCore" />
		<wd-toast />
	</view>
</template>

<script setup>
	import { ref, computed, watch } from 'vue'
	import NavbarDefault from "@/components/navbar/default"
	import { useToast } from '@/uni_modules/wot-design-uni'
	import { copy, getOs } from "@/utils/common.js"
	import ChatSSEClient from "@/components/gao-ChatSSEClient/gao-ChatSSEClient.vue";
	import sha256 from 'crypto-js/sha256';

	const toast = useToast()
	const current = ref('标准翻译')
	const value = ref("")
	const result = ref("")
	const loading = ref(false)
	const pattern = ref('cj')
	const chatSSEClientRef = ref(null)

	// AI 提示词配置 (保持简洁，不展示复杂代码)
	const content = ref(
		`你是一个中日翻译，我会给你中文或者日文，然后你翻译为日文或者中文，并且我还要你对翻译进行讲解，为什么这么翻译，这句话用了哪些语法点，返回html格式如下<div class="ai-box"><h3 class="ai-h3">翻译：</h3><p class="ai-p">这里是翻译内容。</p></div><div class="ai-box"><h3 class="ai-h3">解析：</h3><p class="ai-p">这里是解析内容。</p></div>`
	)

	watch(current, () => {
		result.value = ""
		loading.value = false
	})

	const fromTo = computed(() => {
		return pattern.value == "cj" ? { 'from': 'zh-CHS', 'to': 'ja' } : { 'from': 'ja', 'to': 'zh-CHS' }
	})

	const patternChange = () => {
		pattern.value = pattern.value == 'jc' ? 'cj' : 'jc'
	}

	const playVoice = () => {
		toast.warning(`朗读服务开发中`)
	}

	const truncate = (q) => {
		var len = q.length;
		if (len <= 20) return q;
		return q.substring(0, 10) + len + q.substring(len - 10, len);
	}

	const submit = () => {
		if (value.value.trim().length == 0) {
			toast.warning(`内容不可为空`)
			return
		}
		if (current.value == "标准翻译") {
			ydsubmit()
		} else {
			aisubmit()
		}
	}

	const ydsubmit = async () => {
		loading.value = true
		result.value = "" 
		let appKey = '56120852712fa563';
		let key = 'Tyg8O47AvACFjpzh3acoEaFs85VpfuJ2';
		let salt = (new Date).getTime();
		let curtime = Math.round(new Date().getTime() / 1000);
		let query = value.value;
		let str1 = appKey + truncate(query) + salt + curtime + key;
		var sign = sha256(str1).toString();
		
		uni.request({
			url: 'https://openapi.youdao.com/api',
			method: "GET",
			data: {
				q: query,
				appKey: appKey,
				salt: salt,
				...fromTo.value,
				sign: sign,
				signType: "v3",
				curtime: curtime,
			},
			success: function(res) {
				if (res.data && res.data.translation) {
					result.value = res.data.translation[0]
				} else {
					toast.error("翻译失败")
				}
			},
			fail: () => {
				toast.error("网络请求失败")
			},
			complete: () => {
				loading.value = false
			}
		})
	}

	const aisubmit = async () => {
		loading.value = true
		result.value = ""
		chatSSEClientRef.value.startChat({
			url: "https://api.deepseek.com/chat/completions",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
				"Authorization": "Bearer sk-7f2affcd4e1549b8b53b08d5afca6077",
			},
			body: {
				messages: [
					{ content: content.value, role: "system" },
					{ content: value.value, role: "user" }
				],
				model: "deepseek-chat",
				stream: true,
				temperature: 1.3,
			}
		})
	}

	const openCore = () => console.log("open sse")
	const errorCore = (err) => {
		loading.value = false;
		toast.error("AI 服务连接失败");
	}
	const messageCore = (msg) => {
		const lines = msg.split('\n').filter(line => line.trim().startsWith('data:'));
		const chunks = lines.map(line => {
			try { return JSON.parse(line.replace('data: ', '')) } catch(e) { return null }
		}).filter(item => item !== null);
		chunks.forEach(item => {
			if(item.choices && item.choices[0].delta.content) {
				result.value += item.choices[0].delta.content
			}
		})
	}
	const finishCore = () => {
		loading.value = false;
	}
</script>

<style>
	/* 全局背景设为纯白 */
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
	}

	.content-scroll {
		flex: 1;
		height: 0;
	}

	.content-wrapper {
		padding: 24rpx 40rpx 80rpx; /* 增加左右间距，让页面更透气 */
	}

	/* --- 1. 模式切换 (Pill Style) --- */
	.mode-switch {
		display: flex;
		background-color: #f5f5f5; /* 浅灰底 */
		border-radius: 200rpx;
		padding: 8rpx;
		margin-bottom: 48rpx;
	}

	.mode-item {
		flex: 1;
		text-align: center;
		padding: 16rpx 0;
		border-radius: 200rpx;
		font-size: 28rpx;
		color: #888;
		transition: all 0.3s;
		
		&.active {
			background-color: #fff; /* 激活变为白色 */
			color: #333;
			font-weight: 600;
			/* 极轻微的视觉凸起，不算卡片 */
		}
	}

	/* --- 2. 输入块 (灰色背景块，无边框) --- */
	.input-block {
		background-color: #f7f8fa; /* 极浅的蓝灰/纯灰背景 */
		border-radius: 32rpx;
		padding: 32rpx;
		margin-bottom: 40rpx;
		position: relative;
	}

	.block-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24rpx;
		
		&.ai-header {
			color: #07C160;
			font-weight: 600;
			font-size: 28rpx;
		}
	}

	.lang-opt {
		font-size: 28rpx;
		color: #999;
		&.active {
			color: #333;
			font-weight: 600;
		}
	}

	.swap-btn {
		width: 48rpx;
		height: 48rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #07C160;
		font-size: 24rpx;
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
	}

	.word-count {
		text-align: right;
		font-size: 24rpx;
		color: #ccc;
		margin-top: 8rpx;
	}

	/* --- 3. 按钮 (扁平纯色) --- */
	.submit-btn {
		background-color: #07C160;
		color: #fff;
		border-radius: 200rpx;
		font-size: 32rpx;
		font-weight: 600;
		padding: 24rpx 0;
		margin-bottom: 60rpx;
		border: none;
		
		&::after { border: none; }
		&:active { opacity: 0.85; }
	}

	/* --- 4. 结果块 (浅色背景，无边框) --- */
	.result-block {
		background-color: #f7f8fa;
		border-radius: 32rpx;
		padding: 32rpx;
		min-height: 240rpx;
	}

	.block-title {
		font-size: 28rpx;
		color: #999;
		font-weight: 600;
	}

	.actions {
		display: flex;
		gap: 32rpx;
	}

	.icon-btn {
		color: #999;
		font-size: 32rpx;
		&:active { color: #07C160; }
	}

	.result-text {
		font-size: 32rpx;
		color: #333;
		line-height: 1.8;
		
		/* AI 解析内容样式 */
		::v-deep .ai-box {
			margin-bottom: 24rpx;
		}
		::v-deep .ai-h3 {
			font-size: 28rpx;
			color: #07C160;
			margin: 16rpx 0 8rpx;
			font-weight: bold;
		}
		::v-deep .ai-p {
			font-size: 30rpx;
			color: #444;
		}
	}
	
	.empty-tip {
		text-align: center;
		color: #eee;
		font-size: 28rpx;
		margin-top: 40rpx;
	}

	/* Loading 动画 */
	.loading-wrap {
		display: flex;
		justify-content: center;
		padding: 40rpx;
	}
	.dot-spinner {
		display: flex;
		gap: 12rpx;
	}
	.dot {
		width: 16rpx;
		height: 16rpx;
		background-color: #07C160;
		border-radius: 50%;
		animation: bounce 1.4s infinite ease-in-out both;
	}
	.dot:nth-child(1) { animation-delay: -0.32s; }
	.dot:nth-child(2) { animation-delay: -0.16s; }
	
	@keyframes bounce {
		0%, 80%, 100% { transform: scale(0); }
		40% { transform: scale(1); }
	}
</style>