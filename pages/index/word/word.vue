<template>
	<view>
		<view class="logotext" :style="{paddingTop:`calc(${navBarHeight} + 32rpx)!important`}">
			<image src="https://jpx2ink.oss-cn-shanghai.aliyuncs.com/images/logo.png" mode="aspectFit"></image>
			<view>
				<view class="title">轻松日语</view>
				<view class="description">自由的日语单词学习助手</view>
			</view>
		</view>

		<view class="action-buttons">
			<view class="button-item" @click="goToolPage('/pages/word/review/review')">
				<button class="action-button blue">
					<text class="fas fa-history mr-1"></text> 回顾
				</button>
			</view>
			<view class="button-item" @click="goToolPage('/pages/word/dictation/dictation')">
				<button class="action-button green">
					<text class="fas fa-headphones mr-1"></text> 听写
				</button>
			</view>
			<view class="button-item" @click="goToolPage('/pages/word/writefrommemory/writefrommemory')">
				<button class="action-button purple">
					<text class="fas fa-pen-fancy mr-1"></text> 默写
				</button>
			</view>
		</view>

		<view class="main-content">
			<view class="daily-card">
				<image class="card-bg" :src="sentence.image" mode="aspectFill"></image>
				<view class="card-mask"></view>
				<view class="card-content">
					<view class="card-header">
						<view class="tag">每日一句</view>
						<view class="date">{{ todayDate }}</view>
					</view>

					<view class="text-group">
						<view class="ja-text">{{sentence.ja}}</view>
						<view class="ch-text">{{sentence.ch}}</view>
					</view>

					<view class="card-footer">
						<text class="fas fa-quote-left quote-icon"></text>
						<text class="source-text">{{sentence.source}}</text>
					</view>
				</view>
			</view>

			<view class="feature-grid">
				<view class="feature-card word-card" @click="goPage('/pages/word/thesaurus/thesaurus',{title:'词库'})">
					<view class="feature-icon blue">
						<text class="fas fa-book-bookmark"></text>
					</view>
					<view class="feature-name">我的词库</view>
				</view>



				<view class="feature-card word-card" @click="goPage('/pages/tools/notes/notes')">
					<view class="feature-icon orange">
						<text class="fas fa-pen-to-square"></text>
					</view>
					<view class="feature-name">学习笔记</view>
				</view>

				<view class="feature-card word-card" @click="goPage('/pages/tools/commonwords/commonwords')">
					<view class="feature-icon green">
						<text class="fas fa-layer-group"></text>
					</view>
					<view class="feature-name">专项练习</view>
				</view>
				<view class="feature-card word-card" @click="goPage('/pages/tools/grammar/grammar')">
					<view class="feature-icon purple">
						<text class="fas fa-folder-open"></text>
					</view>
					<view class="feature-name">学习资料</view>
				</view>
			</view>

			<view class="ranking-header">
				<view class="ranking-title">学习达人榜</view>
			</view>
			<view class="ranking-list">
				<view v-for="(item,index) in ranks" :key="item.user.id" class="ranking-item">
					<view :class="{blue:index==0,purple:index==1,green:index==2,gray:index>2}" class="rank-number">
						{{index+1}}
					</view>
					<view class="user-info">
						<view class="username">{{item.user.nickname}}</view>
						<view class="user-stats">已学 {{item.sign_day}} 天</view>
					</view>
					<Avatar :size="70" :src="item.user.avatar"></Avatar>
				</view>
			</view>
		</view>
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed
	} from 'vue'
	import Avatar from "@/components/avatar/avatar.vue"
	import {
		goPage
	} from "@/utils/common.js"
	import {
		useToast,
		useMessage
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	import $http from "@/api/index.js"
	import {
		onLoad,
		onShow
	} from '@dcloudio/uni-app'
	import {
		userStore
	} from "@/stores/index.js"


	const navBarHeight = ref(0)
	const sentence = ref({})
	const ranks = ref([])
	const todayWordCount = ref(0)


	const todayDate = computed(() => {
		const date = new Date();
		const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		return `${date.getMonth() + 1}.${date.getDate()} ${days[date.getDay()]}`;
	});

	const getSentence = async () => {
		const res = await $http.common.getSentence()
		sentence.value = res.data
	}

	const goToolPage = (path) => {
		if (!userStore().loginStatus) {
			goPage("/pages/login/login?toast=请登录之后使用")
			return
		}
		if (todayWordCount.value == 0) {
			toast.warning("今天还没学单词哦~")
		} else {
			goPage(path)
		}
	}

	const getRanking = async () => {
		const res = await $http.user.ranking()
		ranks.value = res.data.slice(0, 10)
	}

	const getTodayWords = async () => {
		const res = await $http.word.getLearnt()
		todayWordCount.value = res.data.length
	}
	const initData = () => {
		const systemInfo = uni.getSystemInfoSync();
		const statusBarHeight = systemInfo.statusBarHeight;
		navBarHeight.value = statusBarHeight + 'px'
		getSentence()
		getRanking()
		getTodayWords()
	}
	onShow(() => {
		if (isLoaded.value) {
			initData()
		}
	})
	const isLoaded = ref(false)
	onMounted(() => {
		initData()
		isLoaded.value = true
	})
</script>

<style lang="scss">
	.logotext {
		display: flex;
		align-items: center;
		background-color: white;
		padding: 0 32rpx;
		gap: 16rpx;

		image {
			width: 80rpx;
			height: 80rpx;
		}

		.title {
			font-size: 32rpx;
			font-weight: bold;
		}

		.description {
			font-size: 20rpx;
		}
	}

	.action-buttons {
		padding: 24rpx 32rpx;
		background: white;
		display: flex;
		justify-content: space-between;

		.button-item {
			flex: 1;
			text-align: center;

			&:nth-child(2) {
				margin: 0 16rpx;
			}
		}

		.action-button {
			width: 100%;
			padding: 16rpx 0;
			border-radius: 16rpx;
			font-size: 28rpx;
			font-weight: 500;
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 16rpx;

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
		padding: 32rpx;
	}


	.daily-card {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: 32rpx;
		overflow: hidden;
		margin-bottom: 32rpx;
		background-color: #f0f0f0;

		.card-bg {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
		}

		.card-mask {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 2;

			background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.2) 40%, rgba(0, 0, 0, 0.7) 100%);
		}

		.card-content {
			position: relative;
			z-index: 3;
			height: 100%;
			padding: 24rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			box-sizing: border-box;
		}

		.card-header {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.tag {
				background: rgba(255, 255, 255, 0.25);
				backdrop-filter: blur(8rpx);
				padding: 8rpx 20rpx;
				border-radius: 40rpx;
				font-size: 20rpx;
				color: #fff;
				font-weight: bold;
				letter-spacing: 2rpx;
			}

			.date {
				font-size: 24rpx;
				color: rgba(255, 255, 255, 0.9);
				font-family: sans-serif;
				font-weight: 500;
			}
		}

		.text-group {
			margin-top: auto;
			margin-bottom: 16rpx;

			.ja-text {
				font-size: 36rpx;
				font-weight: bold;
				color: #fff;
				line-height: 1.5;
				margin-bottom: 12rpx;
				text-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.4);
			}

			.ch-text {
				font-size: 26rpx;
				color: rgba(255, 255, 255, 0.95);
				line-height: 1.4;
				text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.4);
			}
		}

		.card-footer {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			gap: 12rpx;

			.quote-icon {
				font-size: 20rpx;
				color: rgba(255, 255, 255, 0.7);
			}

			.source-text {
				font-size: 22rpx;
				color: rgba(255, 255, 255, 0.8);
				font-style: italic;
			}
		}
	}



	.feature-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 24rpx;
		margin-bottom: 24rpx;

		.feature-card {
			background: white;
			border-radius: 16rpx;
			padding: 32rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			.feature-icon {
				width: 96rpx;
				height: 96rpx;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 16rpx;
				font-size: 40rpx;

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
				font-size: 28rpx;
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
		margin-bottom: 16rpx;

		.ranking-title {
			font-size: 28rpx;
			font-weight: 500;
		}
	}

	.ranking-list {
		display: flex;
		flex-direction: column;
		gap: 16rpx;

		.ranking-item {
			background: white;
			border-radius: 16rpx;
			padding: 24rpx;
			display: flex;
			align-items: center;

			.rank-number {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: bold;
				margin-right: 24rpx;

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

				&.gray {
					background: #f3f4f6;
					color: #4b5563;
				}
			}

			.user-info {
				flex: 1;

				.username {
					font-size: 28rpx;
					font-weight: 500;
				}

				.user-stats {
					font-size: 24rpx;
					color: #666;
					margin-top: 4rpx;
				}
			}
		}
	}
</style>