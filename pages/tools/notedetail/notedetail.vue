<template>
	<view class="container">
		<navbar title="笔记详情" :showleft="true">
			<template #right>
				<view class="nav-btn" @click="toggleEdit">
					<text class="btn-text">{{ isEdit ? '保存' : '编辑' }}</text>
				</view>
			</template>
		</navbar>

		<scroll-view scroll-y class="scroll-box">
			<view class="content-wrapper">
				<view class="origin-box" v-if="originContent">
					<view class="origin-label">
						<wd-icon name="link" size="14px" color="#4D80F0"></wd-icon>
						<text>关联内容</text>
					</view>
					<view class="origin-text">{{ originContent }}</view>
				</view>

				<view class="editor-wrapper">
					<view class="info-bar">
						<text class="label">我的笔记</text>
						<text class="time" v-if="noteInfo.created_at">{{ formatDate(noteInfo.created_at) }}</text>
					</view>

					<view class="content-area">
						<editor 
							v-show="isEdit"
							id="editor" 
							class="ql-editor" 
							placeholder="在此输入笔记内容..." 
							@ready="onEditorReady"
							@input="onEditorInput"
						></editor>

						<view v-show="!isEdit" class="html-view">
							<rich-text :nodes="currentContent" v-if="currentContent"></rich-text>
							<view v-else class="empty-text">暂无内容，点击右上角编辑</view>
						</view>
					</view>
				</view>
			</view>
			<view style="height: 40px;"></view>
		</scroll-view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import api from '@/api/index.js';
	import dayjs from '@/uni_modules/uv-ui-tools/libs/util/dayjs.js';

	const id = ref('');
	const noteInfo = ref({});
	const originContent = ref('');
	const isEdit = ref(false);
	const currentContent = ref(''); // 当前展示/编辑的HTML内容
	const editorCtx = ref(null);

	onLoad(async (options) => {
		if (options.id) {
			id.value = options.id;
			await getDetail();
		}
	});

	// 获取详情
	const getDetail = async () => {
		uni.showLoading({ title: '加载中' });
		try {
			// 根据Go后端，get info 传 id
			const res = await api.common.getNoteInfo({ id: id.value });
			noteInfo.value = res.data;
			currentContent.value = res.data.content;

			// 获取关联原始内容
			if (noteInfo.value.target_type && noteInfo.value.target_id) {
				fetchOrigin(noteInfo.value.target_type, noteInfo.value.target_id);
			}

			// 如果当前处于编辑态（极端情况），重新设置内容
			if (isEdit.value && editorCtx.value) {
				editorCtx.value.setContents({ html: currentContent.value });
			}
		} catch (e) {
			uni.showToast({ title: '获取详情失败', icon: 'none' });
		} finally {
			uni.hideLoading();
		}
	};

	// 获取关联来源
	const fetchOrigin = async (type, targetId) => {
		try {
			// 根据Go后端，query origin 传 type 和 id
			const res = await api.common.queryNoteOrigin({
				type: type,
				id: targetId
			});
			originContent.value = res.data;
		} catch (e) {
			console.log('Fetch origin error', e);
		}
	};

	// 编辑器初始化
	const onEditorReady = () => {
		uni.createSelectorQuery().select('#editor').context((res) => {
			editorCtx.value = res.context;
			// 如果已有内容，初始化进去
			if (currentContent.value) {
				editorCtx.value.setContents({ html: currentContent.value });
			}
		}).exec();
	};

	// 编辑输入监听
	const onEditorInput = (e) => {
		currentContent.value = e.detail.html;
	};

	// 切换编辑/保存
	const toggleEdit = async () => {
		if (isEdit.value) {
			// 保存逻辑
			await handleSave();
		} else {
			// 进入编辑模式
			isEdit.value = true;
			// 延迟确保 editor 显示后再设置内容
			setTimeout(() => {
				if (editorCtx.value && currentContent.value) {
					editorCtx.value.setContents({ html: currentContent.value });
				}
			}, 100);
		}
	};

	// 保存笔记
	const handleSave = async () => {
		if (!currentContent.value || currentContent.value === '<p><br></p>') {
			uni.showToast({ title: '内容不能为空', icon: 'none' });
			return;
		}

		uni.showLoading({ title: '保存中' });
		try {
			// 根据Go后端，update 传 id 和 content
			await api.common.updateNote({
				id: parseInt(id.value),
				content: currentContent.value
			});
			uni.showToast({ title: '已保存', icon: 'success' });
			isEdit.value = false;
			// 更新本地缓存显示的字段
			noteInfo.value.content = currentContent.value;
		} catch (e) {
			uni.showToast({ title: '保存失败', icon: 'none' });
		} finally {
			uni.hideLoading();
		}
	};

	const formatDate = (str) => dayjs(str).format('YYYY年MM月DD日 HH:mm');
</script>

<style lang="scss" scoped>
	.container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: $uni-bg-color-grey;
	}

	.nav-btn {
		padding: 4px 12px;
		.btn-text {
			color: $uni-color-primary;
			font-size: 14px;
			font-weight: bold;
		}
	}

	.scroll-box {
		flex: 1;
		height: 0;
	}

	.content-wrapper {
		padding: 15px;
	}

	/* 关联来源样式 */
	.origin-box {
		background-color: #EBF2FF;
		border-radius: 8px;
		padding: 12px;
		margin-bottom: 15px;
		border: 1px solid rgba(77, 128, 240, 0.1);

		.origin-label {
			display: flex;
			align-items: center;
			margin-bottom: 6px;
			gap: 4px;
			font-size: 13px;
			color: $uni-color-primary;
			font-weight: bold;
		}

		.origin-text {
			font-size: 15px;
			color: #333;
			line-height: 1.5;
		}
	}

	/* 编辑器及内容样式 */
	.editor-wrapper {
		background-color: #fff;
		border-radius: 8px;
		padding: 20px 15px;
		min-height: 400px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
		display: flex;
		flex-direction: column;

		.info-bar {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 15px;
			border-bottom: 1px solid #f5f5f5;
			margin-bottom: 15px;

			.label {
				font-size: 16px;
				font-weight: bold;
				color: #333;
				position: relative;
				padding-left: 10px;
				
				&::before {
					content: '';
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					width: 4px;
					height: 16px;
					background-color: $uni-color-primary;
					border-radius: 2px;
				}
			}

			.time {
				font-size: 12px;
				color: #999;
			}
		}

		.content-area {
			flex: 1;
			position: relative;
		}

		.ql-editor {
			height: 100%;
			min-height: 300px;
			font-size: 15px;
			line-height: 1.6;
		}

		.html-view {
			font-size: 15px;
			color: #333;
			line-height: 1.8;
			word-break: break-all;
			
			img {
				max-width: 100%;
			}
		}
		
		.empty-text {
			color: #ccc;
			font-size: 14px;
			text-align: center;
			margin-top: 50px;
		}
	}
</style>