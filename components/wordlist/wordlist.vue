<template>
	<view class="wordlist">
		<view @click="goPage('/pages/word/worddetail/worddetail',{
			id:item.id,
			type:type
		})" :key="item.id" v-for="item in list">
			<view class="worditem">
				<view v-if="type=='jc'" class="head jpfont">
					<text>{{formatWordName(item.word,item.kana)}}</text>
					<view style="display: flex;align-items: center;gap: 3px;">
						<wd-tag v-for="tag in item.book" :key="tag" custom-class="space"
							:color="tagColor.get(tag).color" :bg-color="tagColor.get(tag).bgcolor">{{tag}}</wd-tag>
					</view>
				</view>
				<view v-else class="head">
					<p>{{item.ch}}</p>
				</view>
				<wd-text v-if="type=='jc'" size="14px" :lines="2" custom-class="body" color="#999"
					:text="item.meaning.join('\n')"></wd-text>
				<wd-text v-else size="14px" :lines="2" custom-class="body" color="#999" :text="item.pinyin"></wd-text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		goPage,tagColor,formatWordName
	} from "@/utils/common.js"
	const props = defineProps({
		list: {
			type: Array
		},
		type: {
			type: String,
			default: 'jc'
		}
	})
</script>

<style lang="scss" scoped>
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