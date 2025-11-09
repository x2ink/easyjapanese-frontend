<template>
	<view style="height: 100vh;overflow: auto;">
		<NavbarDefault title="编辑单词"></NavbarDefault>
		<view style="padding:8px 16px 16px 16px;">
			<view class="section-title">
				<text class="fas fa-book"></text>
				基本信息
			</view>
			<view class="input">
				<view class="title">
					单词（多个异体字请用“，”分割）
				</view>
				<view class="card">
					<input type="text" placeholder="请输入单词如：筆跡，筆蹟">
				</view>
			</view>
			<view style="display: flex;align-items: center;gap: 16px;margin-top: 8px;">
				<view class="input">
					<view class="title">
						假名
					</view>
					<view class="card">
						<input type="text" placeholder="请输入假名">
					</view>
				</view>
				<view class="input">
					<view class="title">
						音调
					</view>
					<view class="card">
						<input type="text" placeholder="请输入音调">
					</view>
				</view>
			</view>
			<view class="input" style="margin-top: 8px;">
				<view class="title">
					简明释义
				</view>
				<view class="card">
					<input type="text" placeholder="请输入简明释义">
				</view>
			</view>
			<view class="section-title" style="margin-top: 16px;">
				<text class="fas fa-list"></text>
				详细释义
			</view>
			<view style="display: flex;gap: 8px;margin-top: 8px;flex-direction: column;">
				<view style="display: flex;align-items: center;justify-content: space-between;">
					<view class="title">
						释义1
					</view>
					<text style="color: #F44336;" class="fa-solid fa-trash"></text>
				</view>
				<view class="input">
					<view class="title">
						词性
					</view>
					<view class="card">
						<input type="text" placeholder="请输入词性">
					</view>
				</view>
				<view class="input">
					<view class="title">
						释义
					</view>
					<view class="card">
						<textarea placeholder="请输入释义"></textarea>
					</view>
				</view>
			</view>
			<button class="add-button">
				<text class="fas fa-plus"></text>
				添加释义
			</button>
			<view class="section-title" style="margin-top: 16px;">
				<text class="fas fa-list"></text>
				例句
			</view>
			<view>
				<view class="input">
					<view class="title">
						日文
					</view>
					<view class="card">
						<input type="text" placeholder="请输入日文">
					</view>
				</view>
				<view class="input" style="margin-top: 8px;">
					<view class="title">
						中文
					</view>
					<view class="card">
						<input type="text" placeholder="请输入中文">
					</view>
				</view>
			</view>
			<button class="add-button">
				<text class="fas fa-plus"></text>
				添加例句
			</button>
			<view class="history">
				<view>
					修订历史
				</view>
				<uv-avatar-group :urls="avatarUrls" size="35" gap="0.5"></uv-avatar-group>
			</view>
			<button class="submit-btn">提交修订</button>
			<view :style="{height:getOs()=='ios'?'env(safe-area-inset-bottom)':'16px'}"></view>
		</view>
	</view>
</template>

<script setup>
	import {
		getOs
	} from "@/utils/common.js"
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		onLoad,
		onReachBottom,
		onUnload,
		onShow
	} from "@dcloudio/uni-app"
	import NavbarDefault from "@/components/navbar/default"
	const avatarUrls = ref([
		'https://pic1.imgdb.cn/item/68f6fc1c3203f7be0084d93a.png',
		'https://pic1.imgdb.cn/item/68f6fc1c3203f7be0084d93a.png',
		'https://pic1.imgdb.cn/item/68f6fc1c3203f7be0084d93a.png',
		'https://pic1.imgdb.cn/item/68f6fc1c3203f7be0084d93a.png'
	])
</script>
<style>
	page {
		background-color: white;
	}
</style>
<style scoped lang="less">
	.title {
		font-size: 14px;
		font-weight: 600;
	}

	.section-title {
		font-size: 16px;
		font-weight: 600;
		color: #212121;
		margin-bottom: 12px;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.history {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		margin-top: 16px;
	}

	.section-title text {
		color: #4CAF50;
	}

	.input {
		.card {
			margin-top: 8px;
			border: 1px solid #E5E7EB;
			border-radius: 12px;
			padding: 12px 16px;

			textarea {
				width: 100%;
				overflow-y: auto;
				height: 80px;
				line-height: 20px;
			}
		}
	}

	.add-button {
		background-color: transparent;
		color: #07C160;
		border: 1px dashed #07C160;
		border-radius: 12px;
		padding: 12px 16px;
		font-size: 14px;
		width: 100%;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 8px;
		margin-top: 16px;
	}

	.submit-btn {
		margin-top: 16px;
		padding: 12px;
		background-color: #07C160;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 16px;
		font-weight: 500;
		cursor: pointer;
	}

	.submit-btn:active {
		background-color: #06AD56;
	}

	.add-button text {
		font-size: 14px;
	}
</style>