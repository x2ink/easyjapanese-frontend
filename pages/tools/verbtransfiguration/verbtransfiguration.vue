<template>
	<view class="container">
		<view class="head">
			<NavbarDefault title="动词变形"></NavbarDefault>
			<view class="search-wrapper">
				<view class="search-box">
					<i class="fas fa-search search-icon"></i>
					<input 
						class="search-input" 
						confirm-type="search" 
						@confirm="confirm" 
						v-model="value" 
						type="text"
						placeholder="请输入动词 (如：食べる)" 
						placeholder-class="placeholder-style"
					>
					<view class="search-btn" @click="confirm">查询</view>
				</view>
			</view>
		</view>

		<scroll-view scroll-y class="content-scroll" :enable-back-to-top="true">
			<view class="content-wrapper">
				
				<view v-if="data && data.length > 0" class="result-area">
					
					<view class="result-block main-block">
						<text class="main-label">基本形</text>
						<text class="main-word">{{ get('基本形') }}</text>
					</view>

					<view class="result-block">
						<view class="block-header">
							<text class="block-title">基础活用</text>
						</view>
						<view class="grid-container">
							<view class="grid-item">
								<view class="tag tag-blue">ます形</view>
								<text class="grid-value">{{ get('ます形') }}</text>
							</view>
							<view class="grid-item">
								<view class="tag tag-red">ない形</view>
								<text class="grid-value">{{ get('ない形') }}</text>
							</view>
							<view class="grid-item">
								<view class="tag tag-green">て形</view>
								<text class="grid-value">{{ get('て形') }}</text>
							</view>
							<view class="grid-item">
								<view class="tag tag-orange">た形</view>
								<text class="grid-value">{{ get('た形') }}</text>
							</view>
						</view>
					</view>

					<view class="result-block">
						<view class="block-header">
							<text class="block-title">态与语气</text>
						</view>
						<view class="list-container">
							<view class="list-item">
								<text class="list-label">可能形</text>
								<text class="list-value">{{ get('可能形') }}</text>
							</view>
							<view class="list-item">
								<text class="list-label">被动形</text>
								<text class="list-value">{{ get('被动形') }}</text>
							</view>
							<view class="list-item">
								<text class="list-label">使役形</text>
								<text class="list-value">{{ get('使役形') }}</text>
							</view>
							<view class="list-item">
								<text class="list-label">使役被动</text>
								<text class="list-value">{{ get('使役被动形') }}</text>
							</view>
						</view>
					</view>

					<view class="result-block">
						<view class="block-header">
							<text class="block-title">其他变形</text>
						</view>
						<view class="list-container">
							<view class="list-item">
								<text class="list-label">假定形 (ば)</text>
								<text class="list-value">{{ get('假定形') }}</text>
							</view>
							<view class="list-item">
								<text class="list-label">意向形 (よう)</text>
								<text class="list-value">{{ get('意向形') }}</text>
							</view>
							<view class="list-item">
								<text class="list-label">命令形</text>
								<text class="list-value text-danger">{{ get('命令形') }}</text>
							</view>
							<view class="list-item">
								<text class="list-label">禁止形</text>
								<text class="list-value text-danger">{{ get('禁止形') }}</text>
							</view>
						</view>
					</view>
				</view>

				<view v-else class="empty-state">
					<wd-status-tip image="search" tip="输入动词开始查询" />
					<text class="empty-sub">支持输入：基本形、ます形等</text>
				</view>
			</view>
		</scroll-view>

		<wd-toast />
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	import NavbarDefault from "@/components/navbar/default"
	import $http from "@/api/index.js"
	import { useToast } from '@/uni_modules/wot-design-uni'

	const toast = useToast()
	const data = ref([])
	const value = ref('')

	const get = (key) => {
		if (!data.value) return '-'
		const res = data.value.find(({ category }) => category == key)
		return res ? res.result : '-'
	}

	const confirm = async () => {
		try {
			if (value.value.trim().length == 0) {
				toast.warning(`请输入要查询的单词`)
				return
			}
			toast.loading("正在变形中...")

			const res = await $http.common.getVerbTrans({
				word: value.value.trim()
			})

			if (res.data && res.data.length > 0) {
				data.value = res.data
				toast.close()
			} else {
				toast.warning("未查询到该词的变形信息")
				data.value = []
			}
		} catch (err) {
			console.error(err)
			toast.warning(`查询失败或该词不是动词`)
			data.value = []
		}
	}
</script>

<style>
	
	page {
		background-color: #ffffff;
		height: 100%;
		overflow: hidden;
	}
</style>

<style lang="scss" scoped>
	.container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
	}

	.head {
		
		background: #ffffff;
		flex-shrink: 0;
		z-index: 10;
	}

	.search-wrapper {
		padding: 12rpx 40rpx 24rpx; 
		background: #ffffff;
	}

	.search-box {
		display: flex;
		align-items: center;
		background: #f7f8fa; 
		border-radius: 200rpx;
		padding: 0 32rpx;
		height: 88rpx; 
		transition: background-color 0.2s;
		
		&:focus-within {
			background: #f0f2f5; 
		}
	}

	.search-icon {
		font-size: 32rpx;
		color: #999;
		margin-right: 20rpx;
	}

	.search-input {
		flex: 1;
		height: 100%;
		font-size: 30rpx;
		color: #333;
	}

	.placeholder-style {
		color: #bbb;
	}

	.search-btn {
		font-size: 30rpx;
		color: #07C160;
		font-weight: 600;
		padding-left: 24rpx;
		margin-left: 16rpx;
		
		position: relative;
		
		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 50%;
			transform: translateY(-50%);
			height: 28rpx;
			width: 2rpx;
			background-color: #e0e0e0;
		}
		
		&:active {
			opacity: 0.7;
		}
	}

	.content-scroll {
		flex: 1;
		height: 0;
	}

	.content-wrapper {
		padding: 24rpx 40rpx 80rpx; 
	}

	
	.result-block {
		background-color: #f7f8fa; 
		border-radius: 32rpx;
		padding: 32rpx;
		margin-bottom: 40rpx;
	}

	.block-header {
		margin-bottom: 24rpx;
		padding-left: 8rpx;
	}

	.block-title {
		font-size: 28rpx;
		color: #999;
		font-weight: 600;
	}

	
	.main-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 48rpx 32rpx;
		background-color: #f0fdf4; 
		
	}

	.main-label {
		font-size: 24rpx;
		color: #07C160;
		opacity: 0.8;
		margin-bottom: 12rpx;
		letter-spacing: 2rpx;
	}

	.main-word {
		font-size: 64rpx;
		font-weight: bold;
		color: #333;
		letter-spacing: 2rpx;
	}

	
	.grid-container {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 24rpx;
	}

	.grid-item {
		background-color: #ffffff; 
		padding: 24rpx;
		border-radius: 24rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		
	}

	.tag {
		font-size: 22rpx;
		padding: 4rpx 16rpx;
		border-radius: 12rpx;
		margin-bottom: 12rpx;
		font-weight: 500;
	}

	
	.tag-blue { background: #e6f7ff; color: #0099ff; }
	.tag-red { background: #fff1f0; color: #ff4d4f; }
	.tag-green { background: #f6ffed; color: #52c41a; }
	.tag-orange { background: #fff7e6; color: #fa8c16; }

	.grid-value {
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
	}

	
	.list-container {
		display: flex;
		flex-direction: column;
		gap: 20rpx; 
	}

	.list-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 28rpx 32rpx;
		background-color: #ffffff; 
		border-radius: 24rpx;
	}

	.list-label {
		font-size: 28rpx;
		color: #666;
	}

	.list-value {
		font-size: 32rpx;
		color: #333;
		font-weight: 500;
	}

	.text-danger {
		color: #ff4d4f;
	}

	
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 120rpx;
	}

	.empty-sub {
		font-size: 26rpx;
		color: #ccc;
		margin-top: 16rpx;
	}
</style>