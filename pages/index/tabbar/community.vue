<template>
	<Statusbar></Statusbar>
	<view class="search">
		<wd-icon name="search" size="22px" color="#979797"></wd-icon>
		<input placeholder="搜索" />
	</view>
	<view style="position: relative;">
		<view class="tabs">
			<view @click="currentTab=index" :class="{active:currentTab===index}" class="tab _GCENTER "
				v-for="(item,index) in tabList" :key="index">
				{{item.name}}
			</view>
		</view>
		<view class="list">
			<view class="item" v-for="_ in 6">
				<view class="head">
					<uv-avatar size="40" text="李"></uv-avatar>
					<view class="userinfo">
						<p>鸟山明</p>
						<p>一代宗师</p>
					</view>
					<view class="btn">
						<wd-button plain size="small">关注</wd-button>
					</view>
				</view>
				<view class="body">
					<p class="content">你好这是效力与湖人队杀鸡吉尼斯可能仓库的是你看但是此时马上离开地面来昆明产生了矛盾</p>
					<view class="images">
						<img v-for="_ in 3"
							src="https://cn.bing.com/th?id=OVFT.Cvt2C_Z807esEH0HcbNQNi&w=186&h=88&c=7&rs=2&qlt=80&pid=PopNow"></img>
					</view>
				</view>
				<view class="footer">
					<p class="left">2天前&nbsp;·&nbsp;日本</p>
					<view class="right">
						<wd-icon name="ellipsis" size="25px"></wd-icon>
					</view>
				</view>

			</view>
		</view>
	</view>
	
</template>

<script setup>
	import {
		ref,
		onMounted,
		getCurrentInstance
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import Statusbar from "@/components/statusbar.vue"
	const currentTab = ref(0)
	const tabList = ref([{
		name: "全部动态",
		id: 1
	}, {
		name: "求助问答",
		id: 1
	}, {
		name: "学习打卡",
		id: 1
	}, {
		name: "好物推荐",
		id: 1
	}])
	
	const instance = getCurrentInstance();
	const query = uni.createSelectorQuery().in(instance.proxy);
	const scroll = (e) => {
		query.select('.wd-sticky__container').boundingClientRect(rect => {
			console.log(rect.top);
		}).exec();
	}
</script>

<style lang="scss" scoped>
	// :deep(.space) {
	// 	padding: 3px 5px !important;
	// }



	// :deep(.wd-tabs) {
	// 	background: transparent !important;
	// }

	// :deep(.wd-tabs__nav) {
	// 	background-color: #F6F6F6;
	// }
	.tabs {
		position: sticky;
		top: 0;
		z-index: 1;
		background-color: #F6F6F6;
		display: grid;
		height: 45px;
		grid-template-columns: repeat(4, 1fr);

		.tab {
			font-size: $uni-font-size-base;
		}

		.active {
			font-weight: bold;
		}
	}

	.search {
		height: 45px;
		background: #EFEFEF;
		margin: 15px;
		padding: 10px;
		margin-bottom: 0;
		font-size: $uni-font-size-lg;
		box-sizing: border-box;
		border-radius: 45px;
		display: flex;
		align-items: center;

		input {
			width: 100%;
			margin-left: 10px;
		}
	}

	.list {
		padding-bottom: 10px;
		display: flex;
		flex-direction: column;
		gap: 15px;

		.item {
			margin: 0 15px;
			background-color: white;
			padding: 15px;
			border-radius: $uni-border-radius-base;

			.footer {
				margin-left: 50px;
				margin-top: 15px;
				justify-content: space-between;
				display: flex;
				align-items: center;

				.left {
					font-size: $uni-font-size-sm;
					color: $uni-text-color-grey;
				}
			}

			.body {
				margin-left: 50px;

				.images {
					display: grid;
					grid-template-columns: repeat(3, 1fr);
					gap: 10px;

					img {
						object-fit: cover;
						width: 100%;
						aspect-ratio: 1;
						border-radius: $uni-border-radius-base;
					}
				}

				.content {
					margin: 10px 0;
					font-size: $uni-font-size-base;
				}
			}

			.head {
				display: flex;
				align-items: center;
				gap: 10px;
				position: relative;

				.btn {
					position: absolute;
					right: 0;
				}

				.userinfo {
					p {
						&:nth-of-type(1) {
							font-size: $uni-font-size-lg;
						}

						&:nth-of-type(2) {
							font-size: $uni-font-size-sm;
							color: $uni-text-color-grey;
						}
					}
				}
			}
		}
	}
</style>