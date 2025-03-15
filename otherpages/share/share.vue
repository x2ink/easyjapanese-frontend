<template>
	<view>
		<Navbar title="分享"></Navbar>
		<view style="padding:10px 15px;">
			<wd-segmented :options="list" v-model:value="current"></wd-segmented>
		</view>
		<view v-if="current=='海报'" class="poster _GCENTER">
			<image style="width: 200px;border-radius: 8px;" src="http://jp.x2.ink/images/poster.png" mode="widthFix">
			</image>
		</view>
		<view v-else class="poster">
			<wd-textarea v-model="shareContent" placeholder="请填写内容" />
			<view style="display: flex;justify-content: flex-end;">
				<wd-icon @click="copy()" name="file-copy" size="20px"></wd-icon>
			</view>
		</view>
		<view style="font-size: 14px;color: #999;text-align: center;margin-top: 20px;">分享至</view>
		<view class="way">
			<view class="_GCENTER">
				<image src="http://jp.x2.ink/images/share/wx.png" mode="aspectFit"></image>
				<text>微信好友</text>
			</view>
			<view class="_GCENTER">
				<image src="http://jp.x2.ink/images/share/pyq.png" mode="aspectFit"></image>
				<text>朋友圈</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import Navbar from '@/components/navbar/navbar.vue';
	const list = ref(['海报', '文字'])
	const current = ref('点赞')
	const shareContent = ref(`这是分享内容`)
	const copy = () => {
		uni.setClipboardData({
			data: shareContent.value,
			showToast: false,
			success() {
				toast.success(`复制成功`)
			}
		});
	}
</script>

<style scoped lang="scss">
	.poster {
		padding: 20px;
		background-color: white;
		margin: 5px 15px;
		border-radius: 8px;
	}

	.way {
		display: flex;
		background-color: white;
		margin: 15px;
		border-radius: 8px;
		padding: 10px;
		justify-content: space-around;
		align-items: center;

		>view {
			gap: 10px;
			image {
				width: 35px;
				height: 35px;
			}
			text{
				font-size: 14px;
				color: #999;
			}
		}
	}
</style>