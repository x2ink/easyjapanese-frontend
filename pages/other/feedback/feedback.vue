<template>
	<page-meta page-style="background-color:#ffffff;">
		<view class="page-container">
			<NavbarDefault border title="意见反馈"></NavbarDefault>

			<view class="content-wrapper">

				<view class="section-row">
					<text class="section-label">反馈类型</text>
					<view class="type-group">
						<view :class="{active:current=='问题反馈'}" @click="current='问题反馈'" class="type-chip">
							问题反馈
						</view>
						<view :class="{active:current=='意见建议'}" @click="current='意见建议'" class="type-chip">
							意见建议
						</view>
					</view>
				</view>

				<view class="input-block">
					<textarea v-model="formData.content" class="compact-textarea"
						placeholder-style="color:#aab2bd;font-size:14px;" placeholder="请描述您的问题或建议..."
						:disable-default-padding="true" maxlength="500"></textarea>
					<view class="word-count">{{ formData.content.length }}/500</view>
				</view>

				<view v-if="source!=''" class="source-block">
					<i class="fas fa-info-circle" style="margin-right: 4px;"></i>
					<text class="source-text">{{source}}</text>
				</view>

				<view class="action-area">
					<button class="compact-btn" @click="submit()">提交反馈</button>
				</view>

				<wd-toast />
			</view>
		</view>
	</page-meta>
</template>

<script setup>
	// 逻辑完全保持不变
	import {
		ref,
	} from 'vue'
	import {
		onLoad,
	} from "@dcloudio/uni-app"
	import {
		goPage,
	} from "@/utils/common.js"
	import NavbarDefault from "@/components/navbar/default"
	import $http from "@/api/index.js"
	import {
		userStore
	} from "@/stores/index.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	const current = ref("问题反馈")
	const formData = ref({
		content: "",
		type: ""
	})
	const source = ref('')
	const submit = async () => {
		if (!userStore().loginStatus) {
			goPage("/pages/login/login?toast=请登录之后使用")
			return
		}
		if (formData.value.content.trim().length == 0) {
			toast.warning(`内容不可为空`)
			return
		}
		formData.value.type = current.value
		formData.value.content += formData.value.content + "\n" + source.value
		const res = await $http.common.feedback(formData.value)
		toast.success(`提交成功`)
		formData.value.content = ''
	}
	onLoad(e => {
		if (e.type) {
			current.value = "问题反馈"
			if (e.type == "单词纠错") {
				source.value = `来自单词纠错 · ${e.wordType=='jc'?'日中':'中日'}单词ID：${e.wordId}`
			} else if (e.type == "补充单词") {
				source.value = `补充单词：${e.data}`
			}
		} else {
			current.value = "意见建议"
		}
	})
</script>

<style>
	page {
		background-color: #ffffff;
	}
</style>

<style lang="scss" scoped>
	.page-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
	}

	.content-wrapper {
		padding: 16px;
		/* 紧凑边距 */
	}

	/* 标签通用样式 */
	.section-label {
		font-size: 13px;
		font-weight: 600;
		color: #1a1a1a;
		white-space: nowrap;
	}

	/* 第一行：类型选择 */
	.section-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 12px;
	}

	.type-group {
		display: flex;
		gap: 8px;
	}

	/* 这里的 Chip 做得更小 */
	.type-chip {
		font-size: 12px;
		padding: 4px 12px;
		background-color: #f7f8fa;
		color: #5f6368;
		border-radius: 100px; /* 胶囊按钮 */
		/* 小圆角 */
		transition: all 0.2s;
		font-weight: 500;

		&.active {
			background-color: #07C160;
			color: white;
		}
	}

	/* 输入区域：模仿 breaksentence 的紧凑风格 */
	.input-block {
		background-color: #f7f8fa;
		border-radius: 12px;
		padding: 12px;
		margin-bottom: 12px;
		position: relative;
	}

	.compact-textarea {
		width: 100%;
		height: 140px;
		/* 高度适中 */
		font-size: 14px;
		/* 字号调小 */
		line-height: 1.5;
		color: #333;
		background: transparent;
		border: none;
	}

	.word-count {
		text-align: right;
		font-size: 11px;
		color: #ccc;
		margin-top: 4px;
	}

	/* 来源信息：非常低调 */
	.source-block {
		display: flex;
		align-items: center;
		background-color: #fff;
		padding: 0 4px;
		margin-bottom: 20px;
		font-size: 12px;
		color: #9aa0a6;

		.source-text {
			font-size: 11px;
			color: #aab2bd;
			/* 超出省略 */
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	/* 按钮：高度 40px，精简 */
	.action-area {
		margin-top: 8px;
	}

	.compact-btn {
		height: 44px;
		/* 紧凑高度 */
		line-height: 44px;
		background-color: #07C160;
		color: white;
		border-radius: 100px; /* 胶囊按钮 */
		font-size: 15px;
		font-weight: 600;
		border: none;

		&:active {
			opacity: 0.85;
		}

		&::after {
			border: none;
		}
	}
</style>