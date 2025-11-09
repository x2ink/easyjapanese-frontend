<template>
	<view style="height: 100vh;display: flex;flex-direction: column;">
		<view class="head">
			<NavbarDefault border title="学习回顾"></NavbarDefault>
		</view>
		<view class="statistics-wrap">
			<view class="statistics">
				<view style="color: #757575;">今日学习进度</view>
				<view class="data">
					<view class="_GCENTER">
						<view style="color: #07C160;">
							{{wordList.length}}
						</view>
						<view>
							已学习
						</view>
					</view>
					<view class="_GCENTER">
						<view style="color: #16A34A;">
							{{wordList.filter(item=>item.write).length}}
						</view>
						<view>
							已默写
						</view>
					</view>
					<view class="_GCENTER">
						<view style="color: #2563EB;">
							{{wordList.filter(item=>item.listen).length}}
						</view>
						<view>
							已听写
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="wordlist">
			<view class="worditem" @click="goPage('/pages/word/worddetail/worddetail',{
				id:item.id
			})" :key="item.id" v-for="item in wordList">
				<view class="heads jpfont">
					<text>{{formatWordName(item.words,item.kana)}}</text>
					<view class="tags">
						<view class="tag sound" v-if="item.write">已默写</view>
						<view class="tag write" v-if="item.listen">已听写</view>
					</view>
				</view>
				<wd-text size="14px" :lines="2" custom-class="body" color="#999" :text="item.description"></wd-text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import NavbarDefault from "@/components/navbar/default"
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		goPage,
		formatWordName
	} from "@/utils/common.js"
	import {
		localwordsStore
	} from "@/stores"
	import $http from "@/api/index.js"
	const wordList = ref([])
	const getAllWords = async () => {
		const res = await $http.word.getLearnt()
		wordList.value = res.data
	}
	onLoad(op => {
		getAllWords()
	})
</script>
<style>
	page {
		background-color: white;
	}
</style>
<style scoped lang="scss">
	.head {
		position: sticky;
		top: 0;
		z-index: 9;
	}

	.tags {
		display: flex;
		align-items: center;
		gap: 4px;

		.tag {
			line-height: 20px;
			border-radius: 4px;
			padding: 0 8px;
			font-size: 12px;

		}

		.write {
			background-color: rgb(220, 252, 231);
			color: rgb(21, 128, 61);
		}

		.sound {
			background-color: rgb(219, 234, 254);
			color: rgb(29, 78, 216);
		}
	}

	.wordlist {
		flex: 1;
		overflow: auto;
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-top: 16px;
		padding: 8px 16px calc(env(safe-area-inset-bottom) + 16px) 16px;

		.worditem {
			border-bottom: 1px solid #f0f0f0;
			padding-bottom: 15px;

			.heads {
				display: flex;
				align-items: center;
				justify-content: space-between;

			}
		}
	}

	.statistics-wrap {
		background: white;

		.statistics {
			margin: 8px 16px 8px 16px;
			padding: 16px;
			border: 1px solid #bbf7d0;
			background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
			border-radius: 16px;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.data {
				display: flex;
				align-items: center;
				gap: 16px;

				>view {
					flex-direction: column;
					color: #757575;
					font-size: 12px;

					>view {
						&:first-child {
							font-size: 22px;
							font-weight: 600;
						}

					}
				}
			}
		}
	}
</style>