<template>
	<view style="background-color: #f5f5f5;min-height: 100vh;">
		<NavBar title="今日学习" style="background-color: white;">
			<template #right>
				<wd-button @click="goPage('writefrommemory')" type="primary" size="small">默写</wd-button>
			</template>
		</NavBar>
		<view class="list">
			<view class="item" @click="getInfo(item.id)" :key="item.id" v-for="(item,index) in List">
				<view class="head">
					<view class="word">{{item.kana==item.word?item.word:item.word+'【'+item.kana+'】'}}<text
							style="font-size: 14px;font-weight: 400;">{{item.tone}}</text>
						<wd-tag v-if="item.done" custom-class="space" type="success">已默写</wd-tag>
						<wd-tag v-else custom-class="space">未默写</wd-tag>
					</view>
				</view>
				<view class="explain">{{item.meaning}}</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import $http from "@/api/index.js"
	import NavBar from '@/components/navbar.vue'
	import {
		todaylearnStore
	} from '@/stores/index.js'
	const List = ref([])
	const getList = async () => {
		const midnightTimestamp = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
		const res = await $http.word.writeFromMemory()
		if (midnightTimestamp > todaylearnStore().time) {
			List.value = res.data
			todaylearnStore().setList(res.data)
			todaylearnStore().setTime(midnightTimestamp)
		} else {
			res.data.forEach(item => {
				if (!isIdExist(item.id)) {
					todaylearnStore().unshift(item)
				}
			})
			List.value = todaylearnStore().wordList
		}
	}
	const isIdExist = (id) => {
		return todaylearnStore().wordList.some(item => item.id === id);
	}
	const goPage = (path) => {
		uni.navigateTo({
			url: `/pages/${path}/${path}`
		})
	}
	const getInfo = (id) => {
		uni.navigateTo({
			url: "/pages/worddetail/worddetail?id=" + id + "&type=jc"
		})
	}
	onMounted((e) => {
		getList()
	})
</script>

<style scoped lang="scss">
	:deep(.space) {
		margin-left: 5px;
	}

	.list {
		margin-top: 10px;
		display: flex;
		flex-direction: column;
		gap: 10px;

		.item {
			padding: 10px;
			background-color: white;

			.explain {
				margin-top: 5px;
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