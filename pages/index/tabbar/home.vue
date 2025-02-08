<template>
	<view>
		<view style="background-color: white;padding-top: 15px;">
			<view @click="goPage('search')" class="search">
				<wd-icon name="search" size="22px" color="#979797"></wd-icon>
				<p>搜索</p>
			</view>
			<view class="day">
				你已经坚持了<span>{{info.day}}天</span><span>加油！！！</span>
			</view>
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
			<view class="maintool">
				<view @click="goPage('aitranslate')">
					<p>AI翻译</p>
					<p>精准专业翻译</p>
				</view>
				<view @click="goPage('translate')">
					<p>标准翻译</p>
					<p>快速翻译语言</p>
				</view>
			</view>
			<view class="scroll-list">
				<view @click="goPage(item.path)" class="scroll-list__item" v-for="(item, index) in toolList"
					:key="index">
					<image class="scroll-list__item__image" :src="item.image"></image>
					<p class="scroll-list__item__text">{{ item.name }}</p>
				</view>
			</view>
		</view>

		<view class="articlelist">
			<view class="articleitem" @click="goPage('articledetail','?id='+item.id)" :key="item.id"
				v-for="item in articleList">
				<view class="head">
					<view class="user">
						<uv-avatar size="25" :src="item.user.avatar"></uv-avatar>
						<p>{{item.user.nickname}}</p>
					</view>
					<wd-icon name="ellipsis" size="20px"></wd-icon>
				</view>
				<view class="content">
					<view>
						<wd-text :lines="1" :text="item.title" color="#000000" bold></wd-text>
						<wd-text :lines="3" :text="item.encapsulate" size="14px" style="margin-top: 3px;"></wd-text>
					</view>
					<image :src="item.icon" mode="aspectFill"></image>
				</view>
				<view class="footer">
					<p>
						{{item.browse}}阅读
						<!-- &nbsp;·&nbsp;4点赞&nbsp;·&nbsp;6收藏 -->
					</p>
					<p>
						{{dayjs().to(dayjs(item.created_at))}}
					</p>
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
	const toolList = ref([{
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
	}, {
		name: '常用词汇',
		image: '../../static/duo-icons--message-3.png',
		path: "commonwords"
	}])
</script>

<style lang="scss" scoped>
	.review {
		color: #4D80F0 !important;
	}


	.articlelist {
		background-color: #f5f5f5;
		padding: 15px 0;
		display: flex;
		flex-direction: column;
		gap: 15px;

		.articleitem {
			padding: 15px;
			background-color: white;


			.footer {
				margin-top: 10px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				color: $uni-text-color-grey;
				font-size: $uni-font-size-sm;
			}

			.content {
				display: flex;
				justify-content: space-between;
				margin-top: 5px;
				gap: 10px;

				view {
					flex: 1;
					display: flex;
					flex-direction: column;
				}

				image {
					border-radius: 4px;
					width: 120px;
					height: 80px;
				}
			}

			.head {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.user {
					display: flex;
					align-items: center;

					p {
						font-size: $uni-font-size-base;
						margin-left: 8px;
					}
				}
			}
		}
	}



	.scroll-list {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 10px;
		margin: 0 5px;

		&__item {
			height: 80px;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			background-color: white;
			border-radius: $uni-border-radius-base;


			&__image {
				width: 40px;
				height: 40px;
			}

			&__text {
				color: $uni-text-color-grey;
				text-align: center;
				font-size: $uni-font-size-sm;
				margin-top: 5px;
			}
		}

	}

	.maintool {
		display: flex;
		align-items: center;
		margin: 15px;
		gap: 15px;

		>view {
			border-radius: $uni-border-radius-base;
			flex: 1;
			padding: 15px;
			background-size: 60%;
			background-position: center right;
			background-repeat: no-repeat;
			background-color: white;
			color: white;


			p {
				&:nth-of-type(1) {
					font-size: $uni-font-size-lg;
					font-weight: bold;
				}

				&:nth-of-type(2) {
					margin-top: 3px;
					font-size: $uni-font-size-sm;
				}
			}

			&:nth-of-type(1) {
				background: linear-gradient(135deg, #fa4350, #ffa39e);
				// background-image: url('@/static/ai.png');
			}

			&:nth-of-type(2) {
				background: linear-gradient(135deg, #4D80F0, #B0C4DE);
				// background-image: url('@/static/yufa.png');
			}
		}
	}

	.day {
		margin: 10px 15px 15px 15px;
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

	:deep(.wd-progress__outer) {
		height: 10px !important;
		border-radius: 10px !important;
		overflow: hidden;
	}

	.search {
		height: 45px;
		background: #f5f5f5;
		margin: 0 15px;
		padding: 10px;
		font-size: $uni-font-size-lg;
		box-sizing: border-box;
		border-radius: 45px;
		display: flex;
		align-items: center;

		p {
			color: #979797;
			margin-left: 10px;
		}
	}

	.recite {
		padding: 15px;
		margin: 15px;
		border-radius: $uni-border-radius-base;
		background-color: white;
		box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

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
</style>