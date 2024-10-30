<template>
	<view>
		<view class="search">
			<wd-icon name="search" size="22px" color="#979797"></wd-icon>
			<input placeholder="搜索" />
		</view>
		<view class="day">
			你已经坚持了<span>99天</span><span>加油！！！</span>
		</view>
		<view class="recite">
			<view class="plan">
				<p>大学日语四级</p>
				<view>
					<p>
						修改计划
					</p>
					<wd-icon name="arrow-right" size="19px"></wd-icon>
				</view>
			</view>
			<view class="task">
				<view>
					<p>等待复习</p>
					<p>100</p>
				</view>
				<view>
					<p>等待复习</p>
					<p>100</p>
				</view>
			</view>
			<wd-progress :percentage="30" hide-text />
			<view class="progress">
				<p><span>50</span>/<span>100</span></p>
				<wd-button plain size="small">词汇列表</wd-button>
			</view>
			<view class="btns">
				<wd-button type="info">记忆复习</wd-button>
				<wd-button>开始学习</wd-button>
			</view>
		</view>
		<view class="maintool">
			<view>
				<p>AI问答</p>
				<p>更精准更专业</p>
			</view>
			<view>
				<p>语法学习</p>
				<p>更精准更专业</p>
			</view>
		</view>
		<uv-scroll-list @right="right" @left="left">
			<view class="scroll-list" style="flex-direction: row;">
				<view class="scroll-list__goods-item" v-for="(item, index) in list" :key="index"
					:class="[(index === 9) && 'scroll-list__goods-item--no-margin-right']">
					<image class="scroll-list__goods-item__image" :src="item.image"></image>
					<text class="scroll-list__goods-item__text">￥{{ item.price }}</text>
				</view>
				<view class="scroll-list__show-more">
					<text class="scroll-list__show-more__text">查看更多</text>
				</view>
			</view>
		</uv-scroll-list>
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
	const searchVal = ref('')
	const search = (e) => {
		console.log(e);
	}
	const list = ref([{
		price: '230.5',
		image: 'https://via.placeholder.com/60x60.png/3c9cff/fff'
	}, {
		price: '74.1',
		image: 'https://via.placeholder.com/60x60.png/f9ae3d/fff'
	}, {
		price: '8457',
		image: 'https://via.placeholder.com/60x60.png/5ac725/fff'
	}, {
		price: '1442',
		image: 'https://via.placeholder.com/60x60.png/f56c6c/fff'
	}, {
		price: '541',
		image: 'https://via.placeholder.com/60x60.png/909399/fff'
	}, {
		price: '234',
		image: 'https://via.placeholder.com/60x60.png/3c9cff/fff'
	}, {
		price: '562',
		image: 'https://via.placeholder.com/60x60.png/f9ae3d/fff'
	}, {
		price: '251.5',
		image: 'https://via.placeholder.com/60x60.png/5ac725/fff'
	}])
</script>

<style lang="scss">
	@mixin flex($direction: row) {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: $direction;
	}

	.scroll-list {
		@include flex(column);

		&__goods-item {
			margin-right: 20px;

			&__image {
				width: 60px;
				height: 60px;
				border-radius: 4px;
			}

			&__text {
				color: #f56c6c;
				text-align: center;
				font-size: 12px;
				margin-top: 5px;
			}
		}

		&__show-more {
			background-color: #fff0f0;
			border-radius: 3px;
			padding: 3px 6px;
			@include flex(column);
			align-items: center;

			&__text {
				font-size: 12px;
				width: 12px;
				color: #f56c6c;
				line-height: 16px;
			}
		}
	}

	.maintool {
		display: flex;
		align-items: center;
		margin: 15px;
		gap: 15px;

		>view {
			border-radius: $uni-border-radius-lg;
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
		background: white;
		margin: 15px;
		padding: 10px;
		font-size: $uni-font-size-lg;
		box-sizing: border-box;
		border-radius: 45px;
		display: flex;
		align-items: center;

		input {
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
		}
	}
</style>