<template>
	<view>
		<!-- 顶部搜索栏 -->
		<view :style="{paddingTop:`calc(${navBarHeight} + 16px)`}" class="search-bar">
			<view @click="goPage('/pages/word/search/search')" class="search-input-container">
				<text class="icon-search search-icon fas fa-search"></text>
				<view class="search-input _GCENTER">
					搜索单词/例句
				</view>
			</view>
		</view>
		<!-- 占位 -->
		<view :style="{height:`calc(${navBarHeight} + 68px)`}">
		</view>
		<!-- 主要内容 -->
		<view style="padding: 16px;">
			<!-- 单词书统计卡片 -->
			<view v-if="infoLoading" style="display: flex;" class="book-card">
				<wd-skeleton :row-col="[{ type: 'rect',width:'60px',height:'80px' }]" />
				<wd-skeleton :custom-style="{ width: '100%', marginLeft: '16px'}" :row-col="[
			   { width: '30%' ,height:'18px'},
			   { width: '100%' ,height:'14px'},
			   { width: '100%' ,height:'14px'}]" />
			</view>
			<view v-else class="book-card">
				<image :src="learnInfo.book_info.icon" mode="aspectFill" class="book-cover"></image>
				<view class="book-info">
					<view class="book-header">
						<text class="book-title">{{learnInfo.book_info.name}}</text>
						<view class="book-switch" @click="goPage('/pages/word/thesaurus/thesaurus')">
							<text class="switch-text">切换</text>
							<text class="iconfont icon-arrow-right switch-icon"></text>
						</view>
					</view>
					<text class="book-progress-text">已学习 {{learnInfo.learnnum}}/{{learnInfo.wordnum}} · 记忆率
						{{((learnInfo.learnnum/learnInfo.wordnum)*100).toFixed(2)}}%</text>
					<view class="progress-bar">
						<view class="progress-fill" :style="{width: `${(learnInfo.learnnum/learnInfo.wordnum)*100}%`}">
						</view>
					</view>
					<view class="book-stats">
						<text class="stat-item">今日复习: {{learnInfo.day_review}}个</text>
						<text class="stat-item">今日新学: {{learnInfo.day_learn}}个</text>
						<text class="stat-item">连续{{learnInfo.day}}天</text>
					</view>
				</view>
			</view>
			<!-- 学习/复习按钮 -->
			<view class="action-buttons">
				<!-- 智能复习按钮 -->
				<view class="action-button review-button" @click="goLearn('review')">
					<view class="action-icon">
						<text class="fas fa-sync-alt"></text>
					</view>
					<view class="action-content">
						<text class="action-title">智能复习</text>
						<text class="action-subtitle">{{learnInfo.review}}个单词待复习</text>
					</view>
				</view>
				<!-- 开始学习按钮 -->
				<view class="action-button learn-button" @click="goLearn('learn')">
					<view class="action-icon">
						<text class="fas fa-play"></text>
					</view>
					<view class="action-content">
						<text class="action-title">开始学习</text>
						<text class="action-subtitle">{{learnInfo.wordnum-learnInfo.learnnum}}个单词待学习</text>
					</view>
				</view>
			</view>
			<!-- 工具入口 -->
			<view class="tool-buttons">
				<view class="tool-btn" @click="goPage('/pages/tools/translate/translate')">
					<view class="tool-icon">
						<text class="fas fa-language"></text>
					</view>
					<text class="tool-text">文本翻译</text>
				</view>
				<view class="tool-btn" @click="goPage('/pages/tools/grammar/grammar')">
					<view class="tool-icon">
						<text class="fas fa-book-open"></text>
					</view>
					<text class="tool-text">语法学习</text>
				</view>
				<view class="tool-btn" @click="goPage('/pages/tools/fiftysounds/fiftysounds')">
					<view class="tool-icon">
						<text class="fa-solid fa-turkish-lira-sign"></text>
					</view>
					<text class="tool-text">五十音图</text>
				</view>
				<view class="tool-btn" @click="goPage('/pages/tools/verbtransfiguration/verbtransfiguration')">
					<view class="tool-icon">
						<text class="fas fa-random"></text>
					</view>
					<text class="tool-text">动词变形</text>
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
					<text class="weekday">月</text>
					<text class="weekday">火</text>
					<text class="weekday">水</text>
					<text class="weekday">木</text>
					<text class="weekday">金</text>
					<text class="weekday">土</text>
				</view>
				<view class="calendar-days">
					<text :class="{highlight:learnInfo.dates.includes(item.key),inactive:currentMonth!=item.month}"
						v-for="item in calendar" :key="item.key" class="calendar-day">{{item.day}}</text>
				</view>
			</view>
			<!-- 单词任务 -->
			<view class="section-header">
				<text class="section-title">单词任务</text>
				<view class="section-more" @click="goPage('/pages/other/setplan/setplan')">
					<text class="more-text">修改</text>
					<text class="iconfont icon-arrow-right more-icon"></text>
				</view>
			</view>
		</view>
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		onShow
	} from "@dcloudio/uni-app"
	import {
		goPage,
		formatWordName
	} from "@/utils/common.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	import {
		userStore
	} from "@/stores/index.js"
	import $http from "@/api/index.js"
	const navBarHeight = ref(0)
	const goLearn = (type) => {
		if (!userStore().loginStatus) {
			goPage("/pages/login/login?toast=请登录之后使用")
			return
		}
		if (type == "learn") {
			if (learnInfo.value.learnnum == learnInfo.value.wordnum) {
				toast.warning("没有需要学习的单词了")
				return
			}
		} else {
			if (learnInfo.value.review == 0) {
				toast.warning("没有需要复习的单词了")
				return
			}
		}
		goPage('/pages/learn/learn', {
			type
		})
	}
	onMounted(() => {
		const systemInfo = uni.getSystemInfoSync();
		const statusBarHeight = systemInfo.statusBarHeight;
		navBarHeight.value = statusBarHeight + 'px'
	})
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
	const learnInfo = ref({
		"book_info": {
			"name": "",
			"id": 0,
			"describe": "",
			"icon": ""
		},
		"dates": [],
		"day": 0,
		"learn": 0,
		"learnnum": 0,
		"review": 0,
		"wordnum": 0
	})
	const infoLoading = ref(true)
	const getInfo = async () => {
		const res = await $http.word.getHomeInfo()
		learnInfo.value = res.data
		infoLoading.value = false
	}
	const getCalendarMatrix = (year, month) => {
		const firstDay = new Date(year, month - 1, 1).getDay();
		const daysInMonth = new Date(year, month, 0).getDate();
		const prevMonthDays = new Date(year, month - 1, 0).getDate();
		const totalDays = 6 * 7;
		const daysArray = [];
		for (let i = 0; i < totalDays; i++) {
			let currentDay, currentYear, currentMonth;
			if (i < firstDay) {
				currentDay = prevMonthDays - (firstDay - i - 1);
				currentYear = month === 1 ? year - 1 : year;
				currentMonth = month === 1 ? 12 : month - 1;
			} else if (i < firstDay + daysInMonth) {
				currentDay = i - firstDay + 1;
				currentYear = year;
				currentMonth = month;
			} else {
				currentDay = i - (firstDay + daysInMonth) + 1;
				currentYear = month === 12 ? year + 1 : year;
				currentMonth = month === 12 ? 1 : month + 1;
			}
			daysArray.push({
				key: `${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`, // "04-15"
				day: currentDay,
				year: currentYear,
				month: currentMonth,
				isCurrentMonth: currentMonth === month,
			});
		}
		return daysArray;
	}
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth() + 1;
	const calendar = ref([])
	const config = ref({
		learn_group: 0
	})
	const getConfig = async () => {
		const res = await $http.user.getConfig()
		config.value = res.data
	}
	onShow(() => {
		getConfig()
		getInfo()
		calendar.value = getCalendarMatrix(currentYear, currentMonth);
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

	.search-bar {
		position: fixed;
		left: 0;
		right: 0;
		z-index: 9;
		padding: 0 16px 16px;
		background-color: #fff;
		top: 0;

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
		display: flex;
		flex-direction: column;
		gap: 12px;

		.task-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 12px;
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
			margin-top: 16px;

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
</style>