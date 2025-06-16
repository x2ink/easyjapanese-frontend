<template>
	<div class="flex-col">
		<NavbarDefault title="编辑单词"></NavbarDefault>
		<!-- 单词标题 -->
		<div class="word-title">
			<div class="word-text">{{jcinfo.word}}</div>
			<div class="word-reading">{{jcinfo.kana}}{{jcinfo.tone}} · {{jcinfo.rome}}</div>
		</div>
		<!-- 表单内容区域 -->
		<div class="form-container">
			<!-- 基本释义 -->
			<div class="form-group">
				<label for="basic-meaning" class="form-label">基本释义</label>
				<textarea v-model="formData.meaning" placeholder="请输入单词基本释义" id="detailed-meaning"
					class="form-textarea"></textarea>
			</div>
			<!-- 详细解释 -->
			<div class="form-group">
				<label for="detailed-meaning" class="form-label">详细解释</label>
				<textarea v-model="formData.detail" placeholder="请输入单词详细解释" id="detailed-meaning"
					class="form-textarea"></textarea>
			</div>

			<!-- 保存按钮 -->
			<button @click="submit()" class="save-btn _GCENTER">
				<text class="fas fa-save mr-1" style="margin-right: 8px;"></text>保存修改
			</button>

			<!-- 历史记录 -->
			<div class="history-container">
				<div class="history-title">修改历史</div>
				<view style="display: flex;flex-direction: column;gap: 12px;">
					<div class="history-item" :key="item.id" v-for="item in List">
						<div class="history-meta">
							<span>{{dayjs(item.time).format('YYYY-MM-DD HH:mm')}}</span>
							<span>{{item.user.nickname}}</span>
						</div>
						<div class="history-content">
							<div class="history-field">
								<span class="history-field-label">备注:</span>
								<span>{{item.comment}}</span>
							</div>
						</div>
					</div>
				</view>
			</div>
		</div>
		<wd-toast />
	</div>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import dayjs from 'dayjs'
	import $http from "@/api/index.js"
	import NavbarDefault from "@/components/navbar/default"
	const navBarHeight = ref(0)
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	const id = ref(null)
	const formData = ref({
		meaning: "",
		word_id: null,
		detail: ""
	})
	const jcinfo = ref({
		word: null,
		voice: null,
		tone: null,
		rome: null,
		kana: null,
		meaning: "",
		example: [],
		detail: ""
	})
	const List = ref([])
	const getList = async (id) => {
		const res = await $http.word.getEditWord(id)
		List.value = res.data
	}
	const getJcInfo = async (id) => {
		const res = await $http.word.jcInfo(id)
		jcinfo.value = res.data
		jcinfo.value.meaning = res.data.meaning.map(item => item.meaning).join('\n')
		formData.value.detail = res.data.detail
		formData.value.meaning = jcinfo.value.meaning
	}
	const submit = async () => {
		if (formData.value.detail.trim().length === 0) {
			toast.warning("详细解释为空")
			return
		}
		if (formData.value.meaning.trim().length === 0) {
			toast.warning("基本解释为空")
			return
		}
		if (formData.value.meaning == jcinfo.value.meaning && formData.value.detail == jcinfo.value.detail) {
			toast.warning("你的编辑好像没变化")
			return
		}
		const res = await $http.word.editWord(formData.value)
		toast.success('提交成功，请等待审核')
		setTimeout(() => {
			uni.navigateBack({
				delta: 1
			})
		}, 1000)
	}
	onLoad((op) => {
		formData.value.word_id = Number(op.id)
		getJcInfo(op.id)
		getList(op.id)
	})
	onMounted(() => {
		const systemInfo = wx.getSystemInfoSync();
		const statusBarHeight = systemInfo.statusBarHeight;
		navBarHeight.value = statusBarHeight + 'px'
	})
</script>

<style lang="scss" scoped>
	/* 表单样式 */
	.form-container {
		padding: 16px 0;
		flex: 1;
	}

	.form-group {
		margin-bottom: 16px;
		background: white;
		border-radius: 8px;
		padding: 16px;
	}

	.form-label {
		display: block;
		font-weight: 500;
		margin-bottom: 8px;
		font-size: 14px;
	}



	.form-textarea {
		width: auto;
		padding: 8px 12px;
		border: 1px solid #ddd;
		border-radius: 6px;
		font-size: 14px;
	}



	/* 保存按钮 */
	.save-btn {
		display: block;
		margin: 16px;
		padding: 12px;
		background-color: #07C160;
		color: white;
		border: none;
		border-radius: 8px;
		font-weight: 500;
		font-size: 16px;
	}

	/* 历史记录 */
	.history-container {
		margin-top: 16px;
		padding: 16px 16px calc(env(safe-area-inset-bottom) + 16px) 16px;
	}

	.history-title {
		font-weight: 500;
		margin-bottom: 12px;
		font-size: 14px;
	}

	.history-item {
		background: white;
		border-radius: 8px;
		padding: 12px 16px;
	}

	.history-meta {
		display: flex;
		justify-content: space-between;
		font-size: 12px;
		color: #666;
		margin-bottom: 8px;
	}

	.history-content {
		font-size: 13px;
		color: #333;
	}

	.history-field {
		margin-bottom: 6px;
	}

	.history-field-label {
		font-weight: 500;
		color: #07C160;
		margin-right: 8px;
	}

	/* 布局 */
	.flex-col {
		display: flex;
		flex-direction: column;
		height: 100%;
	}


	/* 单词标题 */
	.word-title {
		padding: 16px;
		background-color: white;
	}

	.word-text {
		font-size: 20px;
		font-weight: bold;
		margin-bottom: 4px;
	}

	.word-reading {
		font-size: 14px;
		color: #666;
	}
</style>