<template>
	<view class="wordlist">
		<view @click="goPage('/pages/word/worddetail/worddetail',{
			id:item.id,
			type:type
		})" :key="item.id" v-for="item in list">
			<view class="worditem">
				<view v-if="type=='jc'" class="head jpfont">
					<p>{{item.word}}{{item.word!=item.kana?'['+item.kana+']':''}}</p>
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
		goPage
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
		gap: 10px;
		padding: 10px;

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