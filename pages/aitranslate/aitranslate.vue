<template>
	<NavBar title="AI翻译"></NavBar>
	<wd-textarea style="margin: 0 15px;border-radius: 8px;" v-model="value" clearable show-word-limit
		placeholder="输入中文或日文" :maxlength="400" />
	<view style="padding:10px;margin-top: 15px;">
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
			<text class="tip">
				AI正在思考,大概需要10s
			</text>
		</view>

		<view v-if="result.length>0&&!loading" class="translate">
			<view v-html="result"></view>
		</view>
	</view>
	<wd-toast />
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import NavBar from '@/components/navbar.vue'
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	const value = ref("")
	const content = ref(
		`你是一个中日翻译，我会给你中文或者日文，然后你翻译为日文或者中文，并且我还要你对翻译进行讲解，为什么这么翻译，这句话用了哪些语法点，返回html格式如下<div><h3>翻译：</h3><p>这里是翻译内容。</p></div><div><h3>翻译讲解：</h3><h4>句子结构分析：</h4><p>这里是句子结构分析。</p><h4>关键词翻译：</h4><ul><li><strong>关键词1</strong>：解释1</li><li><strong>关键词2</strong>：解释2</li></ul><h4>语法点解析：</h4><ul><li><strong>语法点1</strong>：解释1</li><li><strong>语法点2</strong>：解释2</li></ul><h4>翻译思路：</h4><p>这里是翻译思路。</p></div>`
	)
	const loading = ref(false)
	const result = ref("");
	const submit = async () => {
		if (value.value == "" || value.value.length == 0) {
			toast.warning(`内容不可为空`)
			return
		}
		loading.value = true
		uni.request({
			url: "https://api.deepseek.com/chat/completions",
			method: "POST",
			data: {
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
				stream: false, // 启用流式响应
				temperature: 1.3,
				tools: null,
				tool_choice: "none",
				logprobs: false,
				top_logprobs: null
			},
			header: {
				"Content-Type": "application/json",
				"Accept": "application/json",
				"Authorization": "Bearer sk-2edc2e848ae64717a51e96c49a7f4d39",
			},
			success(response) {
				result.value = response.data.choices[0].message.content
				loading.value = false
			},
			fail(error) {
				console.error("Request failed:", error);
			}
		});
	}
</script>

<style scoped lang="scss">
	.result {
		padding: 15px;

		.smalltitle {
			font-size: 14px;
			color: #999
		}
	}

	.translate {
		padding: 15px;
		background-color: white;
		border-radius: 8px;
		font-size: 14px;
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