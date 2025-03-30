<template>
	<Navbar title="单词学习">
	</Navbar>
	<view v-show="loading" class="loading _GCENTER">
		<wd-loading />
	</view>
	<view v-if="!loading">
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
			<!-- 	<wd-button @click="goPage('/pages/word/writefrommemory/writefrommemory')" type="info" size="small" plain
				hairline icon="edit">去默写</wd-button> -->
		</view>
	</view>
	<!-- 占位 -->
	<view style="height: calc(80px + env(safe-area-inset-bottom));">

	</view>
	<view class="handle">
		<!-- <wd-progress :percentage="percentage" hide-text /> -->
		<view>
			<view @click="previous()" class="btn _GCENTER">
				<text>上一个</text>
				<view style="background-color: #E78938;"></view>
			</view>
			<wd-icon @click="hideMeaning=!hideMeaning" v-if="!hideMeaning" name="browse" size="25px"
				color="#999"></wd-icon>
			<wd-icon @click="hideMeaning=!hideMeaning" v-else name="browse-off" size="25px" color="#999"></wd-icon>
			<view @click="next()" class="btn _GCENTER">
				<text>下一个</text>
				<view style="background-color: #34D19D;"></view>
			</view>
		</view>
	</view>
	<wd-toast />
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed,
		watch,
		nextTick
	} from 'vue'
	import Navbar from '@/components/navbar/navbar.vue';
	import $http from "@/api/index.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	import {
		goPage,
		tagColor,
		formatWordName
	} from "@/utils/common.js"
	const toast = useToast()
	const loading = ref(true)
	const position = ref(0)
	const previous = () => {
		if (position.value == 0) {
			position.value = wordList.value.length - 1
		} else {
			--position.value
		}
	}
	const next = () => {
		if (position.value == wordList.value.length - 1) {
			position.value = 0
		} else {
			++position.value
		}
	}
	const wordinfo = ref({})
	const wordList = ref([])
	watch(
		() => position.value,
		(newValues, oldValues) => {
			wordinfo.value = wordList.value[newValues]
		}
	);
	const total = ref(0)
	const hideMeaning = ref(false)
	const init = async () => {
		const res = await $http.word.todayWord()
		wordList.value = res.data
		total.value = res.total
		wordinfo.value = res.data[0]
		loading.value = false
	}
	onMounted(() => {
		init()
	})
</script>

<style lang="scss" scoped>
	:deep(.wd-progress) {
		padding-top: 0px;
	}

	.title {
		font-size: $uni-font-size-sm;
		color: $uni-text-color-grey;
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


	:deep(.wd-progress) {
		padding-top: 0 !important;
	}

	.handle {
		border-top: #f5f5f5 2px solid;
		padding-top: 10px;
		background-color: white;
		padding-bottom: env(safe-area-inset-bottom);
		position: fixed;
		bottom: 0px;
		right: 0;
		left: 0;
		z-index: 9999;

		>view {
			gap: 15px;
			display: flex;
			justify-content: space-around;
			align-items: center;

			.btn {
				width: 80px;
				height: 40px;
				flex-direction: column;
				gap: 5px;

				>text {
					font-size: 14px;
					font-weight: bold;
				}

				>view {
					width: 15px;
					height: 3px;
					border-radius: 3px;
				}
			}
		}
	}

	.loading {
		margin-top: 40px;
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

	.learnsuccess {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 15px;
		justify-content: center;

		text {
			color: $uni-text-color-grey;
		}
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
</style>