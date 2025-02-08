<template>
	<view style="min-height: 100vh;background-color: #f5f5f5;">
		<NavBar title="语法详情" style="background-color: #f5f5f5;">
		</NavBar>
		<view style="padding: 0 10px 20px 10px; display: flex;flex-direction: column;gap: 10px;">
			<view class="head">
				<view class="word">
					<text>{{data.grammar}}</text>
				</view>
				<view class="tools">
					<view class="item">
						<text>朗读</text>
						<wd-icon name="sound" size="14px"></wd-icon>
					</view>
				</view>
			</view>
			<view class="body">
				<text class="tip">语法意义</text>
				<view v-html="data.explain"></view>
			</view>
			<view class="body">
				<text class="tip">基本结构</text>
				<view v-html="data.struct"></view>
			</view>
			<view class="body">
				<text class="tip">使用场景</text>
				<view v-html="data.scene"></view>
			</view>
			<view class="body">
				<text class="tip">注意事项</text>
				<view v-html="data.warning"></view>
			</view>
			<view class="body">
				<text class="tip">例句</text>
				<view class="examples">
					<view class="example" :key="item.ch" v-for="item in data.example">
						<view style="flex: 1;">
							<view class="ja jpfont">
								<view class="worditem" v-for="item1 in item.read">
									<view class="top">{{item1.top}}</view>
									<view :class="{underline:item1.top}" class="bottom">{{item1.body}}</view>
								</view>
							</view>
							<view class="ch">
								<wd-tag custom-class="space" type="warning">译</wd-tag>{{item.ch}}
							</view>
						</view>
						<view class="operate">
							<wd-icon name="sound" size="20" color="#909699" />
						</view>
					</view>
				</view>
			</view>
			<view class="body">
				<text class="tip">总结</text>
				<view v-html="data.summary"></view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import NavBar from '@/components/navbar.vue'
	import $http from "@/api/index.js"
	const data = ref({})
	const getInfo = async (id) => {
		const res = await $http.common.getGrammarInfo(id)
		data.value = res.data
	}

	onLoad((e) => {
		getInfo(e.id)
	})
</script>

<style scoped lang="scss">
	.examples {
		display: flex;
		flex-direction: column;
		background-color: #F6F6F6;
		border-radius: 4px;
		padding: 10px;
		margin-top: 10px;
		gap: 10px;

		.example {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.operate {
				display: flex;
				justify-content: flex-end;
			}

			.ch {
				display: flex;
				align-items: center;
				gap: 3px;
				font-size: $uni-font-size-base;
				color: $uni-text-color-grey;
				background-color: $uni-bg-color-grey;
				border-radius: $uni-border-radius-base;
			}

			.ja {
				display: flex;
				flex-wrap: wrap;

				.worditem {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					.top {
						// color: #57D09B;
						font-size: 8px;
						height: 8px;
						margin: 0 2px;
					}

					.bottom {
						font-size: $uni-font-size-base;
					}

					.underline {
						// color: #57D09B;
						text-decoration: underline;
					}
				}
			}
		}
	}

	.head {
		padding: 10px;
		border-radius: 8px;
		background-color: white;

		.word {
			display: flex;
			align-items: center;
			gap: 5px;
			font-size: 20px;
			font-weight: bold;
		}
	}

	.body {
		padding: 10px;
		background-color: white;
		border-radius: 8px;

		text {
			font-size: 14px;
			color: #999;
		}
	}

	.list {
		margin-top: 10px;
		display: flex;
		flex-direction: column;
		gap: 10px;

		.item {
			line-height: 50px;
			background-color: white;
			padding: 0 10px;
			box-sizing: border-box;
		}
	}



	.tools {
		display: flex;
		margin-top: 10px;
		gap: 10px;

		>.item {

			display: flex;
			align-items: center;
			justify-content: center;
			gap: 2px;
			padding: 3px 10px;
			color: white;
			border-radius: 18px;

			&:nth-of-type(1) {
				background-color: #5880F2;
			}

			&:nth-of-type(2) {
				background-color: #5880F2;
			}

			text {
				font-size: $uni-font-size-sm;
			}
		}
	}
</style>