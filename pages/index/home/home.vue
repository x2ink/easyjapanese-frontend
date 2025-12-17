<template>
	<view>
		<view :style="{paddingTop:`calc(${navBarHeight} + 32rpx)`}" class="search-bar">
			<view @click="goPage('/pages/word/search/search')" class="search-input-container">
				<text class="icon-search search-icon fas fa-search"></text>
				<view class="search-input _GCENTER">
					搜索单词/例句
				</view>
			</view>
		</view>
		<view :style="{height:`calc(${navBarHeight} + 136rpx)`}">
		</view>
		<view style="padding: 32rpx;">
			<view v-if="infoLoading" style="display: flex;" class="book-card">
				<wd-skeleton :row-col="[{ type: 'rect',width:'120rpx',height:'160rpx' }]" />
				<wd-skeleton :custom-style="{ width: '100%', marginLeft: '32rpx'}" :row-col="[
			   { width: '30%' ,height:'36rpx'},
			   { width: '100%' ,height:'28rpx'},
			   { width: '100%' ,height:'28rpx'}]" />
			</view>
			<view @click="openBookDetail(learnInfo.book_info)" v-else class="book-card">
				<image :src="learnInfo.book_info.icon" mode="aspectFill" class="book-cover"></image>
				<view class="book-info">
					<view class="book-header">
						<text class="book-title">{{learnInfo.book_info.name}}</text>
						<view class="book-switch" @click.stop="goPage('/pages/word/thesaurus/thesaurus')">
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
			<view class="action-buttons">
				<view class="action-button review-button" @click="goLearn('review')">
					<view class="action-icon">
						<text class="fas fa-sync-alt"></text>
					</view>
					<view class="action-content">
						<text class="action-title">智能复习</text>
						<text class="action-subtitle">{{learnInfo.review}}个单词待复习</text>
					</view>
				</view>
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
			<view class="tool-buttons">
				<view class="tool-btn" @click="goPage('/pages/tools/translate/translate')">
					<view class="tool-icon">
						<text class="fas fa-language"></text>
					</view>
					<text class="tool-text">文本翻译</text>
				</view>

				<view class="tool-btn" @click="goPage('/pages/tools/breaksentence/breaksentence')">
					<view class="tool-icon">
						<text class="fas fa-puzzle-piece"></text>
					</view>
					<text class="tool-text">词句拆解</text>
				</view>

				<view class="tool-btn" @click="goPage('/pages/tools/fiftysounds/fiftysounds')">
					<view class="tool-icon">
						<text class="fas fa-table-cells"></text>
					</view>
					<text class="tool-text">五十音图</text>
				</view>

				<view class="tool-btn" @click="goPage('/pages/tools/verbtransfiguration/verbtransfiguration')">
					<view class="tool-icon">
						<text class="fas fa-arrow-right-arrow-left"></text>
					</view>
					<text class="tool-text">动词变形</text>
				</view>
			</view>

			<view class="calendar-container">
				<view class="section-header">
					<text class="section-title">学习打卡</text>
					<view class="section-more">
						<text class="more-text">{{currentMonth}}月</text>
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

			<view class="section-header">
				<text class="section-title">常用功能</text>
			</view>

			<view class="func-grid">
				<view class="func-card" @click="goPage('/pages/tools/grammar/grammar')">
					<view class="func-icon-bg bg-orange">
						<text class="fas fa-pen-ruler"></text>
					</view>
					<view class="func-info">
						<text class="func-title">语法学习</text>
						<text class="func-desc">解析核心 掌握规律</text>
					</view>
				</view>

				<view class="func-card" @click="goPage('/pages/tools/dailytalk/dailytalk')">
					<view class="func-icon-bg bg-purple">
						<text class="fas fa-comments"></text>
					</view>
					<view class="func-info">
						<text class="func-title">日常会话</text>
						<text class="func-desc">高频场景 地道表达</text>
					</view>
				</view>

				<view class="func-card" @click="goPage('/pages/other/browse/browse',{
					src:'https://www.yuque.com/xiaoerwangluo/pteeim/fawwk19qnv8f0nwn'})">
					<view class="func-icon-bg bg-blue">
						<text class="fas fa-seedling"></text>
					</view>
					<view class="func-info">
						<text class="func-title">使用攻略</text>
						<text class="func-desc">新手必读 快速上手</text>
					</view>
				</view>

				<view class="func-card" @click="goPage('/pages/other/culture/culture')">
					<view class="func-icon-bg bg-green">
						<text class="fas fa-landmark"></text>
					</view>
					<view class="func-info">
						<text class="func-title">文化常识</text>
						<text class="func-desc">风土人情 拓展视野</text>
					</view>
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
	import http from '@/utils/request.js'
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
	const openBookDetail = (data) => {
		goPage('/pages/word/wordlist/wordlist', {
			id: data.id,
			userId: data.user_id
		})
	}
	const isLoaded = ref(false)
	const initData = () => {
		const systemInfo = uni.getSystemInfoSync();
		const statusBarHeight = systemInfo.statusBarHeight;
		navBarHeight.value = statusBarHeight + 'px'
		getConfig()
		getInfo()
		calendar.value = getCalendarMatrix(currentYear, currentMonth);
	}
	onMounted(() => {
		initData()
		isLoaded.value = true
	})
	onShow(() => {
		if (isLoaded.value) {
			initData()
		}
	})

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
				key: `${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`,
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
</script>

<style lang="scss">
	.iconfont {
		font-family: "iconfont" !important;
		font-size: 32rpx;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.search-bar {
		position: fixed;
		left: 0;
		right: 0;
		z-index: 9;
		padding: 0 32rpx 32rpx;
		background-color: #fff;
		top: 0;

		.search-input-container {
			position: relative;

			.search-icon {
				position: absolute;
				left: 24rpx;
				top: 50%;
				transform: translateY(-50%);
				color: #999;
				font-size: 28rpx;
			}

			.search-input {
				height: 72rpx;
				padding: 0 72rpx;
				background-color: #f5f5f5;
				border-radius: 36rpx;
				font-size: 28rpx;
				color: #999;
			}
		}
	}


	.book-card {
		display: flex;
		padding: 32rpx;
		margin-bottom: 24rpx;
		background-color: #fff;
		border-radius: 16rpx;

		.book-cover {
			width: 120rpx;
			height: 160rpx;
			margin-right: 32rpx;
			border-radius: 8rpx;
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
			margin-bottom: 16rpx;

			.book-title {
				font-size: 32rpx;
				font-weight: 500;
				color: #333;
			}

			.book-switch {
				display: flex;
				align-items: center;

				.switch-text {
					font-size: 24rpx;
					color: #3B82F6;
				}

				.switch-icon {
					margin-left: 4rpx;
					font-size: 20rpx;
					color: #3B82F6;
				}
			}
		}

		.book-progress-text {
			display: block;
			font-size: 24rpx;
			color: #999;
			margin-bottom: 12rpx;
		}

		.progress-bar {
			height: 12rpx;
			background-color: #f0f0f0;
			border-radius: 6rpx;
			overflow: hidden;
			margin-bottom: 16rpx;

			.progress-fill {
				height: 100%;
				border-radius: 6rpx;
				background: linear-gradient(to right, #4ADE80, #22C55E);
			}
		}

		.book-stats {
			display: flex;
			justify-content: space-between;

			.stat-item {
				font-size: 24rpx;
				color: #999;
			}
		}
	}

	.action-buttons {
		display: flex;
		margin-bottom: 32rpx;

		.action-button {
			flex: 1;
			padding: 28rpx;
			border-radius: 16rpx;
			display: flex;
			align-items: center;
			position: relative;
			overflow: hidden;

			.action-icon {
				width: 80rpx;
				height: 80rpx;
				border-radius: 20rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 24rpx;
				flex-shrink: 0;
				font-size: 36rpx;
				color: white;
			}

			.action-content {
				flex: 1;
				min-width: 0;
			}

			.action-title {
				display: block;
				font-weight: 600;
				font-size: 28rpx;
				margin-bottom: 4rpx;
				color: white;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.action-subtitle {
				display: block;
				font-size: 24rpx;
				opacity: 0.9;
				color: rgba(255, 255, 255, 0.9);
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}

		.review-button {
			background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
			margin-right: 16rpx;

			.action-icon {
				background: rgba(255, 255, 255, 0.2);
			}
		}

		.learn-button {
			background: linear-gradient(135deg, #10B981 0%, #059669 100%);
			margin-left: 16rpx;

			.action-icon {
				background: rgba(255, 255, 255, 0.2);
			}
		}
	}

	.tool-buttons {
		display: flex;
		justify-content: space-between;
		padding: 24rpx;
		margin-bottom: 32rpx;
		background-color: #fff;
		border-radius: 16rpx;

		.tool-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 22%;
			padding: 16rpx 0;
			border-radius: 16rpx;

			&:active {
				background-color: #f5f5f5;
			}

			.tool-icon {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 12rpx;
				font-size: 32rpx;
			}

			.tool-text {
				font-size: 28rpx;
				color: #666;
			}
		}

		.tool-btn:nth-child(1) .tool-icon {
			background-color: #EFF6FF;
			color: #3B82F6;
		}

		.tool-btn:nth-child(3) .tool-icon {
			background-color: #F5F3FF;
			color: #8B5CF6;
		}

		.tool-btn:nth-child(2) .tool-icon {
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
		margin-bottom: 24rpx;

		.section-title {
			font-size: 32rpx;
			font-weight: 600;
			color: #333;
		}

		.section-more {
			display: flex;
			align-items: center;

			.more-text {
				font-size: 24rpx;
				color: #999;
			}
		}
	}

	.calendar-container {
		padding: 24rpx;
		margin-bottom: 32rpx;
		background-color: #fff;
		border-radius: 16rpx;

		.weekdays {
			display: flex;
			justify-content: space-between;
			margin-bottom: 16rpx;
			margin-top: 32rpx;

			.weekday {
				flex: 1;
				text-align: center;
				font-size: 24rpx;
				color: #999;
			}
		}

		.calendar-days {
			display: flex;
			flex-wrap: wrap;

			.calendar-day {
				flex: 0 0 calc(100% / 7);
				height: 48rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 24rpx;
				color: #333;
				margin-bottom: 8rpx;

				&.inactive {
					color: #ccc;
				}

				&.active {
					background-color: #F0FDF4;
					color: #16A34A;
					border-radius: 8rpx;
				}

				&.highlight {
					background-color: #DCFCE7;
					color: #166534;
					font-weight: 500;
					border-radius: 8rpx;
				}
			}
		}
	}


	.func-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 24rpx;

		.func-card {
			position: relative;
			background-color: white;
			border-radius: 24rpx;
			padding: 24rpx;
			display: flex;
			align-items: center;
			gap: 24rpx;
			position: relative;

			&:active {
				background-color: #F9FAFB;
			}

			.func-icon-bg {
				width: 80rpx;
				height: 80rpx;
				border-radius: 20rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 36rpx;
				flex-shrink: 0;

				&.bg-orange {
					background-color: #FFF7ED;
					color: #F97316;
				}

				&.bg-purple {
					background-color: #F3F0FF;
					color: #7C3AED;
				}

				&.bg-blue {
					background-color: #EFF6FF;
					color: #3B82F6;
				}

				&.bg-green {
					background-color: #ECFDF5;
					color: #10B981;
				}
			}

			.func-info {
				flex: 1;
				display: flex;
				flex-direction: column;
				gap: 4rpx;

				.func-title {
					font-size: 28rpx;
					font-weight: 600;
					color: #1F2937;
				}

				.func-desc {
					font-size: 22rpx;
					color: #9CA3AF;
				}
			}
		}
	}
</style>