<template>
	<view class="wordlist">
		<view class="worditem" @click="getInfo(item.id)" :key="item.id" v-for="item in list">
			<view v-if="type=='jc'" class="head">
				<p>{{item.word}}{{item.word!=item.kana?'['+item.kana+']':''}}</p>
			</view>
			<view v-else class="head">
				<p>{{item.ch}}</p>
			</view>
			<wd-text v-if="type=='jc'" size="14px" :lines="2" class="body" color="#999"
				:text="item.meaning.join('\n')"></wd-text>
			<wd-text v-else size="14px" :lines="2" class="body" color="#999" :text="item.pinyin"></wd-text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	const props = defineProps({
		list: {
			type: Array
		},
		type: {
			type: String,
			default: 'jc'
		}
	})
	const getInfo = (id) => {
		uni.navigateTo({
			url: "/pages/worddetail/worddetail?id=" + id + "&type=" + props.type
		})
	}
</script>

<style lang="scss" scoped>
	.wordlist {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 0 10px 10px 10px;

		.worditem {
			background-color: white;
			padding: 10px;
			border-radius: 4px;

			.body {
				margin-top: 5px;
			}

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