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
						placeholder-style="color:#aab2bd;font-size:28rpx;" placeholder="请描述您的问题或建议..."
						:disable-default-padding="true" maxlength="500"></textarea>
					<view class="word-count">{{ formData.content.length }}/500</view>
				</view>

				<view v-if="source!=''" class="source-block">
					<i class="fas fa-info-circle" style="margin-right: 8rpx;"></i>
					<text class="source-text">{{source}}</text>
				</view>

				<wd-upload :action="http.baseUrl+'upload'" name="file" :header="{'Authorization': userStore().token}"
					:limit="4" :file-list="fileList" image-mode="aspectFill" @change="handleChange"
					:build-form-data="handleBuildFormData"></wd-upload>

				<view class="action-area">
					<button class="compact-btn" @click="submit()">提交反馈</button>
				</view>

				<wd-toast />
			</view>
		</view>
	</page-meta>
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
	import {
		context
	} from '@/uni_modules/wot-design-uni/components/common/util'
	import http from "@/utils/request.js"

	const toast = useToast()

	// 1. 文件列表
	const fileList = ref([])

	// 2. 监听文件改变
	const handleChange = ({
		fileList: files
	}) => {
		fileList.value = files
		console.log('当前文件列表：', fileList.value);
	}

	// 3. 核心修复：构建上传参数的钩子
	// 这个钩子会在点击上传、真正发起请求前执行
	const handleBuildFormData = ({
		file,
		formData,
		resolve
	}) => {
		// 获取文件名 (兼容 H5 和 小程序)
		let fileName = file.name
		if (!fileName && file.url) {
			// 如果没有 name，尝试从路径中截取
			fileName = file.url.substring(file.url.lastIndexOf('/') + 1)
		}
		// 兜底文件名，防止为空
		if (!fileName) {
			fileName = `file_${Date.now()}.jpg`
		}

		// 组装参数，注意 key 要和后端 PostForm("file_name") 一致
		const newFormData = {
			...formData,
			"file_name": "files/feedback/" + fileName
		}

		console.log("准备上传参数:", newFormData)

		// 必须调用 resolve 将组装好的参数返回去
		resolve(newFormData)
	}

	const current = ref("问题反馈")
	const formData = ref({
		content: "",
		type: ""
	})
	const history = ref('')
	const source = ref('')

	const submit = async () => {
		console.log(fileList.value);
		const images = fileList.value.map(item => {
			if (item.response) {
				try {
					const res = JSON.parse(item.response)
					return res.url
				} catch (e) {
					console.error("解析上传响应失败", e)
					return ""
				}
			}
			return item.url
		}).filter(url => url)
		if (!userStore().loginStatus) {
			goPage("/pages/login/login?toast=请登录之后使用")
			return
		}
		if (formData.value.content.trim().length == 0) {
			toast.warning(`内容不可为空`)
			return
		}
		if (history.value == formData.value.content) {
			toast.warning(`不可重复提交`)
			return
		}
		formData.value.type = current.value
		const res = await $http.common.feedback({
			type: formData.value.type,
			images,
			content: formData.value.content + "\n" + source.value
		})
		toast.success(`提交成功`)
		history.value = formData.value.content
		formData.value.content = ""
		fileList.value = []
	}

	onLoad(e => {
		if (e.type) {
			current.value = "问题反馈"
			if (e.type == "单词纠错") {
				source.value = `来自单词纠错 · ${e.wordType=='jc'?'日中':'中日'}单词ID：${e.wordId}`
			} else if (e.type == "补充单词") {
				source.value = `补充单词：${e.data}`
				formData.value.content = "缺少单词"
			} else if (e.type == "问题反馈") {
				source.value = `反馈来源：${e.data}`
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
	:deep(.wd-upload__preview) {
		margin: 0 !important;
		width: inherit !important;
		height: inherit !important;
		aspect-ratio: 1 / 1;
		border-radius: 16rpx !important;
	}

	:deep(.wd-upload__status-content) {
		border-radius: 16rpx !important;
		overflow: hidden;
	}

	:deep(.wd-upload__evoke) {
		margin: 0 !important;
		width: inherit !important;
		height: inherit !important;
		aspect-ratio: 1 / 1;
		border-radius: 16rpx !important;
	}

	:deep(.wd-upload) {
		gap: 32rpx;
		display: grid !important;
		grid-template-columns: repeat(4, 1fr);
	}

	.page-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
	}

	.content-wrapper {
		padding: 32rpx;

	}


	.section-label {
		font-size: 26rpx;
		font-weight: 600;
		color: #1a1a1a;
		white-space: nowrap;
	}


	.section-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 24rpx;
	}

	.type-group {
		display: flex;
		gap: 16rpx;
	}


	.type-chip {
		font-size: 24rpx;
		padding: 8rpx 24rpx;
		background-color: #f7f8fa;
		color: #5f6368;
		border-radius: 200rpx;
		transition: all 0.2s;
		font-weight: 500;

		&.active {
			background-color: #07C160;
			color: white;
		}
	}

	.input-block {
		background-color: #f7f8fa;
		border-radius: 24rpx;
		padding: 24rpx;
		margin-bottom: 24rpx;
		position: relative;
	}

	.compact-textarea {
		width: 100%;
		height: 280rpx;
		font-size: 28rpx;
		line-height: 1.5;
		color: #333;
		background: transparent;
		border: none;
	}

	.word-count {
		text-align: right;
		font-size: 22rpx;
		color: #ccc;
		margin-top: 8rpx;
	}


	.source-block {
		display: flex;
		align-items: center;
		background-color: #fff;
		padding: 0 8rpx;
		margin-bottom: 40rpx;
		font-size: 24rpx;
		color: #9aa0a6;

		.source-text {
			font-size: 22rpx;
			color: #aab2bd;

			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}


	.action-area {
		margin-top: 32rpx;
	}

	.compact-btn {
		height: 88rpx;
		line-height: 88rpx;
		background-color: #07C160;
		color: white;
		border-radius: 200rpx;
		font-size: 30rpx;
		font-weight: 600;
		border: none;
	}
</style>