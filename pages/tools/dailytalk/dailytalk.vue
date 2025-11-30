<template>
	<view>
		<view class="head">
			<NavbarDefault border title="日常会话"></NavbarDefault>
		</view>
		<div class="conversation-list">
			<div v-for="item in List" :key="item.id" class="conversation-item">
				<div class="japanese-phrase">{{item.ja}}</div>
				<div class="chinese-meaning">{{item.ch}}</div>
			</div>
		</div>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		onLoad,
		onReachBottom,
		onPageScroll,
	} from "@dcloudio/uni-app"
	import {
		goPage,
	} from "@/utils/common.js"
	import NavbarDefault from "@/components/navbar/default"
	import $http from "@/api/index.js"
	const scrollTop = ref(0)
	onPageScroll((e) => {
		scrollTop.value = e.scrollTop
	})
	onReachBottom(() => {
		if (total.value > List.value.length) {
			++page.value
			getList()
		}
	})
	const page = ref(1)
	const size = ref(20)
	const total = ref(0)
	const List = ref([])
	const getList = async () => {
		const res = await $http.common.getDailyTalk(page.value, size.value)
		total.value = res.total
		List.value = List.value.concat(res.data)
	}
	onLoad((e) => {
		getList()
	})
</script>

<style lang="scss" scoped>
	.head {
		position: sticky;
		top: 0;
		z-index: 9;
	}

	.conversation-list {
		flex: 1;
		padding: 16px;
	}

	.conversation-item {
		background-color: white;
		border-radius: 8px;
		padding: 16px;
		margin-bottom: 12px;
	}

	.japanese-phrase {
		font-size: 16px;
		font-weight: 500;
		color: #212121;
		margin-bottom: 4px;
	}

	.japanese-reading {
		font-size: 14px;
		color: #757575;
		margin-bottom: 8px;
	}

	.chinese-meaning {
		font-size: 14px;
		color: #424242;
		padding-top: 8px;
		border-top: 1px dashed #f0f0f0;
	}
</style>