<template>
	<view class="container">
		<NavbarDefault title="编辑单词"></NavbarDefault>

		<scroll-view scroll-y class="content-scroll" :enable-back-to-top="true">
			<view class="content-wrapper">

				<view class="section-header">
					<text class="section-title">基本信息</text>
				</view>

				<view class="input-block">
					<view class="block-label">单词</view>
					<view class="block-desc">多个异体字请用“,”分割</view>
					<input v-model="formData.words" type="text" class="custom-input" placeholder="请输入单词如：筆跡，筆蹟"
						placeholder-class="placeholder-style">
				</view>

				<view class="row-inputs">
					<view class="input-block flex-1">
						<view class="block-label">假名</view>
						<input v-model="formData.kana" type="text" class="custom-input" placeholder="请输入假名"
							placeholder-class="placeholder-style">
					</view>
					<view class="input-block flex-1" style="margin-left: 24rpx;">
						<view class="block-label">音调</view>
						<input v-model="formData.tone" type="text" class="custom-input" placeholder="例如：②"
							placeholder-class="placeholder-style">
					</view>
				</view>

				<view class="input-block">
					<view class="block-label">罗马音 (Rome)</view>
					<input v-model="formData.rome" type="text" class="custom-input" placeholder="请输入罗马音"
						placeholder-class="placeholder-style">
				</view>

				<view class="input-block">
					<view class="block-label">简明释义</view>
					<input v-model="formData.description" type="text" class="custom-input" placeholder="请输入简明释义"
						placeholder-class="placeholder-style">
				</view>

				<view class="section-header" style="margin-top: 64rpx;">
					<text class="section-title">详细释义</text>
				</view>

				<view v-for="(item, index) in formData.meaningsList" :key="'meaning-'+index" class="meaning-wrapper">
					<view class="card-header">
						<view class="card-title-badge">释义 {{index + 1}}</view>
						<view class="delete-icon" @click.stop="deleteMeaning(index)">
							<i class="fas fa-times"></i>
						</view>
					</view>

					<view class="sub-input-block">
						<view class="sub-label">词性</view>
						<input v-model="item.type" type="text" class="sub-input" placeholder="例如：名词、动词"
							placeholder-class="placeholder-style">
					</view>

					<view class="sub-input-block" style="margin-top: 20rpx;">
						<view class="sub-label">释义详情 (中文)</view>
						<textarea v-model="item.zh" class="sub-textarea" auto-height placeholder="请输入详细释义"
							placeholder-class="placeholder-style" :disable-default-padding="true"
							maxlength="-1"></textarea>
					</view>

					<view class="example-area" v-if="item.examples.length > 0">
						<view class="example-label">例句</view>
						<view v-for="(ex, exIndex) in item.examples" :key="'ex-'+index+'-'+exIndex"
							class="example-item">
							<view class="example-content">
								<input v-model="ex.jp" class="ex-input jp" placeholder="输入日文例句"
									placeholder-class="placeholder-style">
								<view class="divider-line"></view>
								<input v-model="ex.zh" class="ex-input zh" placeholder="输入中文翻译"
									placeholder-class="placeholder-style">
							</view>
							<view class="ex-delete" @click="deleteExample(index, exIndex)">
								<i class="fas fa-minus"></i>
							</view>
						</view>
					</view>

					<view class="text-btn" @click="addExample(index)">
						<i class="fas fa-plus"></i> 添加例句
					</view>
				</view>

				<button @click="addMeaning" class="add-block-btn">
					<i class="fas fa-plus"></i> 继续添加新释义
				</button>

				<view class="footer-area">
					<view class="history-link" @click="goPage('/pages/word/edithistory/edithistory',{wordId})">
						<text>查看修订历史</text>
						<view class="avatars">
							<uv-avatar-group :urls="avatarUrls" size="24" gap="0.4"></uv-avatar-group>
							<i class="fas fa-angle-right"></i>
						</view>
					</view>

					<button @click="submit" class="submit-btn" :loading="submitting"
						:disabled="submitted || submitting">
						{{ submitted ? '已提交' : (submitting ? '提交中...' : '提交修订') }}
					</button>
				</view>
			</view>
		</scroll-view>

		<wd-toast />
	</view>
</template>

<script setup>
	import {
		getOs,
		goPage
	} from "@/utils/common.js"
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	import NavbarDefault from "@/components/navbar/default"
	import $http from '@/api/index.js'

	const toast = useToast()
	const avatarUrls = ref([])
	const wordId = ref(null)
	const submitted = ref(false)
	const submitting = ref(false)

	// 表单数据
	const formData = ref({
		words: "",
		kana: "",
		tone: "",
		rome: "",
		description: "",
		meaningsList: []
	})

	const getUserAvatar = async () => {
		try {
			const res = await $http.word.getEditHistory({
				word_id: wordId.value,
				page: 1,
				page_size: 5
			})
			if (res.data) {
				avatarUrls.value = res.data.map(item => item.user.avatar)
			}
		} catch (e) {
			console.error(e)
		}
	}

	const submit = () => {
		if (submitted.value) return
		uni.showModal({
			title: '温馨提示',
			content: '确定要提交本次修订吗？',
			success: function(res) {
				if (res.confirm) doSubmit()
			}
		});
	}

	const doSubmit = async () => {
		if (!formData.value.words.trim()) return toast.warning("请输入单词")

		submitting.value = true

		const detailMap = new Map();

		formData.value.meaningsList.forEach(item => {
			const typeKey = item.type ? item.type.trim() : '未分类';

			if (!detailMap.has(typeKey)) {
				detailMap.set(typeKey, {
					type: typeKey,
					meanings: []
				});
			}

			const validExamples = (item.examples || [])
				.filter(ex => ex.jp?.trim() || ex.zh?.trim())
				.map(ex => ({
					jp: ex.jp,
					zh: ex.zh
				}));

			detailMap.get(typeKey).meanings.push({
				zh: item.zh,
				examples: validExamples
			});
		});

		const detailPayload = Array.from(detailMap.values());

		const payload = {
			id: Number(wordId.value),
			words: formData.value.words.split(/,|，/).map(s => s.trim()).filter(s => s),
			kana: formData.value.kana,
			tone: formData.value.tone,
			rome: formData.value.rome,
			description: formData.value.description,
			detail: detailPayload
		}

		try {
			await $http.word.submitEditWord(payload)
			toast.success("提交成功")
			submitted.value = true
			setTimeout(() => uni.navigateBack(), 1500)
		} catch (error) {
			console.error(error)
			toast.error("提交失败")
		} finally {
			submitting.value = false
		}
	}

	const getJcInfo = async () => {
		try {
			const res = await $http.word.jcInfo({
				id: wordId.value
			})
			const data = res.data

			formData.value.words = data.words ? data.words.join(',') : ''
			formData.value.kana = data.kana || ''
			formData.value.tone = data.tone || ''
			formData.value.rome = data.rome || ''
			formData.value.description = data.description || ''

			if (data.detail && Array.isArray(data.detail)) {
				const flatList = []
				data.detail.forEach(group => {
					const type = group.type || ''
					if (group.meanings && Array.isArray(group.meanings)) {
						group.meanings.forEach(m => {
							flatList.push({
								type: type,
								zh: m.zh || '',
								examples: m.examples ? JSON.parse(JSON.stringify(m
									.examples)) : []
							})
						})
					}
				})
				formData.value.meaningsList = flatList
			}
		} catch (e) {
			console.error(e)
			toast.error("获取详情失败")
		}
	}

	const deleteMeaning = (index) => {
		formData.value.meaningsList.splice(index, 1)
	}
	const addMeaning = () => {
		formData.value.meaningsList.push({
			type: "",
			zh: "",
			examples: []
		})
	}

	const deleteExample = (meaningIndex, exIndex) => {
		formData.value.meaningsList[meaningIndex].examples.splice(exIndex, 1)
	}
	const addExample = (meaningIndex) => {
		formData.value.meaningsList[meaningIndex].examples.push({
			jp: "",
			zh: ""
		})
	}

	onLoad((e) => {
		if (e.wordId) {
			wordId.value = e.wordId
			getJcInfo()
			getUserAvatar()
		}
	})
</script>

<style>
	page {
		background-color: #ffffff;
		height: 100%;
		overflow: hidden;
	}
</style>

<style lang="less" scoped>
	.container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
	}

	.content-scroll {
		flex: 1;
		height: 0;
		width: 100%;
	}

	.content-wrapper {
		padding: 32rpx 40rpx 80rpx;
	}

	.section-header {
		margin-bottom: 32rpx;

		.section-title {
			font-size: 34rpx;
			font-weight: 800;
			color: #111;
			position: relative;
			padding-left: 0;
		}
	}

	/* 极简输入块：浅灰底，无边框 */
	.input-block {
		background-color: #f7f8fa;
		border-radius: 24rpx;
		padding: 24rpx 32rpx;
		margin-bottom: 24rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		transition: background-color 0.2s;

		&:active {
			background-color: #f2f3f5;
		}
	}

	.row-inputs {
		display: flex;
		justify-content: space-between;
		margin-bottom: 24rpx;

		.input-block {
			margin-bottom: 0;
		}
	}

	.flex-1 {
		flex: 1;
	}

	.block-label {
		font-size: 24rpx;
		color: #999;
		margin-bottom: 8rpx;
		font-weight: 500;
	}

	.block-desc {
		font-size: 20rpx;
		color: #ccc;
		margin-bottom: 12rpx;
	}

	.custom-input {
		font-size: 30rpx;
		color: #333;
		height: 48rpx;
		line-height: 48rpx;
		width: 100%;
		background: transparent;
		border: none;
		font-weight: 500;
	}

	.placeholder-style {
		color: #dcdcdc;
		font-weight: 400;
	}

	/* --- 释义块 (移除卡片阴影，改为纯净风格) --- */
	.meaning-wrapper {
		padding: 0 0 48rpx 0;
		margin-bottom: 48rpx;
		border-bottom: 2rpx solid #f5f5f5;
		/* 仅用底边框分隔 */

		.card-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 24rpx;

			.card-title-badge {
				font-size: 24rpx;
				font-weight: 700;
				color: #333;
				background-color: #f0f0f0;
				padding: 6rpx 16rpx;
				border-radius: 100rpx;
			}

			.delete-icon {
				width: 44rpx;
				height: 44rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #ccc;
				font-size: 28rpx;
				transition: color 0.2s;

				&:active {
					color: #ff4d4f;
				}
			}
		}
	}

	.sub-input-block {
		background-color: #f7f8fa;
		border-radius: 20rpx;
		padding: 24rpx;

		.sub-label {
			font-size: 22rpx;
			color: #bbb;
			margin-bottom: 12rpx;
		}

		.sub-input {
			font-size: 28rpx;
			color: #333;
			height: 40rpx;
			font-weight: 500;
		}

		.sub-textarea {
			font-size: 28rpx;
			color: #333;
			width: 100%;
			min-height: 80rpx;
			line-height: 1.6;
			font-weight: 500;
		}
	}

	/* --- 例句区域 --- */
	.example-area {
		margin-top: 32rpx;

		.example-label {
			font-size: 24rpx;
			color: #999;
			margin-bottom: 16rpx;
			font-weight: 600;
		}

		.example-item {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;
			gap: 20rpx;

			.example-content {
				flex: 1;
				background-color: #fcfcfc;
				/* 极淡的灰白，近乎透明 */
				border: 2rpx solid #f5f5f5;
				border-radius: 20rpx;
				padding: 20rpx;

				.ex-input {
					font-size: 26rpx;
					width: 100%;

					&.jp {
						color: #333;
						font-weight: 500;
						margin-bottom: 12rpx;
					}

					&.zh {
						color: #666;
					}
				}

				.divider-line {
					height: 2rpx;
					background-color: #f5f5f5;
					margin: 8rpx 0 16rpx 0;
				}
			}

			.ex-delete {
				width: 40rpx;
				height: 40rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #e0e0e0;
				border: 2rpx solid #f0f0f0;
				border-radius: 50%;
				font-size: 20rpx;

				&:active {
					color: #ff4d4f;
					border-color: #ff4d4f;
				}
			}
		}
	}

	.text-btn {
		font-size: 26rpx;
		color: #07C160;
		font-weight: 600;
		display: inline-flex;
		align-items: center;
		gap: 8rpx;
		padding: 12rpx 0;
		margin-top: 8rpx;

		&:active {
			opacity: 0.7;
		}
	}

	.add-block-btn {
		background-color: #f9f9f9;
		color: #666;
		border: none;
		border-radius: 24rpx;
		padding: 28rpx 0;
		font-size: 28rpx;
		font-weight: 600;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 12rpx;
		margin-top: 32rpx;

		&:active {
			background-color: #f0f0f0;
		}
	}

	.footer-area {
		margin-top: 80rpx;
	}

	.history-link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 40rpx;
		padding: 0 12rpx;

		text {
			font-size: 26rpx;
			color: #999;
			font-weight: 500;
		}

		.avatars {
			display: flex;
			align-items: center;
			gap: 16rpx;
			color: #ddd;
			font-size: 24rpx;
		}
	}

	.submit-btn {
		background: #07C160;
		color: white;
		border: none;
		border-radius: 100rpx;
		padding: 0 32rpx;
		font-size: 28rpx;
		line-height: 90rpx;
		font-weight: 600;
		box-shadow: none;
		display: flex;
		justify-content: center;
		align-items: center;

		&:active {
			opacity: 0.9;
		}

		&[disabled] {
			background: #e0e0e0;
			color: #aaa;
			opacity: 1;
		}
	}
</style>