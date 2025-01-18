<template>
	<view style="min-height: 100vh;background-color: #f5f5f5;display: flex;flex-direction: column;">
		<NavBar title="快速背词" style="background-color: white;"></NavBar>
		<view v-if="wordList.length==0" class="learnsuccess">
			<wd-icon style="margin-top: 40px;" name="check-circle-filled" size="80px" color="#34D19D"></wd-icon>
			<text>{{total}}个单词背诵完成！赶紧默写吧！</text>
			<view style="display: flex;gap: 15px;margin-top: 40px;">
				<wd-button size="large" @click="startRecite">立刻默写</wd-button>
				<wd-button size="large" type="info" @click="startRecite">稍后默写</wd-button>
			</view>
		</view>
		<view v-else class="list">
			<view class="item" :key="item.id" v-for="(item,index) in wordList">
				<view class="head">
					<view class="word">{{item.kana==item.word?item.word:item.word+'【'+item.kana+'】'}}<text
							style="font-size: 14px;font-weight: 400;">{{item.tone}}</text></view>
					<wd-icon @click="clear(index)" name="delete-thin" color="#999999" size="20px"></wd-icon>
				</view>
				<view style="margin-top: 10px;">
					<view @click="item.show=false" class="explain" v-if="item.show">{{item.meaning}}</view>
					<view v-else @click="showMeaning(index)" style="position: relative;">
						<wd-skeleton :rowCol="[{height:'60px'}]" theme="paragraph" />
						<text class="show">点击查看</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import NavBar from '@/components/navbar.vue'
	import $http from "@/api/index.js"
	import {
		fastmodeStore
	} from "@/stores/index.js"
	const wordList = ref([])
	const total = ref(0)
	const clear = (index) => {
		wordList.value.splice(index, 1)
		if (wordList.value.length == 0) {
			fastmodeStore().clear()
		} else {
			fastmodeStore().setList(wordList.value)
		}
	}
	const showMeaning = (index) => {
		wordList.value.map((item, index) => {
			item.show = false
			return item
		})
		wordList.value[index].show = !wordList.value[index].show
	}
	const init = async () => {
		const todayZeroTime = new Date();
		todayZeroTime.setHours(0, 0, 0, 0);
		const timestamp = todayZeroTime.getTime();
		console.log(timestamp, fastmodeStore().time);
		if (timestamp > fastmodeStore().time) {
			const res = await $http.word.todayWord()
			wordList.value = res.data.map((item, index) => {
				item.show = false
				return item
			})
			total.value = wordList.value.length
			fastmodeStore().setTime(timestamp)
			fastmodeStore().setList(wordList.value)
		} else {
			wordList.value = fastmodeStore().wordList
		}


	}
	onMounted(() => {
		init()
	})
</script>

<style scoped lang="scss">
	.learnsuccess {
		flex: 1;
		background-color: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 15px;

		text {
			color: $uni-text-color-grey;
		}
	}

	.list {
		margin-top: 10px;
		display: flex;
		flex-direction: column;
		gap: 10px;

		.item {
			background-color: white;
			padding: 10px;

			.explain {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 60px;
				background-color: #eeeeee;
				color: $uni-text-color-grey;
				padding: 10px;
				box-sizing: border-box;
				border-radius: 4px;
			}

			.show {
				position: absolute;
				top: 50%;
				transform: translateY(-50%) translateX(-50%);
				left: 50%;
				color: $uni-text-color-grey;
			}

			.head {
				display: flex;
				align-items: center;
				justify-content: space-between;



				.word {
					display: flex;
					align-items: center;
					font-size: 18px;
					font-weight: bold;
				}
			}

		}
	}
</style>