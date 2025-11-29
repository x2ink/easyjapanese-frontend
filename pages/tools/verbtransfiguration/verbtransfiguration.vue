<template>
	<view class="page-container">

		<view class="head">
			<NavbarDefault border title="动词变形"></NavbarDefault>
			<view class="search-wrapper">
				<view class="search-box">
					<text class="fas fa-search search-icon"></text>
					<input class="search-input" confirm-type="search" @confirm="confirm" v-model="value" type="text"
						placeholder="请输入动词">
					<view class="search-btn" @click="confirm">查询</view>
				</view>
			</view>
		</view>

		<scroll-view scroll-y class="content-container">
			<view v-if="data && data.length > 0" class="result-wrapper">

				<view class="main-card">
					<view class="main-label">基本形 (辞書形)</view>
					<view class="main-word">{{ get('基本形') }}</view>
				</view>

				<view class="section-title">基础活用</view>
				<view class="grid-container">
					<view class="grid-item">
						<text class="grid-label tag-blue">ます形</text>
						<text class="grid-value">{{ get('ます形') }}</text>
					</view>
					<view class="grid-item">
						<text class="grid-label tag-red">ない形</text>
						<text class="grid-value">{{ get('ない形') }}</text>
					</view>
					<view class="grid-item">
						<text class="grid-label tag-green">て形</text>
						<text class="grid-value">{{ get('て形') }}</text>
					</view>
					<view class="grid-item">
						<text class="grid-label tag-orange">た形</text>
						<text class="grid-value">{{ get('た形') }}</text>
					</view>
				</view>

				<view class="section-title">态与语气</view>
				<view class="list-card">
					<view class="list-row">
						<view class="row-label">可能形</view>
						<view class="row-value">{{ get('可能形') }}</view>
					</view>
					<view class="list-row">
						<view class="row-label">被动形 (受身)</view>
						<view class="row-value">{{ get('被动形') }}</view>
					</view>
					<view class="list-row">
						<view class="row-label">使役形</view>
						<view class="row-value">{{ get('使役形') }}</view>
					</view>
					<view class="list-row">
						<view class="row-label">使役被动</view>
						<view class="row-value">{{ get('使役被动形') }}</view>
					</view>
				</view>

				<view class="section-title">其他变形</view>
				<view class="list-card">
					<view class="list-row">
						<view class="row-label">假定形 (ば形)</view>
						<view class="row-value">{{ get('假定形') }}</view>
					</view>
					<view class="list-row">
						<view class="row-label">意向形 (よう形)</view>
						<view class="row-value">{{ get('意向形') }}</view>
					</view>
					<view class="list-row">
						<view class="row-label">命令形</view>
						<view class="row-value text-danger">{{ get('命令形') }}</view>
					</view>
					<view class="list-row border-none">
						<view class="row-label">禁止形</view>
						<view class="row-value text-danger">{{ get('禁止形') }}</view>
					</view>
				</view>

				<view style="height: 40px;"></view>
			</view>

			<view v-else class="empty-state">
				<image src="https://img.yzcdn.cn/vant/custom-empty-image.png" mode="aspectFit" class="empty-img">
				</image>
				<text class="empty-text">输入动词开始查询变形</text>
				<text class="empty-sub">支持输入：基本形、ます形</text>
			</view>
		</scroll-view>

		<wd-toast />
	</view>
</template>

<script setup>
	import {
		ref,
	} from 'vue'
	import NavbarDefault from "@/components/navbar/default"
	import $http from "@/api/index.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'

	const toast = useToast()
	const data = ref([])
	const value = ref('')

	const get = (key) => {
		if (!data.value) return '-'
		const res = data.value.find(({
			category
		}) => category == key)
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

<style lang="scss" scoped>
	.page-container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #F7F8FA;
		overflow: hidden;
	}

	.head {
		background: #fff;
		z-index: 99;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
		flex-shrink: 0;
	}

	.search-wrapper {
		padding: 12px 16px 16px;
		background: #fff;
	}


	.search-box {
		display: flex;
		align-items: center;
		background: #F5F5F5;
		border-radius: 50px;
		box-sizing: border-box;
		padding: 0 16px;
		height: 40px;
	}

	.search-icon {
		font-size: 16px;
		color: #999;
		margin-right: 8px;
	}

	.search-input {
		height: 40px;
		line-height: 40px;
		flex: 1;
		box-sizing: border-box;
		font-size: 14px;
		color: #333;

	}

	.placeholder-style {
		color: #BBB;
	}

	.search-btn {
		font-size: 14px;
		color: #07C160;
		font-weight: 600;
		padding-left: 12px;
		border-left: 1px solid #E0E0E0;
		margin-left: 8px;
		/* 垂直居中对齐 */
		line-height: 20px;
	}

	.content-container {
		flex: 1;
		height: 0;
		padding: 16px;
		box-sizing: border-box;
	}

	.result-wrapper {
		animation: fadeIn 0.5s ease;
	}

	.main-card {
		background: linear-gradient(135deg, #07C160 0%, #05A050 100%);
		border-radius: 12px;
		padding: 24px;
		color: white;
		text-align: center;
		margin-bottom: 24px;
		box-shadow: 0 4px 12px rgba(7, 193, 96, 0.2);
	}

	.main-label {
		font-size: 12px;
		opacity: 0.8;
		margin-bottom: 8px;
		letter-spacing: 1px;
	}

	.main-word {
		font-size: 32px;
		font-weight: 700;
		letter-spacing: 1px;
	}

	.section-title {
		font-size: 14px;
		color: #999;
		margin-bottom: 12px;
		margin-left: 4px;
		font-weight: 500;
	}

	.grid-container {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
		margin-bottom: 24px;
	}

	.grid-item {
		background: white;
		padding: 16px;
		border-radius: 12px;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
	}

	.grid-label {
		font-size: 12px;
		padding: 2px 8px;
		border-radius: 4px;
		margin-bottom: 8px;
		font-weight: 500;
	}

	.tag-blue {
		background: #E6F7FF;
		color: #1890FF;
	}

	.tag-red {
		background: #FFF1F0;
		color: #F5222D;
	}

	.tag-green {
		background: #F6FFED;
		color: #52C41A;
	}

	.tag-orange {
		background: #FFF7E6;
		color: #FA8C16;
	}

	.grid-value {
		font-size: 18px;
		font-weight: 600;
		color: #333;
	}

	.list-card {
		background: white;
		border-radius: 12px;
		padding: 0 16px;
		margin-bottom: 24px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
	}

	.list-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px 0;
		border-bottom: 1px solid #F5F5F5;

		&.border-none {
			border-bottom: none;
		}
	}

	.row-label {
		font-size: 14px;
		color: #666;
	}

	.row-value {
		font-size: 16px;
		color: #333;
		font-weight: 500;
	}

	.text-danger {
		color: #FF4D4F;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 60px;
	}

	.empty-img {
		width: 80px;
		height: 80px;
		margin-bottom: 16px;
		opacity: 0.5;
	}

	.empty-text {
		font-size: 16px;
		color: #333;
		margin-bottom: 8px;
		font-weight: 500;
	}

	.empty-sub {
		font-size: 12px;
		color: #999;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>