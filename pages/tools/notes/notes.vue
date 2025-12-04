<template>
	<view class="container">
		<navbar title="我的笔记" :showleft="true"></navbar>
		
		<scroll-view 
			scroll-y 
			class="scroll-box" 
			@scrolltolower="loadMore" 
			:lower-threshold="50"
		>
			<view class="list-wrapper">
				<view class="empty-tip" v-if="!loading && list.length === 0">
					<wd-status-tip image="content" tip="暂无笔记内容" />
				</view>

				<block v-else>
					<wd-swipe-action v-for="(item, index) in list" :key="item.id">
						<view class="note-card" @click="goDetail(item.id)">
							<view class="card-header">
								<view class="header-left">
									<wd-tag :type="getTypeColor(item.target_type)" plain size="small" custom-style="margin-right: 8px;">
										{{ getTypeLabel(item.target_type) }}
									</wd-tag>
									<text class="time">{{ formatDate(item.created_at) }}</text>
								</view>
							</view>
							<view class="card-content">
								{{ filterHtml(item.content) }}
							</view>
						</view>
						
						<template #right>
							<view class="action-btn delete-btn" @click.stop="handleDelete(item.id, index)">
								<wd-icon name="delete" size="24px" color="#fff" />
							</view>
						</template>
					</wd-swipe-action>
				</block>
			</view>
			
			<wd-loadmore v-if="list.length > 0" :state="loadState"></wd-loadmore>
			<view style="height: 30px;"></view>
		</scroll-view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onShow } from '@dcloudio/uni-app';
	import api from '@/api/index.js'; // 确保 api/index.js 导出了 common
	import dayjs from '@/uni_modules/uv-ui-tools/libs/util/dayjs.js';

	const list = ref([]);
	const page = ref(1);
	const pageSize = 10;
	const total = ref(0);
	const loadState = ref('loading'); // 'loading', 'finished', 'error'
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
			success: async (res) => {
				if (res.confirm) {
					try {
						// 根据Go后端，delete接收json body: {id: ...}
						await api.common.deleteNote({ id: id });
						uni.showToast({ title: '删除成功', icon: 'success' });
						list.value.splice(index, 1);
						// 如果当前页删空了，且还有数据，建议刷新
						if (list.value.length === 0 && total.value > 0) {
							refresh();
						}
					} catch (e) {
						uni.showToast({ title: '删除失败', icon: 'none' });
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

	// --- Helpers ---
	const formatDate = (str) => dayjs(str).format('YYYY-MM-DD HH:mm');
	
	const getTypeLabel = (type) => {
		const map = {
			'word_jp': '单词',
			'talk': '每日一句',
			'culture': '日本文化'
		};
		return map[type] || '其他';
	};

	const getTypeColor = (type) => {
		const map = {
			'word_jp': 'primary',
			'talk': 'warning',
			'culture': 'success'
		};
		return map[type] || 'info';
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
		background-color: $uni-bg-color-grey;
		overflow: hidden;
	}

	.scroll-box {
		flex: 1;
		height: 0; 
		box-sizing: border-box;
	}

	.list-wrapper {
		padding: 12px;
	}

	.empty-tip {
		padding-top: 100px;
		display: flex;
		justify-content: center;
	}

	.note-card {
		background-color: #fff;
		border-radius: $uni-border-radius-base;
		padding: 15px;
		margin-bottom: 12px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);

		.card-header {
			margin-bottom: 10px;
			.header-left {
				display: flex;
				align-items: center;
			}
			.time {
				font-size: 12px;
				color: $uni-text-color-grey;
			}
		}

		.card-content {
			font-size: 15px;
			color: $uni-text-color;
			line-height: 1.6;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 3;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	.action-btn {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 20px;
		
		&.delete-btn {
			background-color: $uni-color-error;
		}
	}
</style>