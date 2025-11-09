<template>
	<view>
		<view class="logotext" :style="{paddingTop:`calc(${navBarHeight} + 16px)!important`}">
			<image src="https://jpx2ink.oss-cn-shanghai.aliyuncs.com/images/logo.png" mode="aspectFit"></image>
			<view>
				<view class="title">轻松日语</view>
				<view class="description">自由的日语单词学习助手</view>
			</view>
		</view>
		<!-- 功能入口 -->
		<div class="action-buttons">
			<div class="button-item" @click="goToolPage('/pages/word/review/review')">
				<button class="action-button blue">
					<i class="fas fa-history mr-1"></i> 回顾
				</button>
			</div>
			<div class="button-item" @click="goToolPage('/pages/word/dictation/dictation')">
				<button class="action-button green">
					<i class="fa-solid fa-headphones mr-1"></i> 听写
				</button>
			</div>
			<div class="button-item" @click="goToolPage('/pages/word/writefrommemory/writefrommemory')">
				<button class="action-button purple">
					<i class="fas fa-pen-fancy mr-1"></i> 默写
				</button>
			</div>
		</div>
		<div class="main-content">
			<div class="daily-proverb">
				<div class="quote-mark">「</div>
				<div class="proverb-content">
					<div class="proverb-text">{{sentence.ja}}</div>
					<div class="proverb-translation">{{sentence.ch}}</div>
					<div class="proverb-source">— {{sentence.source}}</div>
				</div>
			</div>
			<div class="feature-grid">
				<div class="feature-card word-card" @click="goPage('/pages/word/thesaurus/thesaurus',{title:'词库'})">
					<div class="feature-icon blue">
						<i class="fas fa-book"></i>
					</div>
					<div class="feature-name">我的词库</div>
				</div>
				<div class="feature-card word-card" @click="goPage('/pages/tools/grammar/grammar')">
					<div class="feature-icon purple">
						<i class="fas fa-book-open"></i>
					</div>
					<div class="feature-name">语法学习</div>
				</div>
				<div class="feature-card word-card" @click="goPage('/pages/tools/notes/notes')">
					<div class="feature-icon orange">
						<i class="fas fa-sticky-note"></i>
					</div>
					<div class="feature-name">学习笔记</div>
				</div>
				<div class="feature-card word-card" @click="goPage('/pages/tools/commonwords/commonwords')">
					<div class="feature-icon green">
						<i class="fas fa-comment-dots"></i>
					</div>
					<div class="feature-name">日常会话</div>
				</div>
			</div>
			<div class="ranking-header">
				<div class="ranking-title">单词达人榜</div>
			</div>
			<div class="ranking-list">
				<div v-for="(item,index) in ranks" :key="item.user.id" class="ranking-item">
					<div :class="{blue:index==0,purple:index==1,green:index==2,gray:index>2}" class="rank-number">
						{{index+1}}
					</div>
					<div class="user-info">
						<div class="username">{{item.user.nickname}}</div>
						<div class="user-stats">已背 {{item.word_count}} 个单词</div>
					</div>
					<uv-avatar size="35" :src="item.user.avatar"></uv-avatar>
				</div>
			</div>
		</div>
		<wd-toast />
	</view>
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
	const sentence = ref({})
	const getSentence = async () => {
		const res = await $http.common.getSentence()
		sentence.value = res.data
	}
	const ranks = ref([])
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
	const todayWordCount = ref(0)
	const getTodayWords = async () => {
		const res = await $http.word.getLearnt()
		todayWordCount.value = res.data.length
	}
	onShow(() => {
		getTodayWords()
	})
	onMounted(() => {
		const systemInfo = uni.getSystemInfoSync();
		const statusBarHeight = systemInfo.statusBarHeight;
		navBarHeight.value = statusBarHeight + 'px'
		getSentence()
		getRanking()
	})
</script>

<style lang="scss">
	.logotext {
		display: flex;
		align-items: center;
		background-color: white;
		padding: 0 16px;
		gap: 8px;

		image {
			width: 40px;
			height: 40px;
		}

		.title {
			font-size: 16px;
			font-weight: bold;
		}

		.description {
			font-size: 10px;
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
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 8px;

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

				&.gray {
					background: #f3f4f6;
					color: #4b5563;
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