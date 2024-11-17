<template>
	<Statusbar></Statusbar>
	<view class="search">
		<wd-icon name="search" size="22px" color="#979797"></wd-icon>
		<p>搜索</p>
	</view>
	<view class="banner">
		五十音banner
	</view>
	<view class="knowledge wrap">
		<p class="title">知识点</p>
		<view class="list">
			<view class="item">
				<p>语法学习</p>
			</view>
			<view class="item">
				<p>常用词汇</p>
			</view>
			<view class="item">
				<p>学习电台</p>
			</view>
		</view>
	</view>
	<view class="wrap">
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
	</view>
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
</script>

<style lang="scss" scoped>
	:deep(.btn) {
		margin: 0 !important;
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
		background-color: white;
		aspect-ratio: 16/9;
		margin: 15px;
		border-radius: $uni-border-radius-base;
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
		margin: 15px;
		padding: 15px;
		border-radius: $uni-border-radius-base;
	}

	.knowledge {


		.list {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 10px;
			margin-top: 15px;

			.item {
				background-color: red;
				aspect-ratio: 16/9;
				padding: 10px;
				box-sizing: border-box;
				border-radius: $uni-border-radius-base;
				color: white;
				font-weight: bold;
			}
		}


	}

	.search {
		height: 45px;
		background: #EFEFEF;
		margin: 15px;
		padding: 10px;
		font-size: $uni-font-size-lg;
		box-sizing: border-box;
		border-radius: 45px;
		display: flex;
		align-items: center;

		p {
			color: #979797;
			margin-left: 10px;
		}
	}
</style>