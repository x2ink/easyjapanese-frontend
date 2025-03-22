<template>
	<view style="min-height: 100vh;background-color: #f5f5f5;">
		<NavBar title="常用单词" style="background-color: #f5f5f5;"></NavBar>
		<view v-for="_ in 3">
			<text class="title">食品</text>
			<view class="list">
				<view class="category">
					<view class="item _GCENTER" v-for="_ in 9">
						<image src="http://jp.x2.ink/images/FluentEmojiBirthdayCake.png" mode="aspectFill"></image>
						<text>日常食物</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import NavBar from '@/components/navbar.vue'
</script>

<style scoped lang="scss">
	.title {
		margin: 10px;
		font-size: 20px;
		font-weight: bold;
	}

	.list {
		padding: 0 15px;

		.category {
			margin-top: 20px;
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 10px;


			.item {
				flex-direction: column;
				gap: 10px;
				background-color: white;
				padding: 10px;
				border-radius: 8px;

				image {
					width: 50px;
					height: 50px;
				}

				text {
					font-size: 14px;
				}
			}
		}
	}
</style>