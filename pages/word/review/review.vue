<template>
	<view>
		<view class="head">
			<NavbarDefault border title="回顾"></NavbarDefault>
		</view>
		<view class="wordlist">
			<view @click="goPage('/pages/word/worddetail/worddetail',{
				id:item.id,
				type:'jc'
			})" :key="item.id" v-for="item in wordList">
				<view class="worditem">
					<view class="heads jpfont">
						<text>{{formatWordName(item.word,item.kana)}}</text>
						<view class="tags">
							<view class="tag sound" v-if="item.write">已默写</view>
							<view class="tag write" v-if="item.sound">已听写</view>
						</view>
					</view>
					<wd-text size="14px" :lines="2" custom-class="body" color="#999"
						:text="item.meaning.map(item=>item.meaning).join('\n')"></wd-text>
				</view>
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
		console.log("会故意");
		const res = await $http.word.getTodaywords({
			filter: []
		})
		let localWords = [localwordsStore().writeList, localwordsStore().soundList]
		res.data.map(item => {
			if (localwordsStore().writeList.some(it => it.id == item.id)) {
				item.write = true
			} else {
				item.write = false
			}
			if (localwordsStore().soundList.some(it => it.id == item.id)) {
				item.sound = true
			} else {
				item.sound = false
			}
			return item
		})
		wordList.value = res.data
	}
	onLoad(op => {
		getAllWords()
	})
</script>

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
			background-color: red;
			border-radius: 20px;
			padding: 0 8px;
			font-size: 12px;

		}

		.write {
			background-color: #f3e5f5;
			color: #7b1fa2;
		}

		.sound {
			background-color: #f5e8d0;
			color: #059048;
		}
	}

	.wordlist {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-top: 16px;
		padding: 0 16px env(safe-area-inset-bottom) 16px;

		.worditem {
			background-color: white;
			padding: 10px;
			border-radius: 8px;


			.heads {
				display: flex;
				align-items: center;
				justify-content: space-between;

				p {
					font-weight: bold;
					font-size: 17px;
				}
			}
		}
	}
</style>