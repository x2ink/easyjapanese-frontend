<template>
	<scroll-view @scroll="scroll" scroll-y="true" style="height: 100vh;">
		<view>
			<NavbarDefault title="修订历史"></NavbarDefault>
			<view class="content">
				<view :key="item.id" v-for="item in List" class="revision-item">
					<view class="revision-header">
						<uv-avatar size="40" :src="item.user.avatar"></uv-avatar>
						<view class="user-info">
							<view class="user-name">{{item.user.nickname}}</view>
							<view class="revision-time">{{dayjs(item.created_at).format("YYYY-MM-DD HH:ss")}}</view>
						</view>
					</view>
					<view class="revision-content" v-html="item.comment">
					</view>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script setup>
	import dayjs from 'dayjs'
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import NavbarDefault from "@/components/navbar/default"
	import $http from "@/api/index.js"
	const getList = async () => {
		const res = await $http.word.getEditHistory({
			word_id: wordId.value,
			page: page.value,
			page_size: size.value
		})
		total.value = res.total
		if (total.value === 0) {
			return
		}
		List.value = List.value.concat(res.data)
	}
	const total = ref(null)
	const page = ref(1)
	const size = ref(20)
	const List = ref([])
	const wordId = ref(null)
	const scroll = () => {
		if (total.value > List.value.length) {
			++page.value
			getList()
		}
	}
	onLoad((e) => {
		if (e.wordId) {
			wordId.value = e.wordId
			getList()
		}
	})
</script>

<style>
	page {
		background-color: white;
	}
</style>

<style scoped lang="less">
	.content {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 8px 16px 0 16px;
	}

	.revision-item {
		padding-bottom: 16px;
		border-bottom: 1px solid #E0E0E0;
	}

	.revision-header {
		display: flex;
		align-items: center;
		margin-bottom: 12px;
	}

	.user-info {
		margin-left: 12px;
		flex: 1;
	}

	.user-name {
		font-size: 16px;
		color: #212121;
		font-weight: 500;
	}

	.revision-time {
		font-size: 12px;
		color: #757575;
		margin-top: 2px;
	}


	.revision-content {
		color: #393939;
		font-size: 14px;
		background-color: #FAFAFA;
		border-radius: 8px;
		padding: 12px;
	}
</style>