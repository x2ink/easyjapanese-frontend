<template>
	<view style="padding-bottom: 15px;">
		<NavBar title="排行榜" style="background-color: #f3f3f5;"></NavBar>
		<view class="top">
			<view>
				<view class="_GCENTER">
					<uv-avatar size="50" :src="top[1].user.avatar"></uv-avatar>
					<view>
						<text>{{top[1].user.nickname}}</text>
						<image src="http://jp.x2.ink/images/top2.png" mode="aspectFit"></image>
						<text>{{top[1].word_count}}词</text>
					</view>
				</view>
			</view>
			<view>
				<view class="_GCENTER">
					<uv-avatar size="60" :src="top[0].user.avatar"></uv-avatar>
					<view>
						<text>{{top[0].user.nickname}}</text>
						<image src="http://jp.x2.ink/images/top1.png" mode="aspectFit"></image>
						<text>{{top[0].word_count}}词</text>
					</view>
				</view>
			</view>
			<view>
				<view class="_GCENTER">
					<uv-avatar size="50" :src="top[2].user.avatar"></uv-avatar>
					<view>
						<text>{{top[2].user.nickname}}</text>
						<image src="http://jp.x2.ink/images/top3.png" mode="aspectFit"></image>
						<text>{{top[2].word_count}}词</text>
					</view>
				</view>
			</view>
		</view>
		<wd-divider>其他用户</wd-divider>
		<view class="others">
			<view class="other" :key="item.user.id" v-for="(item,index) in other">
				<view class="left">
					<text class="no">{{index+4}}</text>
					<uv-avatar size="50" :src="item.user.avatar"></uv-avatar>
					<text class="nickname">{{item.user.nickname}}</text>
				</view>
				<view class="right">
					{{item.word_count}}词
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import NavBar from '@/components/navbar.vue'
	import $http from "@/api/index.js"
	const top = ref([])
	const other = ref([])
	const getRanking = async () => {
		const res = await $http.user.ranking()
		top.value = res.data.slice(0, 3)
		other.value = res.data.slice(3)
	}
	onMounted(() => {
		getRanking()
	})
</script>

<style scoped lang="scss">
	.others {
		display: flex;
		flex-direction: column;
		gap: 15px;
		margin: 0 15px;

		.other {
			padding: 15px;
			box-sizing: border-box;
			background-color: white;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-radius: 8px;

			.right {
				font-size: 14px;
				color: #999;
			}

			.left {
				display: flex;
				align-items: center;
				gap: 10px;

				.no {
					font-size: 18px;
					font-weight: bold;
				}

				.nickname {
					font-size: 14px;
				}
			}
		}
	}

	.top {
		display: grid;
		grid-template-columns: repeat(3, 2fr);
		margin: 0 15px;
		gap: 15px;
		align-items: end;

		>view {
			._GCENTER {
				background-color: white;
				border-radius: 8px;
				padding: 10px 0;
				flex-direction: column;

				>view {
					display: flex;
					align-items: center;
					gap: 3px;
					flex-direction: column;

					text {
						&:nth-of-type(1) {
							font-size: 14px;
							margin: 3px;
						}

						&:nth-of-type(2) {
							font-size: 12px;
							color: #999;
							margin-top: 3px;
						}
					}

					image {
						width: 20px;
						height: 20px;
					}
				}
			}
		}
	}
</style>