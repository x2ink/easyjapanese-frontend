<template>
	<view class="page-container">
		<view class="custom-navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
			<NavbarDefault border title="意见反馈"></NavbarDefault>
		</view>
		<view class="editor-wrapper">
			<sv-editor eid="note-editor" placeholder="请输入笔记内容" :show-count="true" :maxlength="5000"
				@ready="onEditorReady" @input="onEditorInput"></sv-editor>
			<sv-editor-toolbar ref="toolbarRef" :style-tools="[
	      'header',
	      'divider',
	      'bold',
	      'italic',
	      'underline',
	      'strike',
	      'align',
	      'color',
	      'backgroundColor',
	      'removeformat'
	    ]">
			</sv-editor-toolbar>
		</view>
		<view class="bottom-area safe-area-bottom">
			<view class="save-btn-box">
				<wd-button custom-style="background-color: #07C160;" size="large" block
					@click="handleSave">保存笔记</wd-button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import NavbarDefault from "@/components/navbar/default"
	import SvEditorToolbar from '@/uni_modules/sv-editor/components/sv-editor/sv-editor-toolbar.vue'
	import {
		addAt,
		addTopic,
		addAttachment,
		addImage,
		addLink,
		addVideo
	} from '@/uni_modules/sv-editor/components/common/utils.js'
	const toolbarRef = ref(null)
	const statusBarHeight = ref(0)
	onLoad((options) => {
		const sysInfo = uni.getSystemInfoSync()
		statusBarHeight.value = sysInfo.statusBarHeight || 20
	})
	// 编辑器相关
	const editorCtx = ref(null)
	const noteContent = ref(null)
	const noteText = ref(null)
	const onEditorReady = (ctx) => {
		editorCtx.value = ctx
	}

	const onEditorInput = (e) => {
		noteContent.value = e.html
		noteText.value = e.text
	}
</script>

<style lang="scss" scoped>
	.page-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #f5f5f5;
	}

	.editor-wrapper {
		flex: 1;
		background-color: #fff;
		padding: 16px;
		overflow: hidden;
		display: flex;
		flex-direction: column;

		:deep(.ql-container) {
			height: 100%;
			min-height: 100%;
			font-size: 16px;
			line-height: 1.6;
		}
	}

	.bottom-area {
		background-color: #fff;
		z-index: 100;
		display: flex;
		flex-direction: column;
		padding-bottom: env(safe-area-inset-bottom);

		.save-btn-box {
			padding: 0 16px 16px 16px;
		}
	}

	/* 1. 自定义导航栏样式 */
	.custom-navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		z-index: 999;
		border-bottom: 1rpx solid #eee;
	}

</style>