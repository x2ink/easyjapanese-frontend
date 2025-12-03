<template>
	<view class="page-container">
		<NavbarDefault border title="添加笔记"></NavbarDefault>

		<view class="source-bar">
			<view class="source-label">
				<text>笔记来源</text>
			</view>
			<view class="source-content">
				<text class="source-title">{{ sourceTitle }}</text>
			</view>
		</view>

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
			]" @changeTool="changeTool" @toolMoreItem="onToolMoreItem" @moreItemConfirm="moreItemConfirm"
				ref="toolbarRef">
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
		addAttachment,
		addImage,
		addLink
	} from '@/uni_modules/sv-editor/components/common/utils.js'

	// 模拟来源标题数据，实际开发中可能从上个页面传参获取
	const sourceTitle = ref('这里是来源的标题内容')

	const onToolMoreItem = (e) => {
		console.log('onToolMoreItem ==>', e)
	}
	const toolbarRef = ref(null)

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

	/* 新增：笔记来源样式 */
	.source-bar {
		background-color: #fff;
		padding: 14px 16px;
		display: flex;
		align-items: center;
		border-bottom: 1px solid #f0f0f0; // 极淡的分割线
		
		.source-label {
			display: flex;
			align-items: center;
			margin-right: 12px;
			flex-shrink: 0;
			
			&::before {
				content: '';
				display: block;
				width: 3px;
				height: 12px;
				background-color: #07C160; // 呼应品牌色
				border-radius: 2px;
				margin-right: 6px;
			}

			text {
				font-size: 14px;
				color: #909399; // 次级文本颜色
			}
		}

		.source-content {
			flex: 1;
			overflow: hidden; // 防止文字溢出
			
			.source-title {
				font-size: 15px;
				color: #303133;
				font-weight: 500;
				display: block;
				// 单行文本溢出省略
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}

	:deep(.sv-editor-popup) {
		left: 0;
		width: auto;
		right: 0;
	}

	:deep(.sv-editor-popup-container .form-button) {
		background-color: #07C160;
		color: white;
		border-radius: 100px !important;
	}

	:deep(.sv-editor-popup-container .form-input) {
		border-radius: 100px !important;
		padding: 8px 12px !important;
		font-size: 14px !important;
	}

	.editor-wrapper {
		flex: 1;
		background-color: #fff;
		padding: 16px; // 保持原有内边距
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
</style>