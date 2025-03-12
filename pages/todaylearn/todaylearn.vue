<template>
	<view>
		<NavBar title="今日学习" style="background-color: #f3f3f5;">
			<template #right>
				<view @click="goPage('writefrommemory')" class="swap">
					<wd-icon name="edit" size="18px"></wd-icon>
					<text>默写</text>
				</view>
			</template>
			<template #bottom>
				<wd-tabs slidable custom-class="tabs" v-model="currentTab">
					<block v-for="(item,index) in tabList" :key="item.name">
						<wd-tab :title="item.name">
						</wd-tab>
					</block>
				</wd-tabs>
			</template>
		</NavBar>
		<view class="list">
			<view class="item" @click="getInfo(item.id)" :key="item.id" v-for="(item,index) in array">
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
		<view class="noResult" v-if="showEmpty">
			<wd-status-tip image="content" tip="暂无内容" />
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed
	} from 'vue'
	import $http from "@/api/index.js"
	import NavBar from '@/components/navbar.vue'
	import {
		todaylearnStore
	} from '@/stores/index.js'
	const showEmpty = computed(() => {
		if (loading.value) {
			return false
		} else {
			return array.value.length == 0
		}

	})
	const List = ref([])
	const currentTab = ref(0)
	const tabList = ref([{
		name: "全部",
		id: 0
	}, {
		name: "已默写",
		id: 1
	}, {
		name: "未默写",
		id: 2
	}])
	const array = computed(() => {
		if (currentTab.value == 0) {
			return List.value.sort((a, b) => {
				if (a.done === b.done) {
					return 0;
				}
				return a.done ? 1 : -1;
			});
		} else if (currentTab.value == 1) {
			return List.value.filter(item => item.done)
		} else {
			return List.value.filter(item => !item.done)
		}
	})
	const loading = ref(true)
	const getList = async () => {
		const midnightTimestamp = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
		const res = await $http.word.writeFromMemory()
		loading.value = false
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
	:deep(.segmented) {}

	.swap {
		display: flex;
		align-items: center;
		gap: 5px;

		text {
			font-size: 14px;
		}
	}

	:deep(.wd-tabs__nav) {
		height: 30px;
		background-color: transparent !important;
	}

	:deep(.wd-tabs__nav-item) {
		height: 30px;
		align-items: initial;
	}

	:deep(.wd-tabs__line) {
		// bottom: 0;
	}

	:deep(.wd-tabs) {
		background-color: transparent !important;
	}

	:deep(.space) {
		margin-left: 5px;
	}

	.list {
		margin: 5px 15px 15px 15px;
		display: flex;
		flex-direction: column;
		gap: 15px;
		padding-bottom: 15px;

		.item {
			padding: 15px;
			background-color: white;
			border-radius: 8px;

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