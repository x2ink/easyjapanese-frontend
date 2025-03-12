<template>
	<view>
		<NavBar title="等待复习" style="background-color: #f3f3f5;">
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
		<view class="noResult" v-if="showEmpty">
			<wd-status-tip image="content" tip="还没有需要复习的单词" />
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
	const showEmpty = computed(() => {
		if (loading.value) {
			return false
		} else {
			return List.value.length == 0
		}
	})
	const List = ref([])
	const loading = ref(true)
	const getList = async () => {
		const res = await $http.word.getTodayReview()
		List.value = res.data
		loading.value = false
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