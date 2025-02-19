<template>
	<NavBar :title="ai?'AI翻译':'标准翻译'">
		<template #right>
			<view @click="ai=!ai" class="swap">
				<wd-icon name="swap" size="18px"></wd-icon>
				<text>{{ai?'标准翻译':'AI翻译'}}</text>
			</view>
		</template>
	</NavBar>
	<view v-if="ai" style="padding-bottom: 40px;">
		<wd-textarea style="margin: 0 15px;border-radius: 8px;" v-model="value" clearable show-word-limit
			placeholder="输入中文或日文" :maxlength="400" />
		<view style="padding:10px;margin-top: 15px;">
			<wd-button @click="aisubmit()" style="width: 100%;">翻译</wd-button>
		</view>
		<wd-gap bg-color="#F5f5f5" height="15px"></wd-gap>
		<view class="result">
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
	</view>
	<view v-else style="padding-bottom: 40px;">
		<wd-textarea style="margin: 0 15px;border-radius: 8px;" v-model="value" clearable show-word-limit
			placeholder="输入中文或日文" :maxlength="400" />
		<view style="background-color: white;padding: 10px;margin: 15px;border-radius: 8px;">
			<wd-radio-group v-model="type" shape="button">
				<wd-radio value="中译日">中译日</wd-radio>
				<wd-radio value="日译中">日译中</wd-radio>
			</wd-radio-group>
		</view>
		<view style="padding:10px;">
			<wd-button @click="submit()" style="width: 100%;">翻译</wd-button>
		</view>
		<wd-gap bg-color="#F5f5f5" height="15px"></wd-gap>
		<view class="result">
			<view v-if="loading" class="loading _GCENTER">
				<div class="loadership_KUDLC">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			</view>
			<view v-if="result.length>0&&!loading" class="translate">
				<view>{{result}}</view>
				<view class="tool">
					<wd-icon @click="copy(result)" name="file-copy" color="#999" size="20px"></wd-icon>
					<!-- <wd-icon name="sound" size="20px" color="#999"></wd-icon> -->
				</view>
			</view>

		</view>
	</view>
	<ChatSSEClient ref="chatSSEClientRef" @onOpen="openCore" @onError="errorCore" @onMessage="messageCore"
		@onFinish="finishCore" />
	<wd-toast />
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed,
		watch
	} from 'vue'
	import ChatSSEClient from "@/components/gao-ChatSSEClient/gao-ChatSSEClient.vue";
	import NavBar from '@/components/navbar.vue'
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const ai = ref(false)
	watch(ai, (newVal, oldVal) => {
		result.value = ""
		value.value = ""
	})
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
	const value = ref("")
	const loading = ref(false)
	const result = ref("");
	const type = ref("中译日")
	const truncate = (q) => {
		var len = q.length;
		if (len <= 20) return q;
		return q.substring(0, 10) + len + q.substring(len - 10, len);
	}
	const fromTo = computed(() => {
		if (type.value == "中译日") {
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
	const submit = async () => {
		if (value.value == "" || value.value.length == 0) {
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
		var sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);
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
				console.log(res.data);
				result.value = res.data.translation[0]
				loading.value = false
			}
		})
	}
	// ai
	const chatSSEClientRef = ref(null);
	const openCore = () => {
		loading.value = false
		console.log("open sse");
	}
	const errorCore = (err) => {
		console.log("error sse：", err);
	}
	const messageCore = (msg) => {
		let jsonData = JSON.parse(msg)
		result.value += `${jsonData.choices[0].delta.content}`
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
				"Authorization": "Bearer sk-d8624a2b074c477e86a5facc49b7e5bc",
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

<style scoped lang="scss">
	.swap {
		display: flex;
		align-items: center;
		gap: 5px;

		text {
			font-size: 14px;
		}
	}

	.translate {
		padding: 15px;
		background-color: white;
		border-radius: 8px;
		font-size: 14px;

		.tool {
			display: flex;
			justify-content: flex-end;
			gap: 5px;
			margin-top: 10px;
		}
	}

	.result {
		padding: 0 15px;

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
</style>