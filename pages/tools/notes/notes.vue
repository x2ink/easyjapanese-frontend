<template>
	<page-meta page-style="background-color:#ffffff;">
		<view class="container">
			<NavbarDefault border title="我的笔记"></NavbarDefault>

			<scroll-view scroll-y class="scroll-box" @scrolltolower="loadMore" :lower-threshold="50">
				<view class="content-wrapper">
					<view class="empty-box" v-if="!loading && list.length === 0">
						<text class="fas fa-book-open empty-icon"></text>
						<text class="empty-text">暂无笔记内容</text>
					</view>

					<block v-else>
						<view class="note-item" v-for="(item, index) in list" :key="item.id" @click="goDetail(item.id)">
							<view class="item-header">
								<view class="header-left">
									<view class="tag" :class="getTypeClass(item.target_type)">
										{{ getTypeLabel(item.target_type) }}
									</view>
									<text class="time">{{ formatDate(item.created_at) }}</text>
								</view>
								<view class="delete-btn" @click.stop="handleDelete(item.id, index)">
									<text class="fas fa-trash-alt"></text>
								</view>
							</view>

							<view class="item-content">
								{{ filterHtml(item.content) || '暂无文字内容' }}
							</view>
						</view>
					</block>

					<view class="load-more" v-if="loadState === 'loading'">
						<text class="loading-text">加载中...</text>
					</view>
				</view>

				<view style="height: 80rpx;"></view>
			</scroll-view>
			<view @click="goPage('/pages/tools/addnote/addnote')" class="sheet-btn _GCENTER">
				<text class="fas fa-pen-to-square"></text>
				<view>记笔记</view>
			</view>
		</view>
	</page-meta>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		goPage
	} from '@/utils/common';
	import {
		onShow
	} from '@dcloudio/uni-app';
	import api from '@/api/index.js';
	import dayjs from 'dayjs';
	import NavbarDefault from "@/components/navbar/default.vue";

	const list = ref([]);
	const page = ref(1);
	const pageSize = 10;
	const total = ref(0);
	const loadState = ref('loading');
	const loading = ref(false);

	onShow(() => {
		refresh();
	});

	const refresh = async () => {
		page.value = 1;
		list.value = [];
		loadState.value = 'loading';
		await getList();
	};
	const getList = async () => {
		if (loading.value) return;
		loading.value = true;
		try {
			const res = await api.common.getNoteList({
				page: page.value,
				pageSize: pageSize
			});

			if (page.value === 1) {
				list.value = res.data;
			} else {
				list.value = [...list.value, ...res.data];
			}

			total.value = res.total;

			if (list.value.length >= total.value) {
				loadState.value = 'finished';
			} else {
				loadState.value = 'loading';
			}
		} catch (e) {
			console.error(e);
			loadState.value = 'error';
		} finally {
			loading.value = false;
		}
	};

	const loadMore = () => {
		if (loadState.value === 'finished' || loadState.value === 'error' || loading.value) return;
		page.value++;
		getList();
	};

	const handleDelete = (id, index) => {
		uni.showModal({
			title: '提示',
			content: '确定要删除这条笔记吗？',
			confirmColor: '#FF4D4F',
			success: async (res) => {
				if (res.confirm) {
					try {
						await api.common.deleteNote({
							id: id
						});
						uni.showToast({
							title: '删除成功',
							icon: 'success'
						});
						list.value.splice(index, 1);
						if (list.value.length === 0 && total.value > 0) {
							refresh();
						}
					} catch (e) {
						uni.showToast({
							title: '删除失败',
							icon: 'none'
						});
					}
				}
			}
		});
	};

	const goDetail = (id) => {
		uni.navigateTo({
			url: `/pages/tools/notedetail/notedetail?id=${id}`
		});
	};


	const formatDate = (str) => dayjs(str).format('MM-DD HH:mm');

	const getTypeLabel = (type) => {
		const map = {
			'word_jp': '单词',
			'talk': '每日一句',
			'culture': '文化'
		};
		return map[type] || '笔记';
	};

	const getTypeClass = (type) => {
		const map = {
			'word_jp': 'tag-blue',
			'talk': 'tag-orange',
			'culture': 'tag-green'
		};
		return map[type] || 'tag-gray';
	};

	const filterHtml = (html) => {
		if (!html) return '';
		return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");
	};
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
		padding: 32rpx;
	}


	.note-item {
		background-color: #f7f8fa;
		border-radius: 24rpx;
		padding: 32rpx;
		margin-bottom: 24rpx;
		transition: opacity 0.2s;

		&:active {
			opacity: 0.8;
		}

		.item-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;

			.header-left {
				display: flex;
				align-items: center;
				gap: 16rpx;
			}

			.time {
				font-size: 24rpx;
				color: #999;
				font-family: Arial, sans-serif;
			}

			.delete-btn {
				padding: 8rpx;
				color: #ccc;
				font-size: 28rpx;
				transition: color 0.2s;

				&:active {
					color: #FF4D4F;
				}
			}
		}

		.item-content {
			font-size: 28rpx;
			color: #333;
			line-height: 1.6;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 3;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}


	.tag {
		font-size: 22rpx;
		padding: 4rpx 16rpx;
		border-radius: 8rpx;
		font-weight: 500;
	}

	.tag-blue {
		background-color: rgba(77, 128, 240, 0.1);
		color: #4D80F0;
	}

	.tag-orange {
		background-color: rgba(255, 149, 0, 0.1);
		color: #FF9500;
	}

	.tag-green {
		background-color: rgba(7, 193, 96, 0.1);
		color: #07C160;
	}

	.tag-gray {
		background-color: #eaeaea;
		color: #666;
	}


	.empty-box {
		padding-top: 240rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #ddd;

		.empty-icon {
			font-size: 96rpx;
			margin-bottom: 32rpx;
			color: #eee;
		}

		.empty-text {
			font-size: 28rpx;
			color: #ccc;
		}
	}

	.load-more {
		text-align: center;
		padding: 40rpx 0;

		.loading-text {
			font-size: 24rpx;
			color: #ccc;
		}
	}
</style>