<template>
	<view>
		<Navbar :title="title">
		</Navbar>
		<view class="wordlist">
			<view @click="goPage('/pages/word/worddetail/worddetail',{
				id:item.id,
				type:type
			})" :key="item.id" v-for="item in List">
				<view class="worditem">
					<view class="head jpfont">
						<text>{{formatWordName(item.word,item.kana)}}</text>
						<view style="display: flex;align-items: center;gap: 3px;">
							<wd-tag v-for="tag in item.book" :key="tag" custom-class="space"
								:color="tagColor.get(tag).color" :bg-color="tagColor.get(tag).bgcolor">{{tag}}</wd-tag>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import Navbar from '@/components/navbar/navbar.vue';
	import WordList from "@/components/wordlist/wordlist.vue"
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import $http from "@/api/index.js"
	import {
		goPage,tagColor,formatWordName
	} from "@/utils/common.js"
	const List = ref([])
	const getNewWords = async () => {
		const res = await $http.word.todayWord()
		List.value = res.data
	}
	const title = ref("")
	onLoad((op) => {
		title.value = op.title
		if (op.type == 'review') {

		} else {
			getNewWords()
		}
	})
</script>

<style scoped lang="scss">
.wordlist {
		display: flex;
		flex-direction: column;
		gap: 15px;
		padding:0 15px;

		.worditem {
			background-color: white;
			padding: 10px;
			border-radius: 8px;


			.head {
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