<template>
	<view>
		<view :style="{height:navBarHeight}"></view>
		<view class="persistday">
			你已坚持<text>{{info.day}}天</text>加油！
		</view>
		<view @click="goPage('/pages/word/search/search')" class="search">
			<wd-icon name="search" size="18px" color="#979797"></wd-icon>
			<text>搜索单词或语法</text>
		</view>
		<view class="recite">
			<view class="plan">
				<text>{{info.bookname}}</text>
				<view>
					<text @click="goPage('/otherpages/setplan/setplan')">
						修改计划
					</text>
					<wd-icon name="arrow-right" size="19px"></wd-icon>
				</view>
			</view>
			<view class="task">
				<view @click="goPage('/pages/word/lookwords/lookwords',{type:'review',title:'等待复习'})">
					<text>等待复习</text>
					<text>{{info.review}}</text>
				</view>
				<view @click="goPage('/pages/word/lookwords/lookwords',{type:'new',title:'今日目标'})">
					<text>今日目标</text>
					<text>{{info.learn}}</text>
				</view>
			</view>
			<wd-progress custom-class="customprogress" :percentage="progress" hide-text />
			<view class="progress">
				<view><text>{{info.learnnum}}</text>/<text>{{info.wordnum}}</text></view>
				<wd-button plain size="small">词汇列表</wd-button>
			</view>
			<view class="btns">
				<wd-button @click="review()" size="large" custom-class="reviewbtn recitebtn"
					type="info">记忆复习</wd-button>
				<wd-button custom-class="recitebtn" size="large" @click="startLearn()">开始学习</wd-button>
			</view>
		</view>
		<view class="tools">
			<uv-scroll-list>
				<view class="scroll-list" style="flex-direction: row;">
					<view @click="goPage(item.path)" class="scroll-list__item" v-for="(item, index) in toolList"
						:key="index">
						<image class="scroll-list__item__image" :src="item.image"></image>
						<p class="scroll-list__item__text">{{ item.name }}</p>
					</view>
				</view>
			</uv-scroll-list>
		</view>
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
			<view class="worditem" @click="goPage('/pages/word/worddetail/worddetail',{id:item.id,type:'jc'})"
				:key="item.id" v-for="item in recommendWord">
				<view class="wordhead">
					<text>{{formatWordName(item.word,item.kana)}}</text>
					<view style="display: flex;align-items: center;gap: 3px;">
						<wd-tag v-for="tag in item.book" :key="tag" custom-class="space"
							:color="tagColor.get(tag).color" :bg-color="tagColor.get(tag).bgcolor">{{tag}}</wd-tag>
					</view>
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
	import $http from "@/api/index.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	import {
		goPage,
		tagColor,
		formatWordName
	} from "@/utils/common.js"
	const review = () => {
		if (info.value.review == 0) {
			toast.warning(`今日没有需要复习的单词`)
		} else {
			goPage('review')
		}
	}
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
	const navBarHeight = ref(0)
	onMounted(() => {
		const systemInfo = wx.getSystemInfoSync();
		const statusBarHeight = systemInfo.statusBarHeight;
		navBarHeight.value = statusBarHeight + 'px'
		getRecommend()
	})
	const getHomeInfo = async () => {
		const res = await $http.word.getHomeInfo()
		info.value = res.data
	}
	onShow(() => {
		getHomeInfo()
		getConfig()
	})
	const getConfig = async () => {
		const res = await $http.user.getConfig()
		config.value = res.data
	}
	const config = ref({
		mode: ""
	})
	const startLearn = () => {
		if (config.value.mode == "学习模式") {
			goPage('/pages/word/learn/learn')
		} else {
			goPage('fastmode')
		}
	}
	const recommendWord = ref([])
	const getRecommend = async () => {
		const res = await $http.word.getRecommend()
		recommendWord.value = res.data
	}
	const toolList = ref([{
		name: '文本翻译',
		image: 'http://jp.x2.ink/images/duo-icons--g-translate.png',
		path: "/pages/tools/translate/translate"
	}, {
		name: '语法学习',
		image: 'http://jp.x2.ink/images/duo-icons--book.png',
		path: "/pages/tools/grammar/grammar"
	}, {
		name: '五十音图',
		image: 'http://jp.x2.ink/images/duo-icons--dashboard.png',
		path: '/pages/tools/fiftysounds/fiftysounds'
	}, {
		name: '动词变形',
		image: 'http://jp.x2.ink/images/duo-icons--palette.png',
		path: "/pages/tools/verbtransfiguration/verbtransfiguration"
	}, {
		name: '日常会话',
		image: 'http://jp.x2.ink/images/message.png',
		path: "/pages/tools/commonwords/commonwords"
	}, {
		name: '写作真题',
		image: 'http://jp.x2.ink/images/duo-icons--file.png',
		path: "/pages/tools/composition/composition"
	}])
</script>

<style lang="scss" scoped>
	:deep(.uv-scroll-list__indicator) {
		margin-top: 0;
	}



	.persistday {
		color: $uni-text-color-grey;
		height: 45px;
		display: flex;
		align-items: center;
		padding: 0 15px;

		text {
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

	.search {
		height: 40px;
		background: #fff;
		padding: 5px 15px;
		margin: 0 15px 15px 15px;
		font-size: $uni-font-size-lg;
		box-sizing: border-box;
		border-radius: 40px;
		display: flex;
		align-items: center;

		text {
			font-size: 14px;
			color: #979797;
			margin-left: 5px;
		}
	}

	.tools {
		margin-top: 20px;

		.scroll-list {
			display: flex;
			gap: 10px;

			&__item {
				width: 70px;
				height: 70px;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;

				&:first-child {
					margin-left: 15px;
				}

				&:last-child {
					margin-right: 15px;
				}

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
	}




	.recite {
		padding: 15px;
		margin: 0 15px 15px 15px;
		border-radius: 8px;
		background-color: white;

		.plan {
			font-size: $uni-font-size-base;
			display: flex;
			align-items: center;
			justify-content: space-between;

			>text {
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

				text {
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

			>view {
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



	.smalltitle {
		margin: 0 15px;
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

	:deep(.space) {
		margin-left: 10px;
		padding: 2px 8px;
		border-radius: 4px;
	}


	.wordlist {
		display: flex;
		flex-direction: column;
		gap: 15px;
		padding: 15px;

		.worditem {
			border-radius: 8px;
			padding: 15px;
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