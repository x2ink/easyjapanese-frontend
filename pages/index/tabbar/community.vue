<template>
	<view>
		<view class="search">
			<wd-icon name="search" size="22px" color="#979797"></wd-icon>
			<input placeholder="搜索" />
		</view>
		<wd-tabs :lineWidth="40" v-model="currentTab" animated>
			<block v-for="(item,index) in tabList" :key="index">
				<wd-tab :title="item.name">
					<view class="current" v-if="currentTab===0">
						<p class="title">最新上架</p>
						<scroll-view class="scroll-view_H" scroll-x="true">
							<view class="newitem" v-for="_ in 10">
								<image mode="aspectFill"
									src="https://static-cse.canva.cn/blob/352230/1003w-olh3HW7GiQY.3e89ead4.jpg">

								</image>
								<wd-text color="#000000" :lines="1"
									text="芦叶满汀洲寒沙带浅流。二十年重过南楼。柳下系船犹未稳，能几日，又中秋。黄鹤断矶头，故人曾到否？旧江山浑是新愁。欲买桂花同载酒，终不似，少年游。"></wd-text>
							</view>
						</scroll-view>
						<p class="title">推荐阅读</p>
						<view class="rankinglist">
							<view class="rankingitem" v-for="_ in 10">
								<image mode="aspectFill"
									src="https://static-cse.canva.cn/blob/352230/1003w-olh3HW7GiQY.3e89ead4.jpg">
								</image>
								<view>
									<view>
										<wd-text color="#000000" :lines="1" size="18px"
											text="芦叶满汀洲寒沙带浅流。二十年重过南楼。柳下系船犹未稳，能几日，又中秋。黄鹤断矶头，故人曾到否？旧江山浑是新愁。欲买桂花同载酒，终不似，少年游。"></wd-text>
										<wd-text :lines="3" size="14px" style="margin: 5px 0;"
											text="芦叶满汀洲寒沙带浅流。二十年重过南楼。柳下系船犹未稳，能几日，又中秋。黄鹤断矶头，故人曾到否？旧江山浑是新愁。欲买桂花同载酒，终不似，少年游。"></wd-text>
									</view>
									<view class="tags">
										<uv-avatar-group :urls="urls" size="20" gap="0.4"></uv-avatar-group>
										<wd-text :lines="1" size="12px" text="999人正在关注"></wd-text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view v-else>
						<view class="typelist">
							<view v-for="_ in 10" class="typeitem">
								<view>
									<p>词典次数</p>
									<p>145本</p>
								</view>
								<image mode="aspectFill"
									src="https://static-cse.canva.cn/blob/352230/1003w-olh3HW7GiQY.3e89ead4.jpg">

								</image>
							</view>
						</view>
					</view>
				</wd-tab>
			</block>
		</wd-tabs>
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
	const currentTab = ref(0)
	const tabList = ref([{
			name: "辞书首页"
		},
		{
			name: "辞书分类"
		}
	])
	const urls = ref([
		'https://cdn.uviewui.com/uview/album/1.jpg',
		'https://cdn.uviewui.com/uview/album/2.jpg',
		'https://cdn.uviewui.com/uview/album/3.jpg',
		'https://cdn.uviewui.com/uview/album/4.jpg',
		'https://cdn.uviewui.com/uview/album/7.jpg',
		'https://cdn.uviewui.com/uview/album/6.jpg',
		'https://cdn.uviewui.com/uview/album/5.jpg'
	])
</script>

<style lang="scss" scoped>
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		background-color: transparent;
	}

	.typelist {
		margin: 15px;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 15px;

		.typeitem {
			padding: 10px;
			background-color: white;
			border-radius: $uni-border-radius-base;
			display: flex;
			align-items: center;
			justify-content: space-between;

			image {
				width: 45px;
				height: 60px;
				border-radius: $uni-border-radius-sm;
			}

			>view {
				p {
					&:nth-of-type(2) {
						color: $uni-text-color-grey;
						font-size: $uni-font-size-sm;
						margin-top: 8px;
					}
				}
			}
		}
	}

	

	:deep(.wd-tabs) {
		background: transparent !important;
	}

	:deep(.wd-tabs__nav) {
		background-color: transparent !important;
	}

	.search {
		height: 45px;
		background: white;
		margin: 15px;
		padding: 10px;
		margin-bottom: 0;
		font-size: $uni-font-size-lg;
		box-sizing: border-box;
		border-radius: 45px;
		display: flex;
		align-items: center;

		input {
			margin-left: 10px;
		}
	}

	.current {}

	.title {
		font-size: $uni-font-size-lg;
		margin: 10px;
		font-weight: bold;
	}


	.scroll-view_H {
		padding-top: 5px;
		white-space: nowrap;
		width: 100%;
		height: 160px;

		.newitem {
			width: 100px;
			margin: 0 8px;
			display: inline-block;

			&:first-child {
				margin-left: 16px !important;
			}

			&:last-child {
				margin-right: 16px !important;
			}

			image {
				height: 133.33px;
				width: 100px;
				border-radius: $uni-border-radius-base;
			}
		}

	}
</style>