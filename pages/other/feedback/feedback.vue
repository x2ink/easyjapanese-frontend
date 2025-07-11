<template>
	<view>
		<NavbarDefault border title="意见反馈"></NavbarDefault>
		<div class="feedback-content">
			<!-- 反馈类型选择 -->
			<div class="feedback-type">
				<div class="type-title">反馈类型</div>
				<div class="type-options">
					<view :class="{active:current=='Bug反馈'}" @click="current='Bug反馈'" class="type-option _GCENTER">Bug反馈
					</view>
					<view :class="{active:current=='意见建议'}" @click="current='意见建议'" class="type-option _GCENTER">意见建议
					</view>
				</div>
			</div>
			<!-- 反馈表单 -->
			<div class="feedback-form">
				<div class="form-title">反馈内容</div>
				<textarea v-model="formData.content" class="feedback-textarea"
					placeholder="请详细描述您遇到的问题或建议..."></textarea>
			</div>
			<!-- 来源信息 -->
			<div v-if="source!=''" class="source-info">
				{{source}}
			</div>
			<!-- 提交按钮 -->
			<button class="submit-btn" @click="submit()">提交反馈</button>
			<wd-toast />
		</div>
	</view>
</template>

<script setup>
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
	const current = ref("Bug反馈")
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
			current.value = "Bug反馈"
			if (e.type == "单词纠错") {
				source.value = `来自单词纠错 · ${e.wordtype=='jc'?'日中':'中日'}单词ID：${e.wordid}`
			}
		} else {
			current.value = "意见建议"
		}
	})
</script>
<style>
	page {
		background-color: white;
	}
</style>
<style lang="scss" scoped>
	/* 主要内容区 */
	.feedback-content {
		flex: 1;
		overflow-y: auto;
		padding: 16px;
	}

	/* 反馈类型选择 */
	.feedback-type {
		margin-bottom: 20px;
	}

	.type-title {
		font-size: 14px;
		color: #757575;
		margin-bottom: 12px;
	}

	.type-options {
		display: flex;
		gap: 12px;
	}

	.type-option {
		height: 35px;
		padding: 0 16px;
		border-radius: 35px;
		font-size: 14px;
		border: 1px solid #E0E0E0;
		background-color: white;
		color: #757575;
	}

	.type-option.active {
		background-color: #07C160;
		color: white;
		border-color: #07C160;
	}

	/* 反馈表单 */
	.feedback-form {
		margin-bottom: 20px;
	}

	.form-title {
		font-size: 14px;
		color: #757575;
		margin-bottom: 12px;
	}

	.feedback-textarea {
		width: auto;
		min-height: 120px;
		padding: 12px;
		border-radius: 8px;
		border: 1px solid #E0E0E0;
		font-size: 14px;
		resize: none;
	}

	.feedback-textarea:focus {
		outline: none;
		border-color: #07C160;
	}

	/* 来源信息 */
	.source-info {
		font-size: 12px;
		color: #9E9E9E;
		margin-bottom: 20px;
		padding: 8px 0;
		border-top: 1px solid #f0f0f0;
	}

	/* 提交按钮 */
	.submit-btn {
		padding: 12px;
		background-color: #07C160;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 16px;
		font-weight: 500;
		cursor: pointer;
	}

	.submit-btn:active {
		background-color: #06AD56;
	}
</style>