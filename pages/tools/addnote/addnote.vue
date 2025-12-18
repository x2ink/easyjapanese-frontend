<template>
	<Loading v-if="!showEditor"></Loading>
	<view v-show="showEditor" class="page-container">
		<NavbarDefault border title="添加笔记"></NavbarDefault>
		<view v-if="targetId" class="source-bar">
			<view class="source-label">
				<text>笔记来源</text>
			</view>
			<view class="source-content">
				<text class="source-title">{{ origin }}</text>
			</view>
		</view>

		<view class="editor-wrapper">
			<sv-editor v-show="showEditor" eid="note-editor" placeholder="请输入笔记内容" :show-count="true" :maxlength="5000"
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
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		userStore
	} from '@/stores/index.js'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import $http from "@/api/index.js"
	import NavbarDefault from "@/components/navbar/default"
	import SvEditorToolbar from '@/uni_modules/sv-editor/components/sv-editor/sv-editor-toolbar.vue'
	import Loading from "@/components/loading/loading.vue"
	import {
		addAttachment,
		addImage,
		addLink
	} from '@/uni_modules/sv-editor/components/common/utils.js'
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	import http from "@/utils/request.js"
	const toast = useToast()
	const onToolMoreItem = (e) => {
		if (e.name === 'clear') {
			uni.showModal({
				title: '提示',
				content: '确定要清空编辑器内容吗？',
				success: (res) => {
					if (res.confirm) {

						editorCtx.value.clear()
						toast.success('已清空')
					}
				}
			})
		}
	}
	const toolbarRef = ref(null)


	const editorCtx = ref(null)
	const noteContent = ref(null)
	const noteText = ref(null)
	const moreItemConfirm = async (e) => {
		if (e.name == "link") {
			addLink({
				link: e.link,
				text: e.text
			}, function() {
				console.log("写入成功");
			})
		} else if (e.name == "image") {
			let imageUrl = "";
			if (e.link) {
				imageUrl = e.link;
			}
			if (e.file && e.file.length > 0) {
				toast.loading('图片上传中');
				try {
					const fileRes = await uni.uploadFile({
						url: `${http.baseUrl}upload`,
						filePath: e.file[0].tempFilePath,
						name: 'file',
						header: {
							"Authorization": userStore().token
						},
						formData: {
							"file_name": `files/note/${new Date().getTime()}_${userStore().userInfo.id}.jpg`
						}
					});
					imageUrl = JSON.parse(fileRes.data).url;
				} catch (error) {
					console.error("上传失败", error);
					toast.close();
					return;
				}
				toast.close();
			}
			if (imageUrl) {
				addImage(async () => {
					return [imageUrl];
				}, {
					width: "100%",
				});
			}
		} else if (e.name == "attachment") {
			const attachmentUploadTask = async () => {
				if (e.file) {
					const fileData = e.file
					const MAX_SIZE = 10 * 1024 * 1024;
					if (fileData.size > MAX_SIZE) {
						toast.warning('附件大小不能超过10MB');
						return null;
					}
					toast.loading('附件上传中...');
					try {

						const filePath = fileData.path || fileData.tempFilePath;

						const uploadRes = await uni.uploadFile({
							url: `${http.baseUrl}upload`,
							filePath: filePath,
							name: 'file',
							header: {
								"Authorization": userStore().token
							},
							formData: {

								"file_name": `files/note/attachment/${Date.now()}_${userStore().userInfo.id}_${fileData.name}`
							}
						});


						const serverUrl = JSON.parse(uploadRes.data).url;



						return {
							path: serverUrl,
							text: e.text || fileData.name
						};

					} catch (error) {
						console.error("附件上传失败", error);
						toast.warning('上传失败');
						return null;
					} finally {
						toast.close();
					}
				} else if (e.link) {
					return {
						path: e.link,
						text: e.text || '附件链接'
					};
				}
				return null;
			};
			console.log(attachmentUploadTask);
			addAttachment(attachmentUploadTask);
		}
	}
	const changeTool = (e) => {
		console.log(e);
	}
	const showEditor = ref(false)
	const onEditorReady = async (ctx) => {
		editorCtx.value = ctx
		try {
			if (noteId.value || targetId.value || targetType.value) {
				const params = {
					...(noteId.value && {
						id: noteId.value
					}),
					...(targetId.value && {
						target_id: targetId.value
					}),
					...(targetType.value && {
						target_type: targetType.value
					})
				}
				const res = await $http.common.getNoteInfo(params)
				ctx.initHtml(res.data.content)
			}
		} catch (err) {
			console.log(err);
		} finally {
			showEditor.value = true
		}
	}

	const onEditorInput = (e) => {
		noteContent.value = e.html
		noteText.value = e.text
	}

	const handleSave = async () => {
		if (noteContent.value == "<p><br></p>" || noteContent.value == null || noteContent.value == "") {
			toast.warning("笔记不可为空")
			return
		}
		if (targetType.value) {
			try {
				const res = await $http.common.submitNote({
					target_id: Number(targetId.value),
					target_type: targetType.value,
					content: noteContent.value
				})
				if (res.data) {
					toast.success("新增笔记成功")
					noteId.value = res.data
				} else {
					toast.success("修改笔记成功")
				}
			} catch (err) {
				console.log(err);
				toast.warning("新增失败")
			}
		} else {
			toast.warning("新增失败")
		}
	}
	const origin = ref('')
	const queryOrigin = async (type, id) => {
		try {
			const res = await $http.common.queryNoteOrigin({
				type,
				id
			})
			origin.value = res.data
		} catch (err) {
			console.log(err);
		}
	}
	const targetId = ref(null)
	const targetType = ref(null)
	const noteId = ref(null)
	onLoad((e) => {
		if (e.id) {
			targetId.value = e.id
			targetType.value = e.type
			queryOrigin(e.type, e.id)
		} else {
			targetType.value = "other"
		}
		if (e.noteId) {
			noteId.value = e.noteId
		}
	})
</script>

<style lang="scss" scoped>
	.page-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #f5f5f5;
	}

	.source-bar {
		background-color: #fff;
		padding: 28rpx 32rpx;
		display: flex;
		align-items: center;
		border-bottom: 2rpx solid #f0f0f0;

		.source-label {
			display: flex;
			align-items: center;
			margin-right: 24rpx;
			flex-shrink: 0;

			&::before {
				content: '';
				display: block;
				width: 6rpx;
				height: 24rpx;
				background-color: #07C160;
				border-radius: 4rpx;
				margin-right: 12rpx;
			}

			text {
				font-size: 28rpx;
				color: #909399;
			}
		}

		.source-content {
			flex: 1;
			overflow: hidden;

			.source-title {
				font-size: 30rpx;
				color: #303133;
				font-weight: 500;
				display: block;

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
		border-radius: 200rpx !important;
	}

	:deep(.sv-editor-popup-container .form-input) {
		border-radius: 200rpx !important;
		padding: 16rpx 24rpx !important;
		font-size: 24rpx !important;
		background-color: #f7f8fa;
		color: #333;
		border: none !important;
	}

	.editor-wrapper {
		flex: 1;
		background-color: #fff;
		padding: 32rpx;
		overflow: hidden;
		display: flex;
		flex-direction: column;

		:deep(.ql-container) {
			height: 100%;
			min-height: 100%;
			font-size: 32rpx;
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
			padding: 0 32rpx 32rpx 32rpx;
		}
	}
</style>