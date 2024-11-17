<template>
	<Statusbar></Statusbar>
	<scroll-view @scroll="scroll" scroll-y="true" style="height: 100vh;">
		<view class="search">
			<wd-icon name="search" size="22px" color="#979797"></wd-icon>
			<input placeholder="搜索" />
		</view>
		<wd-tabs v-model="currentTab" sticky :slidable-num="4" :offset-top="-45">
			<block v-for="(item,index) in tabList" :key="index">
				<wd-tab :title="item.name">
					<view class="list">
						<view class="item" v-for="_ in 6">
							<view class="head">
								<uv-avatar size="40" text="李"></uv-avatar>
								<view class="userinfo">
									<p>鸟山明</p>
									<p>2天前&nbsp;·&nbsp;日本</p>
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
								<view class="left">
									<view>
										<wd-icon name="thumb-up" size="18px"></wd-icon>
										<p>100</p>
									</view>
									<view>
										<wd-icon name="chat1" size="18px"></wd-icon>
										<p>100</p>
									</view>
								</view>
								<view class="right">
									<wd-icon name="ellipsis" size="25px"></wd-icon>
								</view>
							</view>
							<view class="tags">
								<wd-tag custom-class="space" plain use-icon-slot>
									<text>学习交流</text>
									<template #icon>
										<text style="font-weight: bold;">#</text>
									</template>
								</wd-tag>
							</view>
						</view>
					</view>
				</wd-tab>
			</block>
		</wd-tabs>
	</scroll-view>
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
		name: "全部",
		id: 1
	}, {
		name: "求助问答",
		id: 1
	}, {
		name: "学习打卡",
		id: 1
	}, {
		name: "留日见闻",
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
	:deep(.space) {
		padding: 3px 5px !important;
	}



	:deep(.wd-tabs) {
		background: transparent !important;
	}

	:deep(.wd-tabs__nav) {
		background-color: #F6F6F6;
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
		padding-top: 5px;
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
				margin-top: 15px;
				justify-content: space-between;
				display: flex;

				.left {
					align-items: center;
					display: flex;
					gap: 10px;

					>view {
						display: flex;
						align-items: center;
						font-size: $uni-font-size-base;
					}
				}
			}

			.body {
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