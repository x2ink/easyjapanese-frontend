<template>
	<view class="wordlist">
		<view class="worditem" @click="getInfo(item.id)" :key="item.id" v-for="item in list">
			<view class="head">
				<p>{{item.word}}{{item.word!=item.kana?'['+item.kana+']':''}}</p>
				<wd-icon name="sound" size="22px"></wd-icon>
			</view>
			<wd-text size="14px" :lines="2" class="body" color="#999" :text="item.meaning.join('\n')"></wd-text>
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
		}
	})
	const getInfo = (id) => {
		uni.navigateTo({
			url: "/pages/worddetail/worddetail?id=" + id
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
			border-radius: $uni-border-radius-base;

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