<template>
	<view>
		<NavBar :title="info.title" style="background-color: #f3f3f5;"></NavBar>
		<view class="content" v-html="info.data">

		</view>
		<view class="noticetime">
			{{dayjs().to(dayjs(info.created_at))}}
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import NavBar from '@/components/navbar.vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import dayjs from 'dayjs'
	import relativeTime from 'dayjs/plugin/relativeTime'
	import 'dayjs/locale/zh'
	dayjs.locale('zh')
	dayjs.extend(relativeTime)
	import $http from "@/api/index.js"
	const id = ref(null)
	const info = ref({
		title: "",
		data: ""
	})
	onLoad(async (op) => {
		id.value = op.id
		const res = await $http.common.getNoticeInfo(op.id)
		info.value = res.data
	})
</script>

<style scoped lang="scss">
	.content {
		background-color: white;
		padding: 15px;
		margin: 0 15px 15px 15px;
		border-radius: 8px;
	}

	.noticetime {
		font-size: 12px;
		color: #999;
		text-align: right;
		margin-right: 15px;
	}
</style>