<template>

	<view class="banner bg" @click="goPage('fiftysounds')">
		<view>
			<text>五十音学习</text>
			<wd-icon name="arrow-right" size="25px" color="#fff"></wd-icon>
		</view>
	</view>
	<view class="list">
		<view @click="goPage('grammar')" class="item _GCENTER">
			<p>语法学习</p>
		</view>
		<view class="item  _GCENTER">
			<p>常用词汇</p>
		</view>
		<view @click="goPage('radiostation')" class="item _GCENTER">
			<p>学习电台</p>
		</view>
	</view>

	<!-- 	<view class="wrap">
		<view style="display: flex;align-items: center;justify-content: space-between;">
			<p class="title">教材</p>
			<view class="more">
				<p>更多</p>
				<wd-icon color="#999" name="arrow-right" size="16px"></wd-icon>
			</view>
		</view>
		<scroll-view class="scroll-view_H" scroll-x="true">
			<img class="bookitem" v-for="_ in 10" alt=""
				src="https://static-cse.canva.cn/blob/352230/1003w-olh3HW7GiQY.3e89ead4.jpg" />
		</scroll-view>
	</view> -->
	<view class="paper">
		<view class="item" v-for="_ in 10">
			<p class="time">2024</p>
			<view class="topic" v-for="_ in 5">
				<p>2024年真题</p>
				<wd-button custom-class="btn" size="small">详情</wd-button>
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
		onLoad
	} from '@dcloudio/uni-app'
	import Statusbar from "@/components/statusbar.vue"
	const goPage = (path, params) => {
		if (params) {
			uni.navigateTo({
				url: `/pages/${path}/${path}${params}`
			})
		} else {
			uni.navigateTo({
				url: `/pages/${path}/${path}`
			})
		}
	}
</script>

<style lang="scss" scoped>
	:deep(.btn) {
		margin: 0 !important;
	}

	.list {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 10px;
		padding:0 15px;
		.item {
			background-color: #f5f5f5;
			aspect-ratio: 16/9;
			padding: 10px;
			box-sizing: border-box;
			border-radius: $uni-border-radius-base;
			color: #000;
			font-weight: bold;
		}
	}

	.bg {
		background-position: center;
		background-size: 100% 100%;
	}

	.paper {
		margin: 15px;
		display: flex;
		flex-direction: column;
		gap: 15px;

		.time {
			font-size: 18px;
			font-weight: bold;
		}

		.topic {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10px;
			border-radius: $uni-border-radius-base;
			background-color: white;
			margin: 5px 0;
		}
	}

	.banner {
		background-image: url('/static/fiftysounds.png');
		aspect-ratio: 16/9;
		margin: 15px;
		border-radius: $uni-border-radius-base;
		position: relative;
		overflow: hidden;

		>view {
			color: #fff;
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			line-height: 40px;
			background-color: rgba(223, 142, 139, 0.6);
			padding: 0 10px;
			box-sizing: border-box;
			font-size: 18px;
			font-weight: bold;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}

	.more {
		display: flex;
		align-items: center;
		font-size: $uni-font-size-base;
		color: $uni-text-color-grey;
	}

	.scroll-view_H {
		padding-top: 10px;
		white-space: nowrap;
		width: 100%;

		.bookitem {
			width: 80px;
			margin: 0 5px;
			display: inline-block;
			border-radius: $uni-border-radius-base;
			aspect-ratio: 3/4;
			object-fit: cover;
		}
	}

	.title {
		font-size: $uni-font-size-lg;
		font-weight: bold;
	}

	.wrap {
		background-color: white;
		margin: 10px;
		padding: 10px;
		border-radius: $uni-border-radius-base;
	}
</style>