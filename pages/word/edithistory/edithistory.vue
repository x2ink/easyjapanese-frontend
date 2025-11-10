<template>
	<view style="height: 100vh;overflow: auto;">
		<NavbarDefault title="修订历史"></NavbarDefault>
		<view class="content">
			<view class="revision-item">
				<view class="revision-header">
					<uv-avatar size="40" src="null"></uv-avatar>
					<view class="user-info">
						<view class="user-name">日语初学者</view>
						<view class="revision-time">2023-10-13 16:12</view>
					</view>
					<view class="status-badge status-rejected">已拒绝</view>
				</view>
				<view class="revision-content">
					修订了呜呜呜我我我
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
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import NavbarDefault from "@/components/navbar/default"
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

	.status-badge {
		padding: 4px 8px;
		border-radius: 12px;
		font-size: 12px;
		font-weight: 500;
	}

	.status-rejected {
		background-color: #FFEBEE;
		color: #F44336;
	}

	.revision-content {
		color: #393939;
		font-size: 14px;
		background-color: #FAFAFA;
		border-radius: 8px;
		padding: 12px;
	}
</style>