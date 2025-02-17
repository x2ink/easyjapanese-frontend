<template>
	<view>
		<!-- 顶部区域 -->
		<view class="head">
			<view class="day">
				你已坚持<span>{{info.day}}天</span>加油！
			</view>
			<view @click="goPage('search')" class="search">
				<wd-icon name="search" size="18px" color="#979797"></wd-icon>
				<p>搜索单词或语法</p>
			</view>
		</view>
		<!-- 统计 -->
		<view class="recite">
			<view class="plan">
				<p>{{info.bookname}}</p>
				<view>
					<p @click="openPlan">
						修改计划
					</p>
					<wd-icon name="arrow-right" size="19px"></wd-icon>
				</view>
			</view>
			<view class="task">
				<view @click="goPage('todayreview')">
					<p>等待复习</p>
					<p>{{info.review}}</p>
				</view>
				<view @click="goPage('todaylearn')">
					<p>今日学习</p>
					<p>{{info.learn}}</p>
				</view>
			</view>
			<wd-progress :percentage="progress" hide-text />
			<view class="progress">
				<p><span>{{info.learnnum}}</span>/<span>{{info.wordnum}}</span></p>
				<wd-button @click="goPage('thesaurus')" plain size="small">词汇列表</wd-button>
			</view>
			<view class="btns">
				<wd-button @click="review()" custom-class="review" size="large" type="info"
					style="width: 100%;">记忆复习</wd-button>
				<wd-button @click="startLearn()" size="large" style="width: 100%;">开始学习</wd-button>
			</view>
		</view>
		<!-- 翻译 -->
		<!-- 	<view class="maintool">
			<view @click="goPage('aitranslate')">
				<p>AI翻译</p>
				<p>精准专业翻译</p>
				<image src="/static/duo-icons--android.png" mode="aspectFit"></image>
			</view>
			<view @click="goPage('translate')">
				<p>标准翻译</p>
				<p>快速翻译语言</p>
				<image src="/static/duo-icons--g-translate.png" mode="aspectFit"></image>
			</view>
		</view> -->
		<!-- 其他工具 -->
		<uv-scroll-list style="background-color: white;border-radius: 8px;margin: 10px;">
			<view class="scroll-list" style="flex-direction: row;">
				<view class="scroll-list__item" v-for="(item, index) in toolList" :key="index">
					<image class="scroll-list__item__image" :src="item.image"></image>
					<p class="scroll-list__item__text">{{ item.name }}</p>
				</view>
			</view>
		</uv-scroll-list>
		<!-- 推荐单词 -->
		<view class="smalltitle">
			<text>单词推荐</text>
			<view @click="getRecommend()">
				<text>换一批</text>
				<wd-icon name="refresh1" color="#999" size="16px"></wd-icon>
			</view>
		</view>
		<!-- 单词列表 -->
		<view class="wordlist">
			<view class="worditem" @click="goPage('worddetail','?id=' + item.id + '&type=jc')" :key="item.id"
				v-for="item in recommendWord">
				<view class="wordhead">
					<text>{{item.word}}</text>
					<wd-tag v-for="tag in item.level" custom-class="tag" color="#0083ff"
						bg-color="#d0e8ff">{{tag}}</wd-tag>
				</view>
				<view class="explain">
					<wd-text size="14px" :lines="2" color="#999" :text="item.meaning.join(';')"></wd-text>
				</view>
				<view class="wordfooter">
					<view>
						<wd-icon name="browse" color="#999" size="18px"></wd-icon>
						<text>{{item.browse}}</text>
					</view>
					<view>
						<text>查看详情</text>
						<wd-icon name="arrow-right" color="#999" size="16px"></wd-icon>
					</view>
				</view>
			</view>
		</view>
		<!-- 修改计划 -->
		<Setplan ref="setPlanRef"></Setplan>
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed
	} from 'vue'
	import {
		onLoad,
		onReachBottom,
		onShow
	} from '@dcloudio/uni-app'
	import dayjs from 'dayjs'
	import relativeTime from 'dayjs/plugin/relativeTime'
	import 'dayjs/locale/zh'
	dayjs.locale('zh')
	dayjs.extend(relativeTime)
	import Statusbar from "@/components/statusbar.vue"
	import Setplan from "@/components/setplan.vue"
	import $http from "@/api/index.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const review = () => {
		if (info.value.review == 0) {
			toast.warning(`今日没有需要复习的单词`)
		} else {
			goPage('review')
		}
	}

	const articleList = ref([])
	const articleTotal = ref(0)
	const articleParams = ref({
		page: 1,
		size: 10
	})
	onReachBottom(() => {
		if (articleTotal.value > articleList.value.length) {
			++articleParams.value.page
			getArticleLis()
		}
	})
	const getArticleList = async () => {
		const res = await $http.article.getList(articleParams.value.page, articleParams.value.size)
		articleList.value = articleList.value.concat(res.data)
		articleTotal.value = res.total
	}
	const toast = useToast()
	const progress = computed(() => {
		if (info.value.learnnum) {
			return (info.value.learnnum / info.value.wordnum) * 100
		} else {
			return 0
		}
	})

	const info = ref({
		bookname: "",
		day: 0,
		learn: 0,
		learnnum: 0,
		review: 0,
		wordnum: 0
	})
	onMounted(() => {
		getArticleList()
		getRecommend()
	})
	const getHomeInfo = async () => {
		const res = await $http.word.getHomeInfo()
		info.value = res.data
	}
	onShow(() => {
		getHomeInfo()
	})
	const startLearn = () => {
		if (setPlanRef.value.config.mode == "学习模式") {
			goPage('learn')
		} else {
			goPage('fastmode')
		}
	}
	const goPage = (path, params) => {
		if (params) {
			uni.navigateTo({
				url: `/pages/${path}/${path}${params}`
			})
		} else {
			uni.navigateTo({
				url: `/pages/${path}/${path}`
			})
		}
	}
	const setPlanRef = ref(null)
	const openPlan = () => {
		setPlanRef.value.show = true
	}
	const recommendWord = ref([])
	const getRecommend = async () => {
		const res = await $http.word.getRecommend()
		recommendWord.value = res.data
	}
	const toolList = ref([{
		name: '文本翻译',
		image: '../../static/duo-icons--g-translate.png',
		path: "commonwords"
	}, {
		name: '语法学习',
		image: '../../static/duo-icons--book.png',
		path: 'grammar'
	}, {
		name: '五十音图',
		image: '../../static/duo-icons--dashboard.png',
		path: 'fiftysounds'
	}, {
		name: '动词变形',
		image: '../../static/duo-icons--palette.png',
		path: "verbtransfiguration"
	}, {
		name: '日语电台',
		image: '../../static/duo-icons--disk.png',
		path: 'radiostation'
	}])
</script>

<style lang="scss" scoped>
	:deep(.uv-scroll-list__indicator) {
		margin-top: 0;
	}

	.head {
		padding: 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.search {
			height: 40px;
			background: #fff;
			padding: 5px 15px;
			font-size: $uni-font-size-lg;
			box-sizing: border-box;
			border-radius: 40px;
			display: flex;
			align-items: center;

			p {
				font-size: 14px;
				color: #979797;
				margin-left: 5px;
			}
		}

		.day {
			color: $uni-text-color-grey;

			span {
				&:nth-of-type(1) {
					font-size: 25px;
					margin-left: 3px;
					margin-right: 8px;
					font-weight: bold;
					font-style: italic;
					color: $uni-color-success;
				}
			}
		}
	}

	.recite {
		padding: 15px;
		margin: 0 10px 10px 10px;
		border-radius: 8px;
		background-color: white;

		.plan {
			font-size: $uni-font-size-base;
			display: flex;
			align-items: center;
			justify-content: space-between;

			>p {
				font-weight: bold;
			}

			view {
				display: flex;
				align-items: center;
			}
		}

		.task {
			display: flex;
			align-items: center;
			justify-content: space-around;
			margin-top: 15px;

			view {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				p {
					&:nth-of-type(1) {
						color: $uni-text-color-grey;
						font-size: $uni-font-size-sm;
					}

					&:nth-of-type(2) {
						font-size: 30px;
						font-weight: bold;
					}
				}
			}
		}

		.progress {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 10px 0;

			p {
				color: $uni-text-color-grey;
				font-size: $uni-font-size-base;
			}

			.wd-button {
				margin: 0;
			}
		}

		.btns {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 15px;
		}
	}

	.scroll-list {
		display: flex;
		gap: 10px;
		margin-top: 10px;

		&__item {
			width: 70px;
			height: 70px;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;

			&:first-child {
				margin-left: 10px;
			}

			&:last-child {
				margin-right: 10px;
			}

			&__image {
				width: 30px;
				height: 30px;
			}

			&__text {
				color: $uni-text-color-grey;
				text-align: center;
				font-size: $uni-font-size-sm;
				margin-top: 5px;
			}
		}

	}








	.review {
		color: #4D80F0 !important;
	}







	.maintool {
		display: flex;
		align-items: center;
		margin: 10px;
		gap: 15px;

		>view {
			position: relative;
			border-radius: $uni-border-radius-base;
			flex: 1;
			padding: 15px;
			background-size: 60%;
			background-position: center right;
			background-repeat: no-repeat;
			background-color: white;

			image {
				position: absolute;
				right: 15px;
				top: 50%;
				transform: translateY(-50%);
				width: 50px;
				height: 50px;
			}

			p {
				&:nth-of-type(1) {
					font-size: $uni-font-size-lg;
					// font-weight: bold;
				}

				&:nth-of-type(2) {
					margin-top: 3px;
					color: #999;
					font-size: $uni-font-size-sm;
				}
			}

			&:nth-of-type(1) {
				// background: linear-gradient(135deg, #fa4350, #ffa39e);
				// background-image: url('@/static/ai.png');
			}

			&:nth-of-type(2) {
				// background: linear-gradient(135deg, #4D80F0, #B0C4DE);
				// background-image: url('@/static/yufa.png');
			}
		}
	}


	.smalltitle {
		margin: 10px 10px 0 10px;
		display: flex;
		justify-content: space-between;
		align-items: center;

		>view {
			display: flex;
			align-items: center;
			gap: 5px;
			font-size: 12px;
			color: #999;
		}
	}

	:deep(.wd-progress__outer) {
		height: 10px !important;
		border-radius: 10px !important;
		overflow: hidden;
	}

	:deep(.tag) {
		padding: 2px 8px;
		border-radius: 4px;
	}

	.wordlist {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 10px;

		.worditem {
			border-radius: 8px;
			padding: 10px;
			background-color: white;

			.wordfooter {
				display: flex;
				align-items: center;
				justify-content: space-between;

				>view {
					gap: 2px;
					display: flex;
					align-items: center;

					text {
						font-size: 12px;
						color: #999;
					}
				}
			}

			.explain {
				font-size: 14px;
				margin: 10px 0;
			}

			.wordhead {
				display: flex;
				align-items: center;
				justify-content: space-between;

				text {
					font-size: 16px;
					font-weight: bold;
				}
			}
		}
	}
</style>