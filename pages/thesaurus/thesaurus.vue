<template>
	<view style="height: 100vh;background-color: white;">
		<NavBar title="词库列表" style="background-color: #F6F6F6;"></NavBar>
		<wd-tabs v-model="current">
			<block v-for="(item,index) in tabList" :key="index">
				<wd-tab :title="item.name">
					<view class="rankinglist">
						<view class="rankingitem" v-for="_ in 5">
							<image mode="aspectFill"
								src="https://static-cse.canva.cn/blob/352230/1003w-olh3HW7GiQY.3e89ead4.jpg">
							</image>
							<view>
								<view>
									<wd-text color="#000000" :lines="1" size="17px" text="新编日语教程"></wd-text>
									<wd-text :lines="3" size="14px" style="margin-top: 6px;"
										text="含新课标新增词,全国统一"></wd-text>
								</view>
								<p class="number">355词<span>正在学习</span></p>
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
		ref
	} from 'vue'
	import NavBar from '@/components/navbar.vue'
	const current = ref(0)
	const tabList = ref([{
		name: "全部"
	}, {
		name: "新标"
	}, {
		name: "新编"
	}, {
		name: "考研"
	}, {
		name: "考级"
	}])
</script>

<style lang="scss">
	.number {
		color: $uni-text-color-grey;
		font-size: $uni-font-size-base;
		font-weight: bold;

		span {
			margin-left: 10px;
			color: $uni-color-warning;
		}
	}

	.rankinglist {
		margin: 0 16px;
		display: flex;
		flex-direction: column;

		.rankingitem {
			padding: 10px;
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
				border-radius: 5px;
			}
		}
	}
</style>