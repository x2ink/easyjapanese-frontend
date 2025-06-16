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
							<view class="tag sound">已默写</view>
							<view class="tag write">已听写</view>
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
		tagColor,
		formatWordName
	} from "@/utils/common.js"
	import $http from "@/api/index.js"
	const wordList = ref([])
	const getAllWords = async () => {
		const res = await $http.word.writeFromMemory({
			remove: []
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