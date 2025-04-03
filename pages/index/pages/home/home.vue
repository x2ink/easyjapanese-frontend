<template>
	<view class="container">
		<!-- 顶部搜索栏 -->
		<view :style="{paddingTop:navBarHeight}" class="search-bar">
			<view @click="goPage('/pages/word/search/search')" class="search-input-container">
				<text class="icon-search search-icon fas fa-search"></text>
				<view class="search-input _GCENTER">
					搜索单词/例句
				</view>
			</view>
		</view>

		<!-- 主要内容 -->
		<view style="padding: 16px;">
			<!-- 单词书统计卡片 -->
			<view class="book-card">
				<view class="book-cover">
					N5
				</view>
				<view class="book-info">
					<view class="book-header">
						<text class="book-title">新标准日本语初级上</text>
						<view class="book-switch">
							<text class="switch-text">切换</text>
							<text class="iconfont icon-arrow-right switch-icon"></text>
						</view>
					</view>
					<text class="book-progress-text">已学习 128/500 · 记忆率 87%</text>
					<view class="progress-bar">
						<view class="progress-fill" :style="{width: '25.6%'}"></view>
					</view>
					<view class="book-stats">
						<text class="stat-item">复习: 12个</text>
						<text class="stat-item">新学: 5个</text>
						<text class="stat-item">连续7天</text>
					</view>
				</view>
			</view>

			<!-- 学习/复习按钮 -->
			<view class="action-buttons">
				<!-- 智能复习按钮 -->
				<view class="action-button review-button" @click="handleReview">
					<view class="action-icon">
						<text class="fas fa-sync-alt"></text>
					</view>
					<view class="action-content">
						<text class="action-title">智能复习</text>
						<text class="action-subtitle">12个单词待复习</text>
					</view>
				</view>

				<!-- 开始学习按钮 -->
				<view class="action-button learn-button" @click="handleLearn">
					<view class="action-icon">
						<text class="fas fa-play"></text>
					</view>
					<view class="action-content">
						<text class="action-title">开始学习</text>
						<text class="action-subtitle">今日新学5个单词</text>
					</view>
				</view>
			</view>

			<!-- 工具入口 -->
			<view class="tool-buttons">
				<view class="tool-btn" @click="navigateTo('translate')">
					<view class="tool-icon">
						<text class="fas fa-language"></text>
					</view>
					<text class="tool-text">文本翻译</text>
				</view>
				<view class="tool-btn" @click="navigateTo('grammar')">
					<view class="tool-icon">
						<text class="fas fa-book-open"></text>
					</view>
					<text class="tool-text">语法学习</text>
				</view>
				<view class="tool-btn" @click="navigateTo('hiragana')">
					<view class="tool-icon">
						<text class="fa-solid fa-turkish-lira-sign"></text>
					</view>
					<text class="tool-text">五十音图</text>
				</view>
				<view class="tool-btn" @click="navigateTo('conjugation')">
					<view class="tool-icon">
						<text class="fas fa-random"></text>
					</view>
					<text class="tool-text">动词变形</text>
				</view>
			</view>

			<!-- 今日任务 -->
			<view class="section-header">
				<text class="section-title">今日任务</text>
				<view class="section-more">
					<text class="more-text">全部</text>
					<text class="iconfont icon-arrow-right more-icon"></text>
				</view>
			</view>

			<view class="task-list">
				<view class="task-item">
					<view class="task-info">
						<text class="task-word">たべる【食べる】</text>
						<text class="task-detail">吃;喝;生活</text>
					</view>
					<text class="iconfont icon-volume task-icon"></text>
				</view>
				<view class="task-item">
					<view class="task-info">
						<text class="task-word">のむ【飲む】</text>
						<text class="task-detail">喝</text>
					</view>
					<text class="iconfont icon-volume task-icon"></text>
				</view>
				<view class="task-item">
					<view class="task-info">
						<text class="task-word">いく【行く】</text>
						<text class="task-detail">去</text>
					</view>
					<text class="iconfont icon-volume task-icon"></text>
				</view>
			</view>

			<!-- 学习日历 -->
			<view class="calendar-container">
				<view class="section-header">
					<text class="section-title">学习日历</text>
					<view class="section-more">
						<text class="more-text">本月</text>
						<text class="iconfont icon-arrow-right more-icon"></text>
					</view>
				</view>

				<view class="weekdays">
					<text class="weekday">日</text>
					<text class="weekday">一</text>
					<text class="weekday">二</text>
					<text class="weekday">三</text>
					<text class="weekday">四</text>
					<text class="weekday">五</text>
					<text class="weekday">六</text>
				</view>

				<view class="calendar-days">
					<text class="calendar-day inactive">28</text>
					<text class="calendar-day inactive">29</text>
					<text class="calendar-day inactive">30</text>
					<text class="calendar-day active">1</text>
					<text class="calendar-day active">2</text>
					<text class="calendar-day highlight">3</text>
					<text class="calendar-day active">4</text>
					<text class="calendar-day active">5</text>
					<text class="calendar-day active">6</text>
					<text class="calendar-day highlight">7</text>
					<text class="calendar-day">8</text>
					<text class="calendar-day">9</text>
					<text class="calendar-day highlight">10</text>
					<text class="calendar-day">11</text>
					<text class="calendar-day">12</text>
					<text class="calendar-day">13</text>
					<text class="calendar-day highlight">14</text>
					<text class="calendar-day">15</text>
					<text class="calendar-day">16</text>
					<text class="calendar-day">17</text>
					<text class="calendar-day highlight">18</text>
					<text class="calendar-day">19</text>
					<text class="calendar-day">20</text>
					<text class="calendar-day">21</text>
					<text class="calendar-day highlight">22</text>
					<text class="calendar-day">23</text>
					<text class="calendar-day">24</text>
					<text class="calendar-day">25</text>
					<text class="calendar-day highlight">26</text>
					<text class="calendar-day">27</text>
					<text class="calendar-day">28</text>
					<text class="calendar-day">29</text>
					<text class="calendar-day highlight">30</text>
					<text class="calendar-day inactive">1</text>
					<text class="calendar-day inactive">2</text>
					<text class="calendar-day inactive">3</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import {
		goPage
	} from "@/utils/common.js"
	const navBarHeight = ref(0)
	onMounted(() => {
		const systemInfo = wx.getSystemInfoSync();
		const statusBarHeight = systemInfo.statusBarHeight;
		navBarHeight.value = statusBarHeight + 'px'
	})
	const handleReview = () => {
		uni.navigateTo({
			url: '/pages/review/index'
		})
	}

	const handleLearn = () => {
		uni.navigateTo({
			url: '/pages/learn/index'
		})
	}

	const navigateTo = (type) => {
		let url = ''
		switch (type) {
			case 'translate':
				url = '/pages/translate/index'
				break
			case 'grammar':
				url = '/pages/grammar/index'
				break
			case 'hiragana':
				url = '/pages/hiragana/index'
				break
			case 'conjugation':
				url = '/pages/conjugation/index'
				break
		}
		uni.navigateTo({
			url
		})
	}

	onLoad(() => {
		// 初始化数据
	})

	onShow(() => {
		// 页面显示时执行
	})
</script>

<style lang="scss">
	.iconfont {
		font-family: "iconfont" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.container {
		display: flex;
		flex-direction: column;
	}

	.search-bar {
		position: sticky;
		top: 0;
		z-index: 9;
		padding: 0 16px 16px;
		background-color: #fff;

		.search-input-container {
			position: relative;

			.search-icon {
				position: absolute;
				left: 12px;
				top: 50%;
				transform: translateY(-50%);
				color: #999;
				font-size: 14px;
			}

			.search-input {
				height: 36px;
				padding: 0 36px;
				background-color: #f5f5f5;
				border-radius: 18px;
				font-size: 14px;
				color: #999;
			}
		}
	}

	.main-content {
		flex: 1;
		padding: 0 16px;
		overflow: hidden;
	}

	.book-card {
		display: flex;
		padding: 16px;
		margin-bottom: 12px;
		background-color: #fff;
		border-radius: 8px;

		.book-cover {
			width: 60px;
			height: 80px;
			margin-right: 16px;
			border-radius: 4px;
			background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
			display: flex;
			align-items: center;
			justify-content: center;
			color: white;
			font-weight: bold;
			flex-shrink: 0;
		}

		.book-info {
			flex: 1;
		}

		.book-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 8px;

			.book-title {
				font-size: 16px;
				font-weight: 500;
				color: #333;
			}

			.book-switch {
				display: flex;
				align-items: center;

				.switch-text {
					font-size: 12px;
					color: #3B82F6;
				}

				.switch-icon {
					margin-left: 2px;
					font-size: 10px;
					color: #3B82F6;
				}
			}
		}

		.book-progress-text {
			display: block;
			font-size: 12px;
			color: #999;
			margin-bottom: 6px;
		}

		.progress-bar {
			height: 6px;
			background-color: #f0f0f0;
			border-radius: 3px;
			overflow: hidden;
			margin-bottom: 8px;

			.progress-fill {
				height: 100%;
				border-radius: 3px;
				background: linear-gradient(to right, #4ADE80, #22C55E);
			}
		}

		.book-stats {
			display: flex;
			justify-content: space-between;

			.stat-item {
				font-size: 12px;
				color: #999;
			}
		}
	}

	.action-buttons {
		display: flex;
		margin-bottom: 16px;

		.action-button {
			flex: 1;
			padding: 14px;
			border-radius: 8px;
			display: flex;
			align-items: center;
			position: relative;
			overflow: hidden;

			&:active {
				transform: scale(0.98);
			}

			.action-icon {
				width: 40px;
				height: 40px;
				border-radius: 10px;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 12px;
				flex-shrink: 0;
				font-size: 18px;
				color: white;
			}

			.action-content {
				flex: 1;
				min-width: 0;
			}

			.action-title {
				display: block;
				font-weight: 600;
				font-size: 14px;
				margin-bottom: 2px;
				color: white;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.action-subtitle {
				display: block;
				font-size: 12px;
				opacity: 0.9;
				color: rgba(255, 255, 255, 0.9);
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}

		.review-button {
			background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
			margin-right: 8px;

			.action-icon {
				background: rgba(255, 255, 255, 0.2);
			}
		}

		.learn-button {
			background: linear-gradient(135deg, #10B981 0%, #059669 100%);
			margin-left: 8px;

			.action-icon {
				background: rgba(255, 255, 255, 0.2);
			}
		}
	}

	.tool-buttons {
		display: flex;
		justify-content: space-between;
		padding: 12px;
		margin-bottom: 16px;
		background-color: #fff;
		border-radius: 8px;

		.tool-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 22%;
			padding: 8px 0;
			border-radius: 8px;

			&:active {
				background-color: #f5f5f5;
			}

			.tool-icon {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 6px;
				font-size: 16px;
			}

			.tool-text {
				font-size: 14px;
				color: #666;
			}
		}

		.tool-btn:nth-child(1) .tool-icon {
			background-color: #EFF6FF;
			color: #3B82F6;
		}

		.tool-btn:nth-child(2) .tool-icon {
			background-color: #F5F3FF;
			color: #8B5CF6;
		}

		.tool-btn:nth-child(3) .tool-icon {
			background-color: #FFEDD5;
			color: #F97316;
		}

		.tool-btn:nth-child(4) .tool-icon {
			background-color: #FEE2E2;
			color: #EF4444;
		}
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;

		.section-title {
			font-size: 14px;
			font-weight: 500;
			color: #333;
		}

		.section-more {
			display: flex;
			align-items: center;

			.more-text {
				font-size: 12px;
				color: #3B82F6;
			}

			.more-icon {
				margin-left: 2px;
				font-size: 10px;
				color: #3B82F6;
			}
		}
	}

	.task-list {
		margin-bottom: 16px;

		.task-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 12px;
			margin-bottom: 8px;
			background-color: #fff;
			border-radius: 8px;

			&:last-child {
				margin-bottom: 0;
			}

			.task-info {
				flex: 1;

				.task-word {
					display: block;
					font-size: 14px;
					font-weight: 500;
					color: #333;
					margin-bottom: 4px;
				}

				.task-detail {
					display: block;
					font-size: 12px;
					color: #999;
				}
			}

			.task-icon {
				font-size: 14px;
				color: #22C55E;
			}
		}
	}

	.calendar-container {
		padding: 12px;
		margin-bottom: 16px;
		background-color: #fff;
		border-radius: 8px;

		.weekdays {
			display: flex;
			justify-content: space-between;
			margin-bottom: 8px;

			.weekday {
				flex: 1;
				text-align: center;
				font-size: 12px;
				color: #999;
			}
		}

		.calendar-days {
			display: flex;
			flex-wrap: wrap;

			.calendar-day {
				flex: 0 0 calc(100% / 7);
				height: 24px;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 12px;
				color: #333;
				margin-bottom: 4px;

				&.inactive {
					color: #ccc;
				}

				&.active {
					background-color: #F0FDF4;
					color: #16A34A;
					border-radius: 4px;
				}

				&.highlight {
					background-color: #DCFCE7;
					color: #166534;
					font-weight: 500;
					border-radius: 4px;
				}
			}
		}
	}



	/* 波纹效果 */
	.wave-effect {
		position: relative;
		overflow: hidden;

		&::after {
			content: '';
			position: absolute;
			top: 50%;
			left: 50%;
			width: 5px;
			height: 5px;
			background: rgba(255, 255, 255, 0.3);
			opacity: 0;
			border-radius: 100%;
			transform: scale(1, 1) translate(-50%);
			transform-origin: 50% 50%;
		}

		&:active::after {
			animation: wave 0.5s ease-out;
		}
	}

	@keyframes wave {
		0% {
			transform: scale(0, 0);
			opacity: 0.5;
		}

		100% {
			transform: scale(20, 20);
			opacity: 0;
		}
	}
</style>