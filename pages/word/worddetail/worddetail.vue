<template>
	<div class="content-container">
		<!-- 单词标题区 -->
		<div class="word-header" :style="{paddingTop:`calc(${navBarHeight} + 4px)`}">
			<!-- 返回按钮 -->
			<view class="back-btn" @click="back()">
				<text class="fas fa-arrow-left"></text>
			</view>
			<div style="margin-top: 16px;">
				<div class="flex justify-between items-start">
					<div>
						<div class="word-title">{{jcinfo.word}}</div>
						<div class="word-reading">{{jcinfo.kana}} · {{jcinfo.rome}}</div>
						<div class="pitch-accent">
							<div class="pitch-accent-bar" style="width: 40%; left: 30%;"></div>
						</div>
					</div>
					<div class="flex" style="gap: 8px;">
						<view @click="playUserRecord(jcinfo.voice)" class="action-btn">
							<text class="fas fa-volume-up"></text>
						</view>
						<view @click="goPage('/pages/word/followread/followread',{
								id:id,
								word:JSON.stringify({word:jcinfo.word,kana:jcinfo.kana,meaning:jcinfo.meaning})
							})" class="action-btn">
							<text class="fas fa-microphone"></text>
						</view>
					</div>
				</div>
			</div>
		</div>

		<!-- 主要内容区域 -->
		<div class="main-content">
			<!-- 单词基本信息 -->
			<div class="card">
				<div class="flex justify-between items-center" style="margin-bottom: 12px;">
					<div>
						<span class="tag tag-blue">{{jcinfo.wordtype}}</span>
					</div>
					<div class="flex space-x-2">
						<view @click="goPage('/pages/word/edit/edit',{id})" style="color: #3b82f6;font-size: 14px;">
							<text class="fas fa-edit" style="margin-right: 4px;"></text>编辑
						</view>
					</div>
				</div>

				<div class=" text-bold" style="margin-bottom: 9px;">基本释义</div>
				<div style="margin-bottom: 18px;">
					<view :key="item" v-for="item in jcinfo.meaning">{{item.meaning}}</view>
				</div>

				<div class=" text-bold" style="margin-bottom: 9px;">详细解释</div>
				<div style="color: #374151; margin-bottom: 9px;">
					{{jcinfo.detail}}
				</div>
			</div>

			<!-- 例句展示 -->
			<div class="card">
				<div class="flex justify-between items-center" style="margin-bottom: 12px;">
					<div class=" text-bold">例句</div>
					<view @click="addExampleShow=true" style="color: #10b981;">
						<text class="fas fa-plus-circle" style="margin-right: 4px;"></text>添加例句
					</view>
				</div>
				<view class="examples">
					<view class="example" :key="item.id" v-for="item in jcinfo.example">
						<view>
							<view class="ja jpfont">
								<view class="worditem" :key="item1" v-for="item1 in item.read">
									<view class="top">{{item1.top}}</view>
									<view :class="{underline:item1.top}" class="body">{{item1.body}}</view>
								</view>
							</view>
							<view class="ch">
								{{item.ch}}
							</view>
						</view>
					</view>
				</view>
			</div>

			<!-- 相关单词 -->
			<!-- 	<div class="card">
				<div class="text-bold" style="margin-bottom: 12px;">相关单词</div>
				<div class="grid-cols-2">
					<div class="wave-effect" style="padding: 9px; border-radius: 4.5px; background: #f9fafb;">
						<div class="text-bold">飲む</div>
						<div class="text-xs text-gray">のむ</div>
					</div>
					<div class="wave-effect" style="padding: 9px; border-radius: 4.5px; background: #f9fafb;">
						<div class="text-bold">料理</div>
						<div class="text-xs text-gray">りょうり</div>
					</div>
					<div class="wave-effect" style="padding: 9px; border-radius: 4.5px; background: #f9fafb;">
						<div class="text-bold">食堂</div>
						<div class="text-xs text-gray">しょくどう</div>
					</div>
					<div class="wave-effect" style="padding: 9px; border-radius: 4.5px; background: #f9fafb;">
						<div class="text-bold">お腹</div>
						<div class="text-xs text-gray">おなか</div>
					</div>
				</div>
			</div> -->
			<!-- 占位 -->
			<view style="height: calc(env(safe-area-inset-bottom) + 40px);">

			</view>
			<!-- 底部操作栏 -->
			<div class="bottom-actions" :class="`${getOs()=='ios'?'ios-bottom-actions':'and-bottom-actions'}`">
				<view @click="goPage('/pages/word/mybooks/mybooks',{wordId:id})" class="bottom-btn btn-gray">
					<text class="fas fa-bookmark" style="margin-right: 4.5px;"></text> 生词本
				</view>
				<view class="bottom-btn btn-blue"
					@click="goPage('/pages/other/browse/browse',{type:'dict',word:jcinfo.word})">
					<text class="fas fa-search" style="margin-right: 4.5px;"></text> 搜索
				</view>
				<view class="bottom-btn btn-green" @click="goPage('/pages/tools/notedetail/notedetail',{
								wordId:id,word:JSON.stringify({word:jcinfo.word,kana:jcinfo.kana,meaning:jcinfo.meaning})})">
					<text class="fas fa-edit" style="margin-right: 4.5px;"></text>笔记
				</view>
			</div>
			<!-- 新增例句 -->
			<wd-popup position="bottom" v-model="addExampleShow" custom-style="border-radius:16px 16px 0 0;"
				@close="addExampleShow=false">
				<view class="addExample">
					<div class="popup-container">
						<div class="popup-header">
							<div class="popup-title">添加例句</div>
						</div>
						<form id="exampleForm">
							<div class="form-group">
								<label for="japanese" class="form-label">日文例句</label>
								<textarea auto-height :maxlength="100" v-model="formData.ja" class="form-textarea"
									placeholder="请输入日文例句"></textarea>
							</div>
							<div class="form-group">
								<label for="chinese" class="form-label">中文翻译</label>
								<textarea auto-height :maxlength="100" v-model="formData.ch" class="form-textarea"
									placeholder="请输入中文翻译"></textarea>
							</div>
							<div class="popup-actions">
								<button @click="addExampleShow=false" class="popup-btn popup-btn-cancel">取消</button>
								<button @click="exampleSubmit()" class="popup-btn popup-btn-submit">添加</button>
							</div>
						</form>
					</div>
				</view>
			</wd-popup>
		</div>
		<wd-toast />
	</div>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import $http from "@/api/index.js"
	const navBarHeight = ref(0)
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		goPage,
		formatWordName,
		extractBracketContents,
		back,
		getOs
	} from "@/utils/common.js"
	import {
		userStore
	} from "@/stores/index.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	// 添加例句
	const addExampleShow = ref(false)
	const formData = ref({
		ch: "",
		ja: ""
	})
	const exampleSubmit = async () => {
		if (!userStore().loginStatus) {
			goPage("/pages/login/login?toast=请登录之后使用")
			return
		}
		if (formData.value.ch.trim().length === 0) {
			toast.warning("中文为空")
			return
		}
		if (formData.value.ja.trim().length === 0) {
			toast.warning("日文为空")
			return
		}
		const res = await $http.word.editWord({
			example: JSON.stringify(formData.value),
			word_id: Number(id.value)
		})
		toast.success('提交成功，请等待审核')
		addExampleShow.value = false
		formData.value = {
			ch: "",
			ja: ""
		}
	}
	onMounted(() => {
		const systemInfo = uni.getSystemInfoSync();
		const statusBarHeight = systemInfo.statusBarHeight;
		navBarHeight.value = statusBarHeight + 'px'
	})
	const jcinfo = ref({
		word: null,
		voice: null,
		tone: null,
		rome: null,
		kana: null,
		wordtype: "",
		meaning: [],
		example: [],
		detail: ''
	})

	const id = ref(null)
	const getJcInfo = async () => {
		const res = await $http.word.jcInfo(id.value)
		jcinfo.value = res.data
	}
	// 单词发音
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = false;
	const playUserRecord = (url) => {
		innerAudioContext.stop();
		innerAudioContext.src = url;
		innerAudioContext.play();
	}
	onLoad((e) => {
		id.value = e.id
		getJcInfo()
	})
</script>

<style lang="scss" scoped>
	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
		padding-bottom: 10px;
		border-bottom: 1px solid #eee;
	}

	.popup-title {
		font-size: 18px;
		font-weight: 600;
	}


	.form-group {
		margin-bottom: 16px;
	}

	.form-label {
		display: block;
		margin-bottom: 8px;
		font-size: 14px;
		color: #333;
	}



	.form-textarea {
		width: auto;
		min-height: 80px;
		padding: 10px 12px;
		border: 1px solid #ddd;
		border-radius: 8px;
		font-size: 14px;
		resize: vertical;
	}

	.popup-actions {
		display: flex;
		gap: 10px;
		margin-top: 20px;
	}

	.popup-btn {
		flex: 1;
		padding: 12px;
		border-radius: 8px;
		font-weight: 500;
		text-align: center;
		cursor: pointer;
		border: none;
	}

	.popup-btn-cancel {
		background-color: #f5f5f5;
		color: #333;
	}

	.popup-btn-submit {
		background-color: #07C160;
		color: white;
	}


	.popup-container {
		transform: translateY(0);
	}

	.addExample {
		padding: 16px 16px calc(env(safe-area-inset-bottom) + 16px) 16px;
	}

	.content-container {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.back-btn {
		color: white;
		font-size: 22px;
	}

	.word-header {
		position: sticky;
		top: 0;
		background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
		color: white;
		padding-left: 16px;
		padding-right: 16px;
		padding-bottom: 32px;
	}

	.word-title {
		font-size: 28px;
		font-weight: bold;
		margin-bottom: 8px;
	}

	.word-reading {
		font-size: 14px;
		opacity: 0.9;
	}

	/* 音调标记 */
	.pitch-accent {
		height: 2px;
		background: #e0e0e0;
		margin-top: 8px;
		position: relative;
	}

	.pitch-accent-bar {
		position: absolute;
		height: 4px;
		top: -1px;
		background: #07C160;
		border-radius: 2px;
	}

	/* 操作按钮 */
	.action-btn {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.2);
		color: white;
		border: none;
		font-size: 18px;
	}

	/* 主要内容区 */
	.main-content {
		flex: 1;
		overflow: auto;
		padding: 16px;
	}

	/* 卡片样式 */
	.card {
		background: white;
		border-radius: 9px;
		padding: 16px;
		margin-bottom: 16px;
	}

	/* 标签样式 */
	.tag {
		display: inline-block;
		padding: 4px 12px;
		border-radius: 4px;
		font-size: 14px;
		margin-right: 8px;
	}

	.tag-blue {
		background: #dbeafe;
		color: #2563eb;
	}

	.tag-purple {
		background: #e9d5ff;
		color: #9333ea;
	}



	.text-gray {
		color: #6b7280;
	}

	.text-bold {
		font-weight: bold;
	}


	/* 布局工具 */
	.flex {
		display: flex;
	}

	.justify-between {
		justify-content: space-between;
	}

	.items-center {
		align-items: center;
	}

	.items-start {
		align-items: flex-start;
	}


	/* 网格布局 */
	.grid-cols-2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 9px;
	}


	.examples {
		display: flex;
		flex-direction: column;
		gap: 12px;

		.example {
			border-left: 3px solid #07C160;
			padding-left: 12px;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.ch {
				padding-top: 4px;
				display: flex;
				align-items: center;
				gap: 5px;
				font-size: 14px;
				color: $uni-text-color-grey;
				border-radius: 4px;
			}

			.ja {
				display: flex;
				flex-wrap: wrap;

				.worditem {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: flex-end;

					.top {
						// color: #57D09B;
						font-size: 12px;
						// height: 12px;
						margin: 2px;
					}

					.body {
						font-size: 16px;
					}
				}
			}
		}
	}


	/* 底部操作栏 */
	.bottom-actions {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
		border-top: 1px solid #e5e7eb;
		background: white;
		padding: 12px 16px 0 16px;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.and-bottom-actions {
		padding-bottom: 12px;
	}

	.ios-bottom-actions {
		padding-bottom: calc(env(safe-area-inset-bottom));
	}

	.bottom-btn {
		padding: 8px;
		border-radius: 8px;
		font-weight: 500;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn-gray {
		background: #f3f4f6;
		color: #374151;
	}

	.btn-blue {
		background: #dbeafe;
		color: #2563eb;
	}

	.btn-green {
		background: #d1fae5;
		color: #059669;
	}
</style>