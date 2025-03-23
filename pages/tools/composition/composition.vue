<template>
	<view>
		<Navbar title="写作真题">
		</Navbar>
		<view class="list">
			<view :key="item.id" class="item"
				@click="goPage('/pages/tools/compositiondetail/compositiondetail',{id:item.id})" v-for="item in List">
				<view class="head">
					{{item.title}}
				</view>
				<view class="body">
					{{item.topic}}
				</view>
				<view class="noticetag">#{{item.tag}}</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import Navbar from '@/components/navbar/navbar.vue';
	import {
		onLoad,
		onShow,
		onUnload,
		onReachBottom
	} from "@dcloudio/uni-app"
	import $http from "@/api/index.js"
	import {
		goPage
	} from "@/utils/common.js"
	const total = ref(0)
	const page = ref(1)
	const size = ref(10)
	const List = ref([])
	const getList = async () => {
		const res = await $http.common.getCompositionList(page.value, size.value)
		total.value = res.total
		List.value = List.value.concat(res.data);
	}
	onReachBottom(() => {
		if (total.value > List.value.length) {
			++page.value
			getList()
		}
	})
	onLoad((op) => {
		getList()
	})
</script>

<style scoped lang="scss">
	:deep(.wd-tabs__nav-item) {
		font-size: 16px;
	}


	:deep(.wd-tabs) {
		background-color: transparent !important;
	}

	:deep(.wd-tabs__nav) {
		background-color: transparent !important;
	}

	.list {
		margin: 0 15px 15px;
		display: flex;
		flex-direction: column;
		gap: 15px;

		.item {
			padding: 15px;
			border-radius: 8px;
			background-color: white;

			.head {
				font-size: 16px;
				font-weight: bold;
			}

			.body {
				margin-top: 5px;
				font-size: 14px;
				color: #999;
			}
		}

		.noticetag {
			margin-top: 5px;
			text-align: right;
			color: #5880F2;
			font-size: 12px;
		}
	}
</style>