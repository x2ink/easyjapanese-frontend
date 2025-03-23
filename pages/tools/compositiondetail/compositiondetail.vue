<template>
	<view style="padding-bottom: calc(env(safe-area-inset-bottom) + 15px);">
		<Navbar title="范文">
		</Navbar>
		<view class="wrap">
			<text>要求</text>
			<view class="html">
				<rich-text :nodes="info.demand.replace(/\n/g, '<br>')" user-select></rich-text>
			</view>
		</view>
		<view class="wrap">
			<text>范文</text>
			<view class="content">
				<rich-text :nodes="info.article.replace(/\n/g, '<br>')" user-select></rich-text>
			</view>
		</view>
		<view class="wrap">
			<text>翻译</text>
			<view class="content">
				<rich-text :nodes="info.translate.replace(/\n/g, '<br>')" user-select></rich-text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import Navbar from '@/components/navbar/navbar.vue';
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import $http from "@/api/index.js"
	const info = ref({
		demand: '',
		article: '',
		translate: ''
	})
	const getInfo = async (id) => {
		const res = await $http.common.getCompositionInfo(id)
		info.value = res.data
	}
	onLoad((op) => {
		getInfo(op.id)
	})
</script>

<style scoped lang="scss">
	.wrap {
		margin: 0 15px 15px;
		background-color: white;
		border-radius: 8px;
		padding: 15px;

		>text {
			font-weight: bold;
		}

		>view {
			margin-top: 5px;
		}

		.html {
			font-size: 14px;
		}

		.content {}
	}
</style>