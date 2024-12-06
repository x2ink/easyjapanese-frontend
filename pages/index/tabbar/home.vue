<template>
	<view>
		<Statusbar></Statusbar>
		<view @click="goPage('search')" class="search">
			<wd-icon name="search" size="22px" color="#979797"></wd-icon>
			<p>搜索</p>
		</view>
		<view class="day">
			你已经坚持了<span>99天</span><span>加油！！！</span>
		</view>
		<view class="recite">
			<view class="plan">
				<p>大学日语四级</p>
				<view>
					<p @click="openPlan">
						修改计划
					</p>
					<wd-icon name="arrow-right" size="19px"></wd-icon>
				</view>
			</view>
			<view class="task">
				<view @click="goPage('wordlist')">
					<p>等待复习</p>
					<p>100</p>
				</view>
				<view @click="goPage('wordlist')">
					<p>今日未学</p>
					<p>10</p>
				</view>
			</view>
			<wd-progress :percentage="30" hide-text />
			<view class="progress">
				<p><span>50</span>/<span>100</span></p>
				<wd-button @click="goPage('thesaurus')" plain size="small">词汇列表</wd-button>
			</view>
			<view class="btns">
				<wd-button custom-class="review" size="large" type="info" style="width: 100%;">记忆复习</wd-button>
				<wd-button @click="goPage('learn')" size="large" style="width: 100%;">开始学习</wd-button>
			</view>
		</view>
		<view class="maintool">
			<view>
				<p>AI翻译</p>
				<p>精准专业翻译</p>
			</view>
			<view>
				<p>词库大全</p>
				<p>收录词条过万</p>
			</view>
		</view>
		<uv-scroll-list>
			<view class="scroll-list" style="flex-direction: row;">
				<view class="scroll-list__item" v-for="(item, index) in toolList" :key="index">
					<image class="scroll-list__item__image" :src="item.image"></image>
					<p class="scroll-list__item__text">{{ item.name }}</p>
				</view>
			</view>
		</uv-scroll-list>
		<view class="articlelist">
			<view class="articleitem" v-for="_ in 10">
				<view class="head">
					<view class="user">
						<uv-avatar size="25" text="李"></uv-avatar>
						<p>短句系统开发</p>
					</view>
					<wd-icon name="ellipsis" size="20px"></wd-icon>
				</view>
				<view class="content">
					<view>
						<p>这是文章标题</p>
						<p>这是文章内容</p>
					</view>
					<image
						src="https://ts3.cn.mm.bing.net/th?id=ORMS.067a87acd446bd8b04920fc4c07bf930&pid=Wdp&w=268&h=140&qlt=90&c=1&rs=1&dpr=1.25&p=0"
						mode="aspectFill"></image>
				</view>
				<view class="footer">
					<p>
						525阅读&nbsp;·&nbsp;4点赞&nbsp;·&nbsp;6收藏
					</p>
					<p>
						刚刚
					</p>
				</view>
			</view>
		</view>
		<!-- 修改计划 -->
		<Setplan ref="setPlanRef"></Setplan>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import Statusbar from "@/components/statusbar.vue"
	import Setplan from "@/components/setplan.vue"
	const goPage = (path) => {
		uni.navigateTo({
			url: `/pages/${path}/${path}`
		})
	}
	const setPlanRef = ref(null)
	const openPlan = () => {
		setPlanRef.value.show = true
	}
	const toolList = ref([{
		name: '动词变形',
		image: '../../static/duo-icons--palette.png'
	}, {
		name: '考试宝典',
		image: '../../static/duo-icons--book-2.png'
	}, {
		name: '口语练习',
		image: '../../static/duo-icons--user.png'
	}, {
		name: '听力突破',
		image: '../../static/duo-icons--disk.png'
	}, {
		name: '情景对话',
		image: '../../static/duo-icons--message-3.png'
	}, {
		name: '漫画日语',
		image: '../../static/duo-icons--book.png'
	}, {
		name: '免费动漫',
		image: '../../static/duo-icons--clapperboard.png'
	}])
</script>

<style lang="scss" scoped>
	.review {
		color: #4D80F0 !important;
	}

	::-webkit-scrollbar {
		display: none !important;
	}


	.articlelist {
		margin-top: 5px;
		padding-bottom: 15px;
		display: flex;
		flex-direction: column;
		gap: 15px;

		.articleitem {
			padding: 15px;
			background-color: white;
			margin: 0 15px;
			border-radius: $uni-border-radius-base;


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

				view {
					p {
						&:nth-of-type(1) {
							font-size: $uni-font-size-lg;
							font-weight: bold;
						}

						&:nth-of-type(2) {
							font-size: $uni-font-size-base;
							color: $uni-text-color-grey;
							margin-top: 5px;
						}
					}
				}

				image {
					border-radius: $uni-border-radius-base;
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
		display: flex;
		gap: 10px;

		&__item {
			width: 70px;
			height: 70px;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			background-color: white;
			border-radius: $uni-border-radius-base;

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
		margin: 0 15px;
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
		background: #EFEFEF;
		margin: 15px;
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
		border-radius: $uni-border-radius-base;
		background-color: white;
		margin: 15px;
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