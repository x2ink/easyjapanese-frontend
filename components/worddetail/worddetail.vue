<template>
	<view>
		<view class="cj" v-if="type=='cj'">
			<view style="padding: 0 15px;">
				<view class="word">
					<text>{{cjinfo.ch}}</text>
				</view>
				<view class="hira">
					<span>{{cjinfo.pinyin}}</span>
				</view>
				<view class="tools">
					<view class="item">
						<text>发音</text>
						<wd-icon name="sound" size="14px"></wd-icon>
					</view>
				</view>
			</view>
			<!-- 列表 -->
			<WordList style="margin: 15px;background-color: transparent;" :list="cjinfo.result"></WordList>
		</view>
		<view class="wordinfo" v-else>
			<view style="padding: 0 15px;">
				<view class="word jpfont">
					<text>{{jcinfo.word}}</text>
				</view>
				<view class="hira jpfont">
					<span>{{jcinfo.kana}}{{jcinfo.tone}}</span>|
					<span>{{jcinfo.rome}}</span>
				</view>
				<view class="tools">
					<view class="item">
						<text>发音</text>
						<wd-icon name="sound" size="14px"></wd-icon>
					</view>
					<view class="item" @click="goPage(`/pages/word/followread/followread`,{
						word:jcinfo.kana,
						id:jcinfo.id
					})">
						<text>跟读</text>
						<wd-icon name="service" size="14px"></wd-icon>
					</view>
					<view class="item" @click="goPage(`/otherpages/browse/browse`,{
						type:'dict',
						word:jcinfo.word
					})">
						<text>全网搜索</text>
						<wd-icon name="internet" size="14px"></wd-icon>
					</view>
					<view class="item">
						<text>编辑</text>
						<wd-icon name="edit" size="14px"></wd-icon>
					</view>
				</view>
			</view>
			<view class="worddetail">
				<view class="wordlist">
					<text v-if="jcinfo.wordtype" class="title">词性</text>
					<view v-if="jcinfo.wordtype" class="wordtype">
						{{jcinfo.wordtype}}
					</view>
					<view style="display: flex;flex-direction: column;gap: 10px;">
						<text class="title">释义</text>
						<view class="meanings" :key="item.meaning" v-for="(item,index) in jcinfo.meaning">
							<view class="meaning">
								<view class="text jpfont">
									{{item.meaning}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="worddetail" v-if="jcinfo.example.length>0">
				<view class="wordlist">
					<view style="display: flex;flex-direction: column;gap: 10px;">
						<text class="title">例句</text>
						<view class="examples">
							<view class="example" :key="item.id" v-for="item in jcinfo.example">
								<view style="flex: 1;">
									<view class="ja jpfont">
										<view class="worditem" v-for="item1 in item.read">
											<view class="top">{{item1.top}}</view>
											<view :class="{underline:item1.top}" class="body">{{item1.body}}</view>
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
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	const showExample = (show, array) => {
		if (show) {
			return array
		} else {
			return array.slice(0, 2)
		}
	}
	const showMore = (index1, index2) => {
		props.jcinfo.detail[index1].detail[index2].show = true
	}
	import {
		ref,
		computed,
	} from "vue"
	import WordList from "@/components/wordlist.vue"
	import {
		goPage
	} from "@/utils/common.js"
	const props = defineProps({
		jcinfo: {
			type: Object,
			default: {
				word: null,
				voice: null,
				tone: null,
				rome: null,
				kana: null,
				meaning: [],
				example: []
			}
		},
		cjinfo: {
			type: Object,
			default: {
				ch: "",
				py: "",
				result: []
			}
		},
		type: {
			default: 'jc',
			type: String
		}
	})
</script>

<style scoped lang="scss">
	.worddetail {
		display: flex;
		flex-direction: column;
		gap: 15px;
		margin: 15px 10px 10px 10px;

		.wordlist {
			display: flex;
			flex-direction: column;
			padding: 10px;
			background-color: white;
			border-radius: 8px;

			.title {
				font-size: $uni-font-size-sm;
				color: $uni-text-color-grey;
			}

			.wordtype {
				margin: 5px 0;
				font-size: $uni-font-size-base;
			}

			.meanings {
				.meaning {
					.text {
						font-weight: bold;
						font-size: $uni-font-size-base;
					}
				}


			}

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
			padding: 0 10px;
			color: white;
			border-radius: 24px;
			height: 24px;
			background-color: #5880F2;
			// &:nth-of-type(1) {

			// }

			// &:nth-of-type(2) {
			// 	background-color: #5880F2;
			// }

			text {
				font-size: $uni-font-size-sm;
				line-height: $uni-font-size-sm;
			}
		}
	}

	.examples {
		display: flex;
		flex-direction: column;
		background-color: #F6F6F6;
		border-radius: 4px;
		padding: 10px;
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

					.body {
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




	.word {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: $uni-font-size-subtitle;
		font-weight: bold;
	}

	.hira {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		color: $uni-text-color-grey;
	}

	.viewmore {
		font-size: $uni-font-size-sm;
		text-align: right;
		margin-top: 5px;
		color: $uni-text-color-grey;
	}

	.wordinfo {
		padding-bottom: calc(env(safe-area-inset-bottom));
	}
</style>