<template>
	<view>
		<NavbarDefault border title="翻译"></NavbarDefault>
		<div class="translation-mode">
			<div @click="current='标准翻译'" :class="{active:current=='标准翻译'}" class="mode-btn">标准翻译</div>
			<div @click="current='AI翻译'" :class="{active:current=='AI翻译'}" class="mode-btn">AI翻译</div>
		</div>
		<div v-if="current=='标准翻译'" class="language-selector">
			<div :class="{active:pattern=='cj'}" class="language-item">
				<span>中文</span>
			</div>
			<button @click="patternChange()" class="swap-btn">
				<i class="fas fa-exchange-alt" style="color: #757575;"></i>
			</button>
			<div :class="{active:pattern=='jc'}" class="language-item">
				<span>日语</span>
			</div>
		</div>
		<div class="form-group">
			<textarea v-model="value" class="form-textarea" placeholder="请输入需要翻译的内容"></textarea>
		</div>
		<button @click="submit()" class="translate-btn">
			<text class="fas fa-language"></text>翻译
		</button>
		<view v-if="current=='标准翻译'" style="padding-top: 16px;">
			<div class="output-area">
				<textarea v-model="result" class="textarea" placeholder="翻译结果将显示在这里..."></textarea>
				<div class="action-bar">
					<button class="action-btn">
						<i class="fas fa-volume-up"></i> 朗读
					</button>
					<button @click="copy(result)" class="action-btn">
						<i class="fas fa-copy"></i> 复制
					</button>
				</div>
			</div>
		</view>
		<view v-else class="result">
			<view v-if="loading" class="loading _GCENTER">
				<div class="loadership_KUDLC">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
				<text class="tip">
					AI正在思考,大概需要10s
				</text>
			</view>
			<view v-if="result.length>0&&!loading" class="translate">
				<view v-html="result"></view>
			</view>
		</view>
		<ChatSSEClient ref="chatSSEClientRef" @onOpen="openCore" @onError="errorCore" @onMessage="messageCore"
			@onFinish="finishCore" />
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed
	} from 'vue'
	import {
		onLoad,
		onShow,
		onReachBottom,
		onPageScroll,
	} from "@dcloudio/uni-app"
	import {
		goPage,
		formatWordName
	} from "@/utils/common.js"
	import NavbarDefault from "@/components/navbar/default"
	import $http from "@/api/index.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	import ChatSSEClient from "@/components/gao-ChatSSEClient/gao-ChatSSEClient.vue";
	import sha256 from 'crypto-js/sha256';
	const current = ref('标准翻译')
	const pattern = ref('cj')
	const fromTo = computed(() => {
		if (pattern.value == "cj") {
			return {
				'from': 'zh-CHS',
				'to': 'ja'
			}
		} else {
			return {
				'from': 'ja',
				'to': 'zh-CHS'
			}
		}
	})
	const patternChange = () => {
		if (pattern.value == 'jc') {
			pattern.value = 'cj'
		} else {
			pattern.value = 'jc'
		}
	}
	const copy = (data) => {
		uni.setClipboardData({
			data: data,
			showToast: false,
			success() {
				toast.success(`复制成功`)
			}
		});
	}
	const toast = useToast()
	const value = ref("我是中国人")
	const result = ref("");
	const loading = ref(false)
	const truncate = (q) => {
		var len = q.length;
		if (len <= 20) return q;
		return q.substring(0, 10) + len + q.substring(len - 10, len);
	}
	const submit = () => {
		if (current.value == "标准翻译") {
			ydsubmit()
		} else {
			aisubmit()
		}
	}
	const ydsubmit = async () => {
		if (value.value.trim().length == 0) {
			toast.warning(`内容不可为空`)
			return
		}
		loading.value = true
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
				result.value = res.data.translation[0]
				loading.value = false
			}
		})
	}
	const chatSSEClientRef = ref(null);
	const openCore = () => {
		loading.value = false
		console.log("open sse");
	}
	const errorCore = (err) => {
		console.log("error sse：", err);
	}
	const messageCore = (msg) => {
		const lines = msg.split('\n').filter(line => line.trim().startsWith('data:'));
		const chunks = lines.map(line => JSON.parse(line.replace('data: ', '')));
		chunks.map(item => {
			result.value += item.choices[0].delta.content
		})
	}
	const finishCore = () => {
		console.log("finish sse")
		loading.value = false;
	}
	const stop = () => {
		chatSSEClientRef.value.stopChat()
		console.log("stop");
	}
	const content = ref(
		`你是一个中日翻译，我会给你中文或者日文，然后你翻译为日文或者中文，并且我还要你对翻译进行讲解，为什么这么翻译，这句话用了哪些语法点，返回html格式如下<div><h3>翻译：</h3><p>这里是翻译内容。</p></div><div><h3>翻译讲解：</h3><h4>句子结构分析：</h4><p>这里是句子结构分析。</p><h4>关键词翻译：</h4><ul><li><strong>关键词1</strong>：解释1</li><li><strong>关键词2</strong>：解释2</li></ul><h4>语法点解析：</h4><ul><li><strong>语法点1</strong>：解释1</li><li><strong>语法点2</strong>：解释2</li></ul><h4>翻译思路：</h4><p>这里是翻译思路。</p></div>`
	)
	const aisubmit = async () => {
		if (value.value == "" || value.value.length == 0) {
			toast.warning(`内容不可为空`)
			return
		}
		loading.value = true
		chatSSEClientRef.value.startChat({
			url: "https://api.deepseek.com/chat/completions",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
				"Authorization": "Bearer sk-7f2affcd4e1549b8b53b08d5afca6077",
			},
			body: {
				messages: [{
						content: content.value,
						role: "system"
					},
					{
						content: value.value,
						role: "user"
					}
				],
				model: "deepseek-chat",
				response_format: {
					type: "text"
				},
				stop: null,
				stream: true,
				temperature: 1.3,
				tools: null,
				tool_choice: "none",
				logprobs: false,
				top_logprobs: null
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
	.form-group {
		padding: 16px;
	}

	.result {
		padding: 0 16px;

		.smalltitle {
			font-size: 14px;
			color: #999
		}
	}

	.loading {
		flex-direction: column;
		margin-top: 20px;

		.tip {
			margin-top: 10px;
			font-size: 12px;
			color: #d9d9d9;
		}

		.loadership_KUDLC {
			display: flex;
			position: relative;
			width: 46px;
			height: 60px;
		}

		.loadership_KUDLC div {
			position: absolute;
			width: 6px;
			height: 20px;
			background: #d9d9d9;
			top: 20px;
			animation:
				loadership_KUDLC_scale 1.8s infinite,
				loadership_KUDLC_fade 1.8s infinite;
			animation-timing-function: ease-in-out;
		}

		.loadership_KUDLC div:nth-child(1) {
			animation-delay: 0s;
			left: 0px;
		}

		.loadership_KUDLC div:nth-child(2) {
			animation-delay: 0.16s;
			left: 10px;
		}

		.loadership_KUDLC div:nth-child(3) {
			animation-delay: 0.32s;
			left: 20px;
		}

		.loadership_KUDLC div:nth-child(4) {
			animation-delay: 0.48s;
			left: 30px;
		}

		.loadership_KUDLC div:nth-child(5) {
			animation-delay: 0.64s;
			left: 40px;
		}

		@keyframes loadership_KUDLC_scale {

			0%,
			44.44444444444445%,
			100% {
				transform: scaleY(1);
			}

			22.222222222222225% {
				transform: scaleY(3);
			}
		}

		@keyframes loadership_KUDLC_fade {

			0%,
			44.44444444444445%,
			100% {
				opacity: 1;
			}

			22.222222222222225% {
				opacity: 1;
			}
		}
	}

	.output-area {
		margin: 0 16px 16px;
		border-radius: 8px;
		border: 1px solid #E0E0E0;
	}

	.textarea {
		min-height: 120px;
		width: auto;
		border: none;
		padding: 12px;
		font-size: 16px;
		resize: none;
		outline: none;
		box-sizing: border-box;
	}

	.action-bar {
		display: flex;
		justify-content: space-between;
		padding: 8px 16px;
		border-top: 1px solid #E0E0E0;
	}

	.action-btn {
		background: none;
		border: none;
		color: #757575;
		font-size: 14px;
		cursor: pointer;
	}

	.translate-btn {
		background-color: #07C160;
		color: white;
		border: none;
		border-radius: 8px;
		padding: 12px 24px;
		font-size: 16px;
		font-weight: 500;
		margin: 16px;
		display: flex;
		align-items: center;
		gap: 8px;
		justify-content: center;
	}

	.language-selector {
		display: flex;
		justify-content: space-between;
		margin: 0 16px;
		padding: 8px 0;
		border-bottom: 1px solid #E0E0E0;
	}

	.language-item {
		display: flex;
		align-items: center;
		color: #757575;
	}

	.language-item.active {
		color: #07C160;
		font-weight: 500;
	}

	.form-textarea {
		width: auto;
		padding: 12px;
		border: 1px solid #E0E0E0;
		border-radius: 8px;
		font-size: 15px;
		min-height: 80px;
		resize: none;
	}

	.translation-mode {
		display: flex;
		background-color: #F5F5F5;
		border-radius: 8px;
		margin: 12px 16px;
		padding: 4px;
	}

	.mode-btn {
		flex: 1;
		text-align: center;
		padding: 8px;
		border-radius: 6px;
		font-size: 14px;
	}

	.mode-btn.active {
		background-color: #FFFFFF;
		color: #07C160;
		font-weight: 500;
	}
</style>