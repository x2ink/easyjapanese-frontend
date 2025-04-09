<template>
	<div class="screen">
		<!-- 可滚动内容区域 -->
		<view class="content-wrapper">
			<!-- 功能入口 -->
			<div :style="{paddingTop:`calc(${navBarHeight} + 10px)`}" class="action-buttons">
				<div class="button-item">
					<button class="action-button blue">
						<i class="fas fa-history mr-1"></i> 回顾
					</button>
				</div>
				<div class="button-item">
					<button class="action-button green">
						<i class="fas fa-calendar-day mr-1"></i> 预习
					</button>
				</div>
				<div class="button-item">
					<button class="action-button purple">
						<i class="fas fa-pen-fancy mr-1"></i> 听写
					</button>
				</div>
			</div>

			<!-- 主要内容 -->
			<div class="main-content">
				<!-- 词书选择 -->
				<div class="book-selector">
					<div class="book-info">
						<div class="book-level">N5</div>
						<div class="book-details">
							<div class="book-name">新标准日本语初级上</div>
							<div class="book-progress">已学 128/500 · 记忆率 87%</div>
						</div>
					</div>
					<i class="fas fa-chevron-right text-gray-400"></i>
				</div>

				<!-- 每日谚语 -->
				<div class="daily-proverb">
					<div class="quote-mark">「</div>
					<div class="proverb-content">
						<div class="proverb-text">{{sentence.ja}}</div>
						<div class="proverb-translation">{{sentence.ch}}</div>
						<div class="proverb-source">— {{sentence.source}}</div>
					</div>
				</div>

				<!-- 功能入口 -->
				<div class="feature-grid">
					<div class="feature-card word-card" @click="goPage('/pages/word/mybooks/mybooks')">
						<div class="feature-icon blue">
							<i class="fas fa-book"></i>
						</div>
						<div class="feature-name">单词本</div>
					</div>
					<div class="feature-card word-card">
						<div class="feature-icon green">
							<i class="fas fa-comment-dots"></i>
						</div>
						<div class="feature-name">句库</div>
					</div>
					<div class="feature-card word-card">
						<div class="feature-icon orange">
							<i class="fas fa-sticky-note"></i>
						</div>
						<div class="feature-name">笔记</div>
					</div>
					<div class="feature-card word-card">
						<div class="feature-icon purple">
							<i class="fas fa-sliders-h"></i>
						</div>
						<div class="feature-name">设置</div>
					</div>
				</div>

				<!-- 排行榜 -->
				<div class="ranking-header">
					<div class="ranking-title">单词达人榜</div>
					<div class="ranking-more">全部 <i class="fas fa-chevron-right ml-0.5"></i></div>
				</div>

				<div class="ranking-list">
					<div class="ranking-item">
						<div class="rank-number blue">1</div>
						<div class="user-info">
							<div class="username">日语小达人</div>
							<div class="user-stats">已背 1280 个单词</div>
						</div>
						<uv-avatar size="35" src=""></uv-avatar>
					</div>
					<div class="ranking-item">
						<div class="rank-number purple">2</div>
						<div class="user-info">
							<div class="username">学习狂魔</div>
							<div class="user-stats">已背 980 个单词</div>
						</div>
						<uv-avatar size="35" src=""></uv-avatar>
					</div>
					<div class="ranking-item">
						<div class="rank-number green">3</div>
						<div class="user-info">
							<div class="username">坚持就是胜利</div>
							<div class="user-stats">已背 750 个单词</div>
						</div>
						<uv-avatar size="35" src=""></uv-avatar>
					</div>
				</div>
			</div>
		</view>
	</div>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	const navBarHeight = ref(0)
	import {
		goPage
	} from "@/utils/common.js"
	import $http from "@/api/index.js"
	const sentence = ref({})
	const getSentence = async () => {
		const res = await $http.common.getSentence()
		sentence.value = res.data
	}
	onMounted(() => {
		const systemInfo = wx.getSystemInfoSync();
		const statusBarHeight = systemInfo.statusBarHeight;
		navBarHeight.value = statusBarHeight + 'px'
		getSentence()
	})
</script>

<style lang="scss">
	.screen {
		display: flex;
		flex-direction: column;
		position: relative;
	}


	.content-wrapper {
		flex: 1;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;

		/* 隐藏滚动条但保留滚动功能 */
		&::-webkit-scrollbar {
			display: none;
		}
	}

	.action-buttons {
		padding: 12px 16px;
		background: white;
		display: flex;
		justify-content: space-between;

		.button-item {
			flex: 1;
			text-align: center;

			&:nth-child(2) {
				margin: 0 8px;
			}
		}

		.action-button {
			width: 100%;
			padding: 8px 0;
			border-radius: 8px;
			font-size: 14px;
			font-weight: 500;

			&.blue {
				background-color: #ebf5ff;
				color: #3b82f6;
			}

			&.green {
				background-color: #ebf7ee;
				color: #10b981;
			}

			&.purple {
				background-color: #f5f3ff;
				color: #8b5cf6;
			}
		}
	}

	.main-content {
		padding: 16px;
	}

	.book-selector {
		background: white;
		border-radius: 8px;
		padding: 16px;
		margin-bottom: 12px;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.book-info {
			display: flex;
			align-items: center;
		}

		.book-level {
			width: 48px;
			height: 64px;
			border-radius: 8px;
			background: linear-gradient(to bottom right, #4ade80, #22d3ee);
			display: flex;
			align-items: center;
			justify-content: center;
			color: white;
			font-weight: bold;
			margin-right: 12px;
		}

		.book-name {
			font-size: 16px;
			font-weight: 500;
		}

		.book-progress {
			font-size: 12px;
			color: #666;
			margin-top: 4px;
		}
	}

	.daily-proverb {
		background: white;
		border-radius: 8px;
		padding: 16px;
		margin-bottom: 12px;
		display: flex;

		.quote-mark {
			font-size: 24px;
			color: #f59e0b;
			margin-right: 12px;
		}

		.proverb-text {
			font-size: 16px;
			color: #333;
		}

		.proverb-translation {
			font-size: 14px;
			color: #666;
			margin-top: 4px;
		}

		.proverb-source {
			font-size: 12px;
			color: #999;
			margin-top: 8px;
		}
	}

	.feature-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
		margin-bottom: 12px;

		.feature-card {
			background: white;
			border-radius: 8px;
			padding: 16px;
			display: flex;
			flex-direction: column;
			align-items: center;

			.feature-icon {
				width: 48px;
				height: 48px;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 8px;
				font-size: 20px;

				&.blue {
					background: #ebf5ff;
					color: #3b82f6;
				}

				&.green {
					background: #ebf7ee;
					color: #10b981;
				}

				&.orange {
					background: #fff7ed;
					color: #f97316;
				}

				&.purple {
					background: #f5f3ff;
					color: #8b5cf6;
				}
			}

			.feature-name {
				font-size: 14px;
			}
		}
	}

	.word-card {
		transition: all 0.2s ease;

		&:active {
			transform: scale(0.98);
		}
	}

	.ranking-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;

		.ranking-title {
			font-size: 14px;
			font-weight: 500;
		}

		.ranking-more {
			font-size: 12px;
			color: #3b82f6;

			i {
				font-size: 10px;
			}
		}
	}

	.ranking-list {
		display: flex;
		flex-direction: column;
		gap: 8px;

		.ranking-item {
			background: white;
			border-radius: 8px;
			padding: 12px;
			display: flex;
			align-items: center;

			.rank-number {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: bold;
				margin-right: 12px;

				&.blue {
					background: #dbeafe;
					color: #2563eb;
				}

				&.purple {
					background: #ede9fe;
					color: #7c3aed;
				}

				&.green {
					background: #dcfce7;
					color: #16a34a;
				}
			}

			.user-info {
				flex: 1;

				.username {
					font-size: 14px;
					font-weight: 500;
				}

				.user-stats {
					font-size: 12px;
					color: #666;
					margin-top: 2px;
				}
			}

		}
	}
</style>