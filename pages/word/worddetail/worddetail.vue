<template>
	<div class="content-container">
		<!-- 单词标题区 -->
		<div class="word-header" :style="{paddingTop:navBarHeight}">
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
						<view class="action-btn">
							<text class="fas fa-volume-up"></text>
						</view>
						<view class="action-btn">
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
						<span :key="item" v-for="item in extractBracketContents(jcinfo.wordtype)"
							class="tag tag-blue">{{item}}</span>
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
					<view style="color: #10b981;">
						<text class="fas fa-plus-circle" style="margin-right: 4px;"></text>添加例句
					</view>
				</div>
				<view class="examples">
					<view class="example" :key="item.id" v-for="item in jcinfo.example">
						<view>
							<view class="ja jpfont">
								<view class="worditem" v-for="item1 in item.read">
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
			<div class="bottom-actions">
				<view @click="goPage('/pages/word/mybooks/mybooks',{wordId:id})"
					class="bottom-btn btn-gray">
					<text class="fas fa-bookmark" style="margin-right: 4.5px;"></text> 生词本
				</view>
				<view class="bottom-btn btn-blue">
					<text class="fas fa-search" style="margin-right: 4.5px;"></text> 全网搜索
				</view>
				<view class="bottom-btn btn-green">
					<text class="fas fa-robot" style="margin-right: 4.5px;"></text> 问AI
				</view>
			</div>
		</div>
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
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import {
		goPage,
		formatWordName,
		back
	} from "@/utils/common.js"
	onMounted(() => {
		const systemInfo = wx.getSystemInfoSync();
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
	const extractBracketContents = (text) => {
		const regex = /【([^】]*)】|([a-zA-Z]+)/g;
		const matches = [...text.matchAll(regex)];
		const result = [];
		for (const match of matches) {
			if (match[1]) {
				result.push(match[1]);
			} else if (match[2]) {
				result.push(match[2]);
			}
		}

		return result;
	}
	const id = ref(null)
	const getJcInfo = async () => {
		const res = await $http.word.jcInfo(id.value)
		jcinfo.value = res.data
	}
	onLoad((e) => {
		id.value = e.id
		getJcInfo()
	})
</script>

<style lang="scss" scoped>
	/* 内容容器 */
	.content-container {
		height: 100%;
		display: flex;
		flex-direction: column;
		background: #f9fafb;
	}

	/* 返回按钮 */
	.back-btn {
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

	/* 单词标题区 */
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
		padding-bottom: calc(env(safe-area-inset-bottom) + 12px);
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
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