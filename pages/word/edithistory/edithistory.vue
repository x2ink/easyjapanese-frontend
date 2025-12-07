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

			<view v-if="total === 0" style="padding-top: 80rpx;">
				<wd-status-tip :image-size="{ height: 128, width: 128 }"
					image="https://jpx2ink.oss-cn-shanghai.aliyuncs.com/images/image/empty.png" tip="暂无修订历史" />
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

	const total = ref(null) 
	const page = ref(1)
	const size = ref(20)
	const List = ref([])
	const wordId = ref(null)

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
		gap: 32rpx;
		padding: 16rpx 32rpx 0 32rpx;
	}

	.revision-item {
		padding-bottom: 32rpx;
		border-bottom: 2rpx solid #E0E0E0;
	}

	.revision-header {
		display: flex;
		align-items: center;
		margin-bottom: 24rpx;
	}

	.user-info {
		margin-left: 24rpx;
		flex: 1;
	}

	.user-name {
		font-size: 32rpx;
		color: #212121;
		font-weight: 500;
	}

	.revision-time {
		font-size: 24rpx;
		color: #757575;
		margin-top: 4rpx;
	}


	.revision-content {
		color: #393939;
		font-size: 28rpx;
		background-color: #FAFAFA;
		border-radius: 16rpx;
		padding: 24rpx;
	}
</style>