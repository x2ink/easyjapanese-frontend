<template>
	<view v-if="loading">
		<Loading></Loading>
	</view>
	<view v-else>
		<NavBar title="" style="background-color: white;">
			<template #right>
				<wd-icon name="ellipsis" size="30px"></wd-icon>
			</template>
		</NavBar>
		<view style="padding:0 15px;">
			<view class="title">
				{{info.title}}
			</view>
			<view class="time">{{dayjs(info.created_at).format('YYYY年MM月DD日')}} | {{info.user.nickname}}发布</view>
			<view class="content">
				<view v-for="example in info.content">
					<image v-if="example.type=='image'" mode="widthFix" style="width: 100%;margin: 10px 0;"
						:src="example.url"></image>
					<view @click="openExplain(example.explain)" v-else class="example">
						<view>
							<view class="ja jpfont">
								<view class="worditem" v-for="item in example.read">
									<view class="top">{{item.top}}</view>
									<view :class="{underline:item.top}" class="body">{{item.body}}</view>
								</view>
							</view>
							<view class="ch">
								{{example.ch}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<wd-divider content-position="right" style="padding: 0;">转载自NHK</wd-divider>
			<view class="smalltitle">新闻简述</view>
			<view style="font-size: 14px;">
				{{info.encapsulate}}
			</view>
			<view class="smalltitle">语法积累</view>
			<view v-html="info.grammer">

			</view>
			<view class="smalltitle">词汇积累</view>
			<wd-table :data="wordsList">
				<wd-table-col prop="word" label="单词" fixed></wd-table-col>
				<wd-table-col width="150" prop="kana" label="假名"></wd-table-col>
				<wd-table-col width="400" prop="meaning" label="解释"></wd-table-col>
			</wd-table>
			<view style="height: 80px;">

			</view>
			<!-- 播放器 -->
			<view class="audio _GCENTER">
				<sy-audio style="width: 100%;background-color: white;" isCountDown ref="audio" src='' audioCover=''
					subheading='' audioTitle=''></sy-audio>
			</view>
			<wd-popup v-model="show" position="bottom" custom-style="border-radius:16px 16px 0 0;height:50vh;">
				<view style="padding: 15px;position: relative;">
					<scroll-view style="height: 45vh" scroll-y="true">
						<text v-html="explain"></text>
					</scroll-view>
				</view>
			</wd-popup>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import NavBar from '@/components/navbar.vue'
	import Loading from '@/components/loading.vue'
	import $http from "@/api/index.js"
	import dayjs from 'dayjs'
	import 'dayjs/locale/zh'
	const show = ref(false)
	const explain = ref("")
	const info = ref({})
	const wordsList = ref([])
	const loading = ref(true)
	const getArticleInfo = async (id) => {
		const res = await $http.article.getInfo(id)
		info.value = res.data
		wordsList.value = info.value.words
		loading.value = false
	}
	onLoad((e) => {
		getArticleInfo(e.id)
	})
	const openExplain = (data) => {
		explain.value = data
		show.value = true
	}
</script>

<style scoped lang="scss">
	.audio {
		height: 80px;
		position: fixed;
		left: 15px;
		right: 15px;
		bottom: 0;
		z-index: 9;
	}

	.title {
		font-size: $uni-font-size-title;
		font-weight: bold;
		text-align: center;
	}

	.time {
		margin-top: 10px;
		font-size: $uni-font-size-sm;
		text-align: center;
		color: $uni-text-color-grey;
	}

	.smalltitle {
		line-height: 40px;
		font-weight: bold;
	}

	.example {
		.operate {
			display: flex;
			justify-content: flex-end;
		}

		.ch {
			display: flex;
			align-items: center;
			gap: 3px;
			margin-top: 10px;
			font-size: $uni-font-size-base;
			color: $uni-text-color-grey;
		}

		.ja {
			margin-top: 10px;
			display: flex;
			flex-wrap: wrap;
			position: relative;



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
</style>