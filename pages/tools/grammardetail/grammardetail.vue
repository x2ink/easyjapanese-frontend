<template>
	<view>
		<view class="head">
			<NavbarDefault border title="语法详情"></NavbarDefault>
		</view>
		<div class="info bg-white">
			<div style="display: flex;flex-direction: column;gap: 8px;align-items: flex-start;">
				<view class="grammar">{{data.grammar}}</view>
				<text class="level-tag N3">{{data.level}}语法</text>
			</div>
			<div class="explain" v-html="data.explain.replace('<br>','')">
			</div>
		</div>
		<div class="bg-white">
			<div class="section-title">基本结构</div>
			<div v-html="data.struct.replace('<br>','')" style="font-size: 14px;">
			</div>
		</div>
		<div class="bg-white">
			<div class="section-title">使用场景</div>
			<div v-html="data.scene.replace('<br>','')" style="font-size: 14px;">
			</div>
		</div>
		<div class="bg-white">
			<div class="section-title">例句</div>
			<view class="examples">
				<view class="example" :key="item.id" v-for="item in data.example">
					<view>
						<view class="ja jpfont">
							<view class="worditem" v-for="item1 in item.read">
								<view class="top">{{item1.top}}</view>
								<view :class="{underline:item1.top}" class="body">{{item1.body}}</view>
							</view>
						</view>
						<view class="ch">
							{{item.ch}}
						</view>
					</view>
				</view>
			</view>
		</div>
		<div class="bg-white">
			<div class="section-title">注意事项</div>
			<div v-html="data.warning.replace('<br>','')" style="font-size: 14px;">
			</div>
		</div>
		<div class="bg-white">
			<div class="section-title">总结</div>
			<div v-html="data.summary.replace('<br>','')" style="font-size: 14px;">
			</div>
		</div>
		<view style="height: calc(env(safe-area-inset-bottom) + 60px);">
		
		</view>
		<!-- 操作栏 -->
	<!-- 	<div class="bottom-actions">
			<view @click="goPage('/pages/word/mybooks/mybooks',{wordId:id})" class="bottom-btn btn-gray">
				<text class="fas fa-bookmark" style="margin-right: 4.5px;"></text> 收藏
			</view>
			<view class="bottom-btn btn-gray">
				<text class="fas fa-search" style="margin-right: 4.5px;"></text> 全网搜索
			</view>
			<view class="bottom-btn btn-gray">
				<text class="fas fa-pen-to-square" style="margin-right: 4.5px;"></text> 笔记
			</view>
		</div> -->
	</view>
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
		explain: '',
		struct: '',
		scene: '',
		warning: '',
		summary: ''
	})
	const getInfo = async (id) => {
		const res = await $http.common.getGrammarInfo(id)
		data.value = res.data
	}

	onLoad((e) => {
		getInfo(e.id)
	})
</script>

<style lang="scss" scoped>
	/* 底部操作栏 */
	.bottom-actions {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
		border-top: 1px solid #e5e7eb;
		background: white;
		padding: 12px 16px 0 16px;
		padding-bottom: calc(env(safe-area-inset-bottom) + 12px);
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.bottom-btn {
		padding: 8px;
		border-radius: 8px;
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
		gap: 12px;

		.example {
			border-left: 3px solid #07C160;
			padding-left: 12px;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.ch {
				padding-top: 4px;
				display: flex;
				align-items: center;
				gap: 5px;
				font-size: 14px;
				color: $uni-text-color-grey;
				border-radius: 4px;
			}

			.ja {
				display: flex;
				flex-wrap: wrap;

				.worditem {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: flex-end;

					.top {
						// color: #57D09B;
						font-size: 12px;
						// height: 12px;
						margin: 2px;
					}

					.body {
						font-size: 16px;
					}
				}
			}
		}
	}

	.head {
		position: sticky;
		top: 0;
		z-index: 9;
	}

	.level-tag {
		font-size: 10px;
		padding: 2px 6px;
		border-radius: 4px;
		font-weight: bold;
	}

	.section-title {
		position: relative;
		padding-left: 12px;
		font-size: 16px;
		font-weight: 600;
		margin-bottom: 10px;
	}

	.section-title:before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 3px;
		height: 16px;
		background-color: #07C160;
		border-radius: 3px;
	}

	.bg-white {
		margin: 16px;
		background-color: white;
		border-radius: 8px;
		padding: 12px;
	}

	.info {
		.grammar {
			font-size: 22px;
			font-weight: bold;
		}

		.explain {
			color: #4b5563;
			font-size: 14px;
			margin-top: 8px;
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