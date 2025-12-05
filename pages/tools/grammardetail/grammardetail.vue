<template>
	<scroll-view style="height: 100vh;" scroll-y="true">
		<view class="head">
			<NavbarDefault border title="语法详情"></NavbarDefault>
		</view>
		<div class="info bg-white">
			<div style="display: flex;flex-direction: column;gap: 16rpx;align-items: flex-start;">
				<view class="grammar">{{data.grammar}}</view>
				<text class="level-tag N3">N{{data.level}}语法</text>
			</div>
			<div class="explain">
				{{data.meanings.join("\n")}}
			</div>
		</div>
		<div class="bg-white">
			<div class="section-title">接续</div>
			<view v-html="data.connect" class="connect">
			</view>
		</div>
		<div class="bg-white">
			<div class="section-title">详细解释</div>
			<div style="font-size: 28rpx;white-space: pre-line">
				{{data.explanation.join("\n")}}
			</div>
		</div>
		<div class="bg-white">
			<div class="section-title">例句</div>
			<view class="examples">
				<view class="example" :key="item.id" v-for="item in data.examples">
					<view>
						<view class="ja" v-html="renderRubyHTMLWeb(item.ruby)"></view>
						<view class="ch">
							{{item.zh}}
						</view>
					</view>
				</view>
			</view>
		</div>
		<view style="height: calc(env(safe-area-inset-bottom));">

		</view>
	</scroll-view>
</template>

<script setup>
	import {
		ref,
	} from 'vue'
	import {
		onLoad,
	} from "@dcloudio/uni-app"
	import {
		goPage
	} from "@/utils/common.js"
	import NavbarDefault from "@/components/navbar/default"
	import $http from "@/api/index.js"
	const data = ref({
		examples: [],
		id: null,
		explanation: [],
		connect: '',
		grammar: '',
		level: '',
		meanings: []
	})
	const getInfo = async (id) => {
		const res = await $http.common.getGrammarInfo({
			id
		})
		data.value = res.data
	}
	const renderRubyHTMLWeb = (rubyList) => {
		return rubyList.map(item => `<ruby>${item.base}<rt>${item.ruby}</rt></ruby>`).join('');
	}
	onLoad((e) => {
		getInfo(e.id)
	})
</script>
<style>
	.connect table th {
		white-space: nowrap !important;
	}
</style>
<style lang="scss" scoped>
	/* 底部操作栏 */
	.bottom-actions {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 32rpx;
		border-top: 2rpx solid #e5e7eb;
		background: white;
		padding: 24rpx 32rpx 0 32rpx;
		padding-bottom: calc(env(safe-area-inset-bottom) + 24rpx);
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.bottom-btn {
		padding: 16rpx;
		border-radius: 16rpx;
		font-weight: 500;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn-gray {
		background: #f3f4f6;
		color: #374151;
	}


	.examples {
		display: flex;
		flex-direction: column;
		gap: 24rpx;

		.example {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.ch {
				padding-top: 8rpx;
				display: flex;
				align-items: center;
				gap: 10rpx;
				font-size: 28rpx;
				color: $uni-text-color-grey;
				border-radius: 8rpx;
			}

			.ja {
				font-size: 32rpx;
			}
		}
	}

	.head {
		position: sticky;
		top: 0;
		z-index: 9;
	}

	.level-tag {
		font-size: 20rpx;
		padding: 4rpx 12rpx;
		border-radius: 8rpx;
		font-weight: bold;
	}

	.connect {
		font-size: 28rpx;

		th {
			white-space: nowrap;
		}
	}

	.section-title {
		position: relative;
		padding-left: 24rpx;
		font-size: 32rpx;
		font-weight: 600;
		margin-bottom: 20rpx;
	}

	.section-title:before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 6rpx;
		height: 32rpx;
		background-color: #07C160;
		border-radius: 6rpx;
	}

	.bg-white {
		margin: 32rpx;
		background-color: white;
		border-radius: 16rpx;
		padding: 24rpx;
	}

	.info {
		.grammar {
			font-size: 44rpx;
			font-weight: bold;
		}

		.explain {
			white-space: pre-line;
			color: #4b5563;
			font-size: 28rpx;
			margin-top: 16rpx;
		}
	}

	.N1 {
		background-color: #F44336;
		color: white;
	}

	.N2 {
		background-color: #FF9800;
		color: white;
	}

	.N3 {
		background-color: #4CAF50;
		color: white;
	}

	.N4 {
		background-color: #2196F3;
		color: white;
	}

	.N5 {
		background-color: #9C27B0;
		color: white;
	}
</style>