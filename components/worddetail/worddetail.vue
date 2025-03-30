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
			<!-- <WordList style="margin: 15px;background-color: transparent;" :list="cjinfo.result"></WordList> -->
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
					<view class="item" @click="goPage(`/pages/word/edit/edit`,{
						id:jcinfo.id
					})">
						<text>编辑</text>
						<wd-icon name="edit" size="14px"></wd-icon>
					</view>
					<view class="item" @click="emits('openBook')">
						<text>生词本</text>
						<wd-icon name="books" size="14px"></wd-icon>
					</view>
				</view>
			</view>
			<view class="worddetail">
				<view class="wordlist">
					<text v-if="jcinfo.wordtype" class="title">词性</text>
					<view v-if="jcinfo.wordtype" class="wordtype">
						{{jcinfo.wordtype}}
					</view>
					<text class="title">简明释义</text>
					<view class="meanings">
						<view class="meaning" :key="item.meaning" v-for="(item,index) in jcinfo.meaning">
							<view class="text jpfont">
								{{item.meaning}}
							</view>
						</view>
					</view>
					<text class="title">详细释义</text>
					<view style="margin-top: 10px;font-size: 14px;">
						{{jcinfo.detail}}
					</view>
				</view>
			</view>
			<view class="worddetail" v-if="jcinfo.example.length>0">
				<view class="wordlist">
					<view style="display: flex;flex-direction: column;gap: 10px;">
						<text class="title">例句</text>
						<view class="examples">
							<view class="example" :key="item.id" v-for="item in jcinfo.example">
								<view>
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
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="_GCENTER" @click="goPage('/otherpages/feedback/feedback', {
					type:'单词纠错',
					wordid,
					wordtype:type
				})" style="margin-top: 20px;">
				<wd-button type="info" size="small" plain hairline icon="edit">纠错</wd-button>
			</view>
		</view>

	</view>
</template>

<script setup>
	import {
		ref,
		computed,
	} from "vue"
	// import WordList from "@/components/wordlist.vue"
	import {
		goPage
	} from "@/utils/common.js"
	const wordid = computed(() => {
		return props.type === 'jc' ? props.jcinfo.id : props.cjinfo.id
	})
	const emits = defineEmits("openBook")
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
		margin: 15px;

		.wordlist {
			display: flex;
			flex-direction: column;
			padding: 15px;
			background-color: white;
			border-radius: 8px;

			.title {
				font-size: $uni-font-size-sm;
				color: $uni-text-color-grey;
			}

			.wordtype {
				margin: 10px 0;
				font-size: $uni-font-size-base;
			}

			.meanings {
				margin: 10px 0;
				display: flex;
				flex-direction: column;
				gap: 2px;

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
		gap: 5px;

		.example {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.ch {
				padding: 5px;
				display: flex;
				align-items: center;
				gap: 5px;
				font-size: $uni-font-size-base;
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

	.wordinfo {
		padding-bottom: calc(env(safe-area-inset-bottom));
	}
</style>