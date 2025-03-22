<template>
	<view class="list">
		<view @click="goPage('/trendpages/trenddetail/trenddetail',{id:item.id})" class="item" v-for="item in list"
			:key="item.id">
			<uv-avatar size="40" :src="item.user.avatar"></uv-avatar>
			<view style="flex: 1;">
				<view class="head">
					<view class="userinfo">
						<text>{{item.user.nickname}}</text>
						<wd-tag v-if="item.user.role=='嘉宾'" custom-class="space">嘉宾</wd-tag>
						<wd-tag v-else-if="item.user.role=='普通'" custom-class="space" type="success">普通</wd-tag>
						<wd-tag v-else-if="item.user.role=='官方'" custom-class="space" type="primary">官方</wd-tag>
						<wd-tag v-else-if="item.user.role=='会员'" custom-class="space" type="danger">会员</wd-tag>
					</view>
				</view>
				<view class="body">
					<p class="content" v-html="item.content.replace(/\n/g,'<br>')"></p>
					<view class="images">
						<view class="image" v-for="image in item.images" :key="image">
							<uv-image mode="aspectFill" radius="4px" width="100%" height="100%" :src="image"></uv-image>
						</view>
					</view>
				</view>
				<view class="footer">
					<p class="left">{{dayjs().to(dayjs(item.created_at))}}</p>
					<view class="right">
						<view>
							<wd-icon name="heart" color="#999" size="18px"></wd-icon>
							<text>{{item.like}}</text>
						</view>
						<view>
							<wd-icon name="browse" color="#999" size="18px"></wd-icon>
							<text>{{item.browse}}</text>
						</view>
						<view>
							<wd-icon name="chat1" color="#999" size="18px"></wd-icon>
							<text>{{item.comment}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		goPage
	} from "@/utils/common.js"
	import dayjs from 'dayjs'
	import relativeTime from 'dayjs/plugin/relativeTime'
	import 'dayjs/locale/zh'
	dayjs.locale('zh')
	dayjs.extend(relativeTime)
	const props = defineProps({
		list: {
			type: Array,
			default: []
		}
	})
</script>

<style lang="scss">
	.list {
		background-color: #f5f5f5;
		padding: 0 15px 15px 15px;
		display: flex;
		flex-direction: column;
		gap: 15px;

		.item {
			display: flex;
			background-color: white;
			padding: 15px;
			gap: 15px;
			border-radius: 8px;

			.footer {
				justify-content: space-between;
				display: flex;
				align-items: center;

				.right {
					display: flex;
					align-items: center;
					gap: 10px;

					text {
						font-size: $uni-font-size-sm;
						color: $uni-text-color-grey;
					}

					>view {
						display: flex;
						align-items: center;
						gap: 5px;
					}
				}

				.left {
					font-size: $uni-font-size-sm;
					color: $uni-text-color-grey;
				}
			}

			.body {


				.images {
					display: grid;
					grid-template-columns: repeat(3, 1fr);
					gap: 10px;
					margin-bottom: 5px;

					.image {
						object-fit: cover;
						width: 100%;
						aspect-ratio: 1;
						border-radius: $uni-border-radius-base;
					}
				}

				.content {
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 4;
					/* 显示最多4行 */
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: normal;
					/* 允许换行 */
					margin: 5px 0;
					font-size: $uni-font-size-base;
				}
			}

			.head {
				display: flex;
				gap: 10px;
				position: relative;

				.btn {
					position: absolute;
					right: 0;
				}

				.userinfo {
					display: flex;
					gap: 5px;
					align-items: center;

					text {
						&:nth-of-type(1) {
							font-size: 15px;
						}

						&:nth-of-type(2) {
							font-size: 14px;
							color: $uni-text-color-grey;
						}
					}
				}
			}
		}
	}
</style>