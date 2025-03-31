<template>
	<view style="padding:10px 15px;">
		<view class="word">
			<text>{{formatWordName(wordinfo.word,wordinfo.kana)}}</text>
			<text style="font-size: 18px;">{{wordinfo.tone}}</text>
		</view>
		<view class="hira">
			<span>{{wordinfo.rome}}</span>|
			<span>{{wordinfo.wordtype}}</span>
		</view>
		<view class="tools">
			<view class="item">
				<text>发音</text>
				<wd-icon name="sound" size="14px"></wd-icon>
			</view>
			<view class="item" @click="emits('openBook')">
				<text>生词本</text>
				<wd-icon name="books" size="14px"></wd-icon>
			</view>
		</view>
	</view>
	<view class="meanings">
		<view style="padding-bottom: 10px;">
			<text class="title">简明释义</text>
		</view>
		<wd-skeleton v-if="hideMeaning" :rowCol="[1,1]" theme="text" />
		<view v-else>
			<view class="meaning" :key="item.meaning" v-for="(item,index) in wordinfo.meaning">
				<view class="text">
					{{item.meaning}}
				</view>
			</view>
		</view>
	</view>
	<view class="examples">
		<text class="title">例句</text>
		<view v-if="hideMeaning">
			<wd-skeleton theme="text" :rowCol="[1,1,1,1,1,1]" />
		</view>
		<view v-else class="example" :key="item.id" v-for="item in wordinfo.example.slice(0, 3)">
			<view>
				<view class="ja">
					<view class="worditem" v-for="item1 in item.read">
						<view class="top">{{item1.top}}</view>
						<view :class="{underline:item1.top}" class="body">{{item1.body}}</view>
					</view>
				</view>
				<view class="ch">
					<text>{{item.ch}}</text>
				</view>
			</view>
		</view>
	</view>
	<view class="_GCENTER" @click="goPage('/otherpages/feedback/feedback', {
			type:'单词纠错',
			wordid,
			wordtype:'jc'
		})" style="margin-top: 20px;gap: 10px;">
		<wd-button type="info" size="small" plain hairline icon="edit">纠错</wd-button>
		<wd-button type="info" size="small" plain hairline icon="tips">标熟</wd-button>
	</view>
</template>

<script setup>
	import {
		goPage,
		tagColor,
		formatWordName
	} from "@/utils/common.js"
	const props = defineProps({
		wordinfo: {
			default: {},
			type: Object
		}
	})
</script>

<style lang="scss">
	.title {
		font-size: $uni-font-size-sm;
		color: $uni-text-color-grey;
	}

	.word {
		display: flex;
		align-items: center;
		font-size: $uni-font-size-subtitle;
		font-weight: bold;
	}

	.hira {
		margin: 10px 0;
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		color: $uni-text-color-grey;
	}

	.tools {
		display: flex;
		margin: 15px 0 10px 0;
		gap: 10px;

		>.item {

			display: flex;
			align-items: center;
			justify-content: center;
			gap: 2px;
			padding: 0 10px;
			color: white;
			border-radius: 24px;
			height: 24px;
			background-color: #5880F2;

			text {
				font-size: $uni-font-size-sm;
				line-height: $uni-font-size-sm;
			}
		}
	}

	.meanings {
		background-color: white;
		border-radius: 8px;
		padding: 15px;
		margin: 0 15px 15px;
		font-size: 18px;
	}

	.examples {
		position: relative;
		display: flex;
		flex-direction: column;
		background-color: white;
		border-radius: 8px;
		padding: 15px;
		margin: 15px;
		gap: 15px;

		.example {
			.ch {
				margin-top: 5px;
				padding: 5px;
				display: flex;
				align-items: center;
				gap: 5px;
				font-size: 16px;
				color: $uni-text-color-grey;
				background-color: $uni-bg-color-grey;
				border-radius: 4px;
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
						font-size: 14px;
						height: 14px;
						margin: 0 2px;
					}

					.body {
						font-size: 18px;
					}

					.underline {
						// text-decoration: underline;
					}
				}
			}
		}
	}
</style>