<template>
	<page-meta page-style="background-color:#ffffff;">
		<view class="container">
			<NavbarDefault border title="笔记详情"></NavbarDefault>

			<scroll-view scroll-y class="scroll-box">
				<view class="content-wrapper">

					<view class="origin-box" v-if="originContent">
						<view class="origin-header">
							<text class="fas fa-link origin-icon"></text>
							<text class="origin-title">关联内容</text>
						</view>
						<view class="origin-text">{{ originContent }}</view>
					</view>

					<view class="note-container">
						<view class="meta-info">
							<text class="meta-label">我的记录</text>
							<text class="meta-time"
								v-if="noteInfo.created_at">{{ formatDate(noteInfo.created_at) }}</text>
						</view>

						<view class="content-view">
							<rich-text :nodes="currentContent"
								v-if="currentContent && currentContent !== '<p><br></p>'"></rich-text>
							<view v-else class="empty-placeholder">暂无详细内容</view>
						</view>
					</view>
				</view>

				<view style="height: 100px;"></view>
			</scroll-view>

			<view class="footer-action">
				<button class="action-btn" @click="goToEdit">
					编辑笔记
				</button>
			</view>
		</view>
	</page-meta>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onLoad,
		onShow
	} from '@dcloudio/uni-app';
	import api from '@/api/index.js';
	import dayjs from '@/uni_modules/uv-ui-tools/libs/util/dayjs.js';
	import NavbarDefault from "@/components/navbar/default.vue";
	import {
		goPage
	} from '@/utils/common';

	const id = ref('');
	const noteInfo = ref({});
	const originContent = ref('');
	const currentContent = ref('');

	onLoad((options) => {
		if (options.id) {
			id.value = options.id;
		}
	});

	// 从 addnote 返回时可能修改了内容，需要刷新
	onShow(() => {
		if (id.value) {
			getDetail();
		}
	})

	const getDetail = async () => {
		uni.showLoading({
			title: '加载中',
			mask: true
		});
		try {
			const res = await api.common.getNoteInfo({
				id: id.value
			});
			noteInfo.value = res.data;
			currentContent.value = res.data.content;

			if (noteInfo.value.target_type && noteInfo.value.target_id) {
				fetchOrigin(noteInfo.value.target_type, noteInfo.value.target_id);
			}
		} catch (e) {
			uni.showToast({
				title: '获取详情失败',
				icon: 'none'
			});
		} finally {
			uni.hideLoading();
		}
	};

	const fetchOrigin = async (type, targetId) => {
		try {
			const res = await api.common.queryNoteOrigin({
				type: type,
				id: targetId
			});
			originContent.value = res.data;
		} catch (e) {
			console.log('Fetch origin error', e);
		}
	};

	// 跳转到编辑页面
	const goToEdit = () => {
		goPage("/pages/tools/addnote/addnote", {
			noteId: id.value,
			id: noteInfo.value.target_id,
			type: noteInfo.value.target_type
		})
	};

	const formatDate = (str) => dayjs(str).format('YYYY年MM月DD日 HH:mm');
</script>

<style lang="scss" scoped>
	.container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
	}

	.scroll-box {
		flex: 1;
		height: 0;
	}

	.content-wrapper {
		padding: 20px 16px;
	}

	/* 关联来源 */
	.origin-box {
		background-color: #f0f2f5;
		border-radius: 12px;
		padding: 16px;
		margin-bottom: 24px;

		.origin-header {
			display: flex;
			align-items: center;
			margin-bottom: 8px;
			color: #666;

			.origin-icon {
				font-size: 12px;
				margin-right: 6px;
			}

			.origin-title {
				font-size: 13px;
				font-weight: 600;
			}
		}

		.origin-text {
			font-size: 15px;
			color: #333;
			line-height: 1.6;
		}
	}

	/* 笔记主体 */
	.note-container {
		.meta-info {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 16px;
			padding-bottom: 16px;
			border-bottom: 1px solid #f5f5f5;

			.meta-label {
				font-size: 18px;
				font-weight: 700;
				color: #1a1a1a;
			}

			.meta-time {
				font-size: 12px;
				color: #ccc;
			}
		}
	}

	.content-view {
		font-size: 16px;
		color: #333;
		line-height: 1.8;
		word-break: break-all;
		min-height: 200px;

		img {
			max-width: 100%;
			border-radius: 8px;
		}
	}

	.empty-placeholder {
		color: #ccc;
		font-size: 14px;
		padding-top: 20px;
		font-style: italic;
	}

	/* 底部操作区 */
	.footer-action {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(255, 255, 255, 0.95);
		padding: 12px 20px 30px;
		backdrop-filter: blur(10px);
		z-index: 10;
		border-top: 1px solid #f9f9f9;
	}

	.action-btn {
		height: 48px;
		line-height: 48px;
		background-color: #07C160;
		/* 使用绿色强调主操作 */
		color: #ffffff;
		border-radius: 100px;
		font-size: 16px;
		font-weight: 600;
		border: none;
		text-align: center;
		transition: all 0.2s;
		box-shadow: 0 4px 12px rgba(7, 193, 96, 0.2);

		&::after {
			border: none;
		}

		&:active {
			transform: scale(0.98);
			opacity: 0.9;
		}
	}
</style>