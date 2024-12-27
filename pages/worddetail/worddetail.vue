<template>
	<NavBar title="" style="background-color: #F6F6F6;">
		<template #right>
			<wd-icon @click="moreShow=true" name="ellipsis" size="30px"></wd-icon>
		</template>
	</NavBar>
	<view class="wordinfo">
		<view style="padding: 0 15px;">
			<view class="word jpfont">
				<text>{{wordinfo.word}}</text>
				<wd-icon name="sound" size="24" color="#5880F2" />
			</view>
			<view class="hira jpfont">
				<span>{{wordinfo.kana}}{{wordinfo.tone}}</span>|
				<span>{{wordinfo.rome}}</span>
			</view>
		</view>
		<view class="wordlist" :key="item.wordtype" v-for="item in wordinfo.detail">
			<text class="title">词性</text>
			<view class="wordtype">
				{{item.wordtype}}
			</view>
			<view style="display: flex;flex-direction: column;gap: 10px;">
				<text class="title">释义</text>
				<view class="meanings" :key="item1.meaning" v-for="item1 in item.detail">
					<view class="meaning">
						<view class="text">
							{{item1.meaning}}
						</view>
					</view>
					<view class="examples" v-if="item1.example.length>0">
						<view class="example" :key="item2.ch" v-for="item2 in item1.example.slice(0,2)">
							<view style="flex: 1;">
								<view class="ja jpfont">
									<view class="worditem" v-for="item3 in item2.read">
										<view class="top">{{item3.top}}</view>
										<view :class="{underline:item3.top}" class="body">{{item3.body}}</view>
									</view>
								</view>
								<view class="ch">
									<wd-tag custom-class="space" type="primary">译</wd-tag>{{item2.ch}}
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
		<!-- 责任声明 -->
		<view class="statement _GCENTER">
			本APP词典数据源自日本公开网络<br>若有侵权请联系删除。
		</view>
	</view>
	<wd-action-sheet :safe-area-inset-bottom="false" cancel-text="取消" v-model="moreShow" :actions="actions"
		@close="moreShow=false" @select="select" />
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import NavBar from '@/components/navbar.vue'
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import $http from "@/api/index.js"
	const moreShow = ref(false)
	const wordinfo = ref({
		word: null,
		voice: null,
		tone: null,
		rome: null,
		kana: null,
		detail: []
	})
	const id = ref(null)
	onLoad((e) => {
		id.value = e.id
		getInfo()
	})
	const getInfo = async () => {
		const res = await $http.word.jaInfo(id.value)
		console.log(res.data);
		wordinfo.value = res.data
	}
	const actions = ref([{
			name: '单词纠错'
		},
		{
			name: '加入单词本'
		},
		{
			name: '分享单词'
		}
	])
	const worditem = ref([{
		top: "われわれ",
		body: "我々"
	}, {
		top: "",
		body: "はもうそろそろ"
	}, {
		top: "じかんぎれ",
		body: "時間切れ"
	}, {
		top: "",
		body: "だ。"
	}])
</script>

<style lang="scss" scoped>
	.statement {
		height: 60px;
		text-align: center;
		font-size: $uni-font-size-sm;
		color: $uni-text-color-grey;
		padding: 40px 0;
	}

	.examples {
		display: flex;
		flex-direction: column;
		background-color: #F6F6F6;
		border-radius: $uni-border-radius-base;
		padding: 10px;
		margin-top: 10px;
		gap: 10px;

		.example {
			border-radius: $uni-border-radius-base;
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
						color: #57D09B;
						font-size: 12px;
						height: 12px;
					}

					.body {
						font-size: $uni-font-size-base;
					}

					.underline {
						color: #57D09B;
						text-decoration: underline;
					}
				}
			}
		}
	}

	.wordlist {
		display: flex;
		flex-direction: column;
		margin-top: 10px;
		background-color: white;
		padding: 10px;

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

	.wordinfo {



		.word {
			display: flex;
			align-items: center;
			gap: 5px;
			font-size: $uni-font-size-subtitle;
			font-weight: bold;
		}

		.hira {
			display: flex;
			gap: 5px;
			color: $uni-text-color-grey;
		}
	}
</style>