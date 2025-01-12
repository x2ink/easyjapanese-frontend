<template>
	<NavBar title="">
		<template #right>
			<wd-icon @click="moreShow=true" name="ellipsis" size="30px"></wd-icon>
		</template>
	</NavBar>
	<view v-show="loading" class="loading _GCENTER">
		<wd-loading />
	</view>
	<view v-show="!loading">
		<view class="cj" v-if="type=='cj'">
			<view style="padding: 0 15px;">
				<view class="word">
					<text>{{chinfo.ch}}</text>
				</view>
				<view class="hira">
					<span>{{chinfo.pinyin}}</span>
				</view>
				<view class="tools">
					<view class="item">
						<text>发音</text>
						<wd-icon name="sound" size="14px"></wd-icon>
					</view>
				</view>
			</view>
			<!-- 列表 -->
			<WordList style="margin-top: 0px;background-color: transparent;" :list="chinfo.result"></WordList>
		</view>
		<view class="wordinfo" v-else>
			<view style="padding: 0 15px;">
				<view class="word jpfont">
					<text>{{wordinfo.word}}</text>
				</view>
				<view class="hira jpfont">
					<span>{{wordinfo.kana}}{{wordinfo.tone}}</span>|
					<span>{{wordinfo.rome}}</span>
				</view>
				<view class="tools">
					<view class="item">
						<text>发音</text>
						<wd-icon name="sound" size="14px"></wd-icon>
					</view>
					<view class="item">
						<text>跟读</text>
						<wd-icon name="service" size="14px"></wd-icon>
					</view>
				</view>
			</view>
			<view style="display: flex;flex-direction: column;gap: 15px;background-color: #f5f5f5;">
				<view class="wordlist" :key="item.wordtype" v-for="(item,index1) in wordinfo.detail">
					<text v-if="item.wordtype!=''" class="title">词性</text>
					<view class="wordtype">
						{{item.wordtype}}
					</view>
					<view style="display: flex;flex-direction: column;gap: 10px;">
						<text class="title">释义</text>
						<view class="meanings" :key="item1.meaning" v-for="(item1,index2) in item.detail">
							<view class="meaning">
								<view class="text jpfont">
									{{item1.meaning}}
								</view>
							</view>
							<view class="examples" v-if="item1.example.length>0">
								<view class="example" :key="item2.ch"
									v-for="item2 in showExample(item1.show,item1.example)">
									<view style="flex: 1;">
										<view class="ja jpfont">
											<view class="worditem" v-for="item3 in item2.read">
												<view class="top">{{item3.top}}</view>
												<view :class="{underline:item3.top}" class="body">{{item3.body}}</view>
											</view>
										</view>
										<view class="ch">
											<wd-tag custom-class="space" type="warning">译</wd-tag>{{item2.ch}}
										</view>
									</view>
									<view class="operate">
										<wd-icon name="sound" size="20" color="#909699" />
									</view>
								</view>
							</view>
							<view v-if="item1.example.length>2&&!item1.show" @click="showMore(index1,index2)"
								class="viewmore">
								更多例句</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
	<wd-action-sheet :safe-area-inset-bottom="false" cancel-text="取消" v-model="moreShow" :actions="actions"
		@close="moreShow=false" @select="select" />
</template>

<script setup>
	import {
		computed,
		ref
	} from 'vue'
	import NavBar from '@/components/navbar.vue'
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import $http from "@/api/index.js"
	import WordList from "@/components/wordlist.vue"
	const type = ref('jc')
	const loading = ref(true)
	const moreShow = ref(false)
	const wordinfo = ref({
		word: null,
		voice: null,
		tone: null,
		rome: null,
		kana: null,
		detail: []
	})
	const chinfo = ref({
		ch: "",
		py: "",
		result: []
	})
	const id = ref(null)
	onLoad((e) => {
		type.value = e.type
		id.value = e.id
		if (e.type == "jc") {
			getJcInfo()
		} else {
			getCjInfo()
		}
	})
	const showExample = (show, array) => {
		if (show) {
			return array
		} else {
			return array.slice(0, 2)
		}
	}
	const showMore = (index1, index2) => {
		wordinfo.value.detail[index1].detail[index2].show = true
	}
	const getCjInfo = async () => {
		const res = await $http.word.cjInfo(id.value)
		chinfo.value = res.data
		loading.value = false
	}
	const getJcInfo = async () => {
		const res = await $http.word.jcInfo(id.value)
		res.data.detail.forEach((_, i) => {
			res.data.detail[i].detail.forEach((_, k) => {
				res.data.detail[i].detail[k].show = false
			})
		})
		console.log(res.data);
		wordinfo.value = res.data
		loading.value = false
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
</script>

<style lang="scss" scoped>
	.tools {
		display: flex;
		margin-top: 5px;
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

	.loading {
		margin-top: 40px;
	}



	.viewmore {
		font-size: $uni-font-size-sm;
		text-align: right;
		margin-top: 5px;
		color: $uni-text-color-grey;
	}

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
						color: #57D09B;
						font-size: 8px;
						height: 8px;
						margin: 0 2px;
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
		padding: 10px;
		background-color: white;

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
</style>