<template>
	<view class="page-container">
		<NavbarDefault border title="添加笔记"></NavbarDefault>

		<view class="editor-wrapper">
			<sv-editor eid="note-editor" placeholder="请输入笔记内容" :show-count="true" :maxlength="5000"
				@ready="onEditorReady" @input="onEditorInput"></sv-editor>
			<sv-editor-toolbar :moreTools="[
				'image',
				'link',
				'attachment',
				'clear'
			]" :tools="[
				'style',
				'emoji',
				'undo',
				'redo',
				'more',
			]" @changeTool="changeTool" @toolMoreItem="onToolMoreItem" @moreItemConfirm="moreItemConfirm" ref="toolbarRef">
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
	const onToolMoreItem = (e) => {
		console.log('onToolMoreItem ==>', e)
	}
	const toolbarRef = ref(null)

	// 移除了多余的 statusBarHeight 获取逻辑，因为 NavbarDefault 内部已处理

	// 编辑器相关
	const editorCtx = ref(null)
	const noteContent = ref(null)
	const noteText = ref(null)
	const moreItemConfirm = (e) => {
		console.log(e);
	}
	const changeTool = (e) => {
		console.log(e);
	}
	const onEditorReady = (ctx) => {
		editorCtx.value = ctx
	}

	const onEditorInput = (e) => {
		noteContent.value = e.html
		noteText.value = e.text
	}

	const handleSave = () => {
		// 这里补充原代码可能缺失的保存逻辑占位，或保持原样
		console.log('Save:', noteContent.value);
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

	/* 移除了 .custom-navbar 样式，因为不再需要 */
</style>