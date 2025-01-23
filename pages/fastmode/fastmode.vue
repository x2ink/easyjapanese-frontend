<template>
	<view style="min-height: 100vh;background-color: #f5f5f5;display: flex;flex-direction: column;">
		<NavBar title="快速背词" style="background-color: white;">
			<template #right>
				<wd-icon @click="openPlan()" name="setting1" size="25px"></wd-icon>
			</template>
		</NavBar>
		<view v-if="wordList.length==0&&!loading" class="learnsuccess">
			<wd-icon style="margin-top: 40px;" name="check-circle-filled" size="80px" color="#34D19D"></wd-icon>
			<text>{{total}}个单词背诵完成！赶紧默写吧！</text>
			<view style="display: flex;gap: 15px;margin-top: 40px;">
				<wd-button size="large" @click="goPage('todaylearn')">立刻默写</wd-button>
				<wd-button size="large" type="info" @click="init()">再来一组</wd-button>
			</view>
		</view>
		<view v-else class="list">
			<view class="item" :key="item.id" v-for="(item,index) in wordList">
				<view class="head">
					<view class="wordinfo">
						<view class="wordkana">
							<view class="word">
								{{item.kana==item.word?item.word:item.word+'【'+item.kana+'】'}}<text
									style="font-size: 14px;font-weight: 400;">{{item.tone}}</text>
							</view>
							<wd-icon name="sound" color="#999999" size="20px"></wd-icon>
						</view>
						<view class="rome">{{item.rome}}</view>
					</view>
					<view class="btns">
						<wd-button custom-class="remember" @click="clear(index,item.id)" :round="false">标熟</wd-button>
						<wd-button custom-class="remember" @click="getInfo(item.id)" type="info"
							:round="false">学习</wd-button>
					</view>
				</view>



				<view style="flex: 1;">

					<view style="margin-top: 10px;position: relative;">
						<view @click="item.show=false" class="explain">{{item.meaning}}</view>
						<view class="shadow" v-if="item.show==false" @click="showMeaning(index)">
							<text class="show">点击查看</text>
						</view>
					</view>
				</view>

				<!-- <view class="btns">
					<wd-button custom-class="btn" :round="false">主要按钮</wd-button>
					<wd-button custom-class="btn" :round="false" >信息按钮</wd-button>
				</view> -->
			</view>
		</view>
		<!-- 修改计划 -->
		<Setplan ref="setPlanRef" @change="changePlan"></Setplan>
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
	import Setplan from "@/components/setplan.vue"
	const setPlanRef = ref(null)
	const wordList = ref([])
	const total = ref(0)
	const doneId = ref([])
	const openPlan = () => {
		setPlanRef.value.show = true
	}
	const goPage = (path) => {
		uni.redirectTo({
			url: `/pages/${path}/${path}`
		})
	}
	const getInfo = (id) => {
		uni.navigateTo({
			url: "/pages/worddetail/worddetail?id=" + id + "&type=jc"
		})
	}
	const clear = (index, id) => {
		record(id)
		wordList.value.splice(index, 1)
		if (wordList.value.length == 0) {
			fastmodeStore().clear()
		} else {
			fastmodeStore().setList(wordList.value)
		}
	}
	const record = async (id) => {
		const res = await $http.word.recordlearn({
			words: [id]
		})
	}
	const showMeaning = (index) => {
		wordList.value.map((item, index) => {
			item.show = false
			return item
		})
		wordList.value[index].show = !wordList.value[index].show
	}
	const loading = ref(true)
	const changePlan = async (e) => {
		if (e.mode == "学习模式") {
			uni.redirectTo({
				url: "/pages/learn/learn"
			})
		} else {
			fastmodeStore().clear()
			const todayZeroTime = new Date();
			todayZeroTime.setHours(0, 0, 0, 0);
			const timestamp = todayZeroTime.getTime();
			const res = await $http.word.todayWord()
			wordList.value = res.data.map((item, index) => {
				item.show = false
				return item
			})
			fastmodeStore().setTime(timestamp)
			fastmodeStore().setList(wordList.value)
			total.value = wordList.value.length
			loading.value = false
		}
	}
	const init = async () => {
		const todayZeroTime = new Date();
		todayZeroTime.setHours(0, 0, 0, 0);
		const timestamp = todayZeroTime.getTime();
		if (timestamp > fastmodeStore().time) {
			const res = await $http.word.todayWord()
			wordList.value = res.data.map((item, index) => {
				item.show = false
				return item
			})
			fastmodeStore().setTime(timestamp)
			fastmodeStore().setList(wordList.value)
		} else {
			wordList.value = fastmodeStore().wordList
		}
		total.value = wordList.value.length
		loading.value = false
	}
	onMounted(() => {
		init()
	})
</script>

<style scoped lang="scss">
	// :deep(.btn) {
	// 	width: 50%;
	// }

	// .btns {
	// 	display: flex;
	// 	gap: 10px;
	// 	margin-top: 10px;
	// }
	:deep(.remember) {
		width: 60px !important;
		height: 25px !important;
		min-width: inherit !important;
	}

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

			.head {
				height: 55px;
				display: flex;

				.btns {
					width: 80px;
					display: flex;
					flex-direction: column;
					gap: 5px;
				}

				.wordinfo {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.rome {}

					.wordkana {
						display: flex;
						align-items: center;
						justify-content: space-between;



						.word {
							display: flex;
							align-items: center;
							font-size: 20px;
							font-weight: bold;
						}
					}
				}
			}





			.shadow {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background-color: #eeeeee;
			}

			.explain {
				display: flex;
				align-items: center;
				justify-content: center;
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



		}
	}
</style>