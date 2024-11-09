<template>
	<view>
		<StatusBar></StatusBar>
		<NavBar title="词库列表"></NavBar>
		<p class="title">推荐词书</p>
		<view class="rankinglist">
			<view class="rankingitem" v-for="_ in 5">
				<image mode="aspectFill" src="https://static-cse.canva.cn/blob/352230/1003w-olh3HW7GiQY.3e89ead4.jpg">
				</image>
				<wd-button class="btn" plain size="small">开始学习</wd-button>
				<view>
					<view>
						<wd-text color="#000000" :lines="1" size="18px" text="新编日语教程"></wd-text>
						<wd-text :lines="3" size="14px" style="margin-top: 6px;" text="已学:40/100个"></wd-text>
					</view>
					<view class="tags">
						<uv-avatar-group :urls="urls" size="20" gap="0.4"></uv-avatar-group>
						<wd-text :lines="1" size="12px" text="999人正在关注"></wd-text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import StatusBar from '@/components/statusBar.vue';
	import NavBar from '@/components/navbar.vue'
</script>

<style lang="scss">
	.title {
		font-size: $uni-font-size-lg;
		margin: 10px;
		font-weight: bold;
	}

	.rankinglist {
		margin: 0 16px;
		display: flex;
		flex-direction: column;
		gap: 16px;

		.rankingitem {
			background-color: white;
			padding: 10px;
			border-radius: $uni-border-radius-lg;
			display: flex;
			position: relative;

			.btn {
				position: absolute;
				right: 10px;
				top: 50%;
				transform: translateY(-50%);
			}

			>view {

				&:last-child {
					margin-left: 10px;
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.tags {
						display: flex;
						align-items: center;
						justify-content: space-between;
					}
				}
			}

			image {
				width: 60px;
				height: 80px;
				border-radius: $uni-border-radius-base;
			}
		}
	}
</style>