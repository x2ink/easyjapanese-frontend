<template>
	<wd-popup v-model="show" closable custom-style="border-radius:8px;">
		<view class="popup">
			<p class="title">修改计划</p>
			<view class="daystudy">
				<p>每组学习：{{config.daily_learning}}</p>
				<wd-input-number v-model="config.daily_learning" without-input />
			</view>
			<wd-radio-group v-model="learnMode" checked-color="#fa4350">
				<wd-radio :value="1" @click="config.mode='学习模式'">学习模式</wd-radio>
				<wd-radio :value="2" @click="config.mode='刷词模式'">刷词模式</wd-radio>
			</wd-radio-group>
			<wd-button style="width: 100%;margin-top: 15px;" @click="updateConfig()">保存修改</wd-button>
		</view>
	</wd-popup>
	<wd-toast />
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed
	} from "vue"
	import $http from "@/api/index.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	const learnMode = ref(1)
	const show = ref(false)
	const config = ref({
		id: null,
		user_id: null,
		daily_learning: null,
		mode: "",
		book_id: null
	})
	const updateConfig = async () => {
		const res = await $http.user.updateConfig(config.value)
		toast.success(`更新成功`)
		show.value = false
	}
	const getConfig = async () => {
		const res = await $http.user.getConfig()
		config.value = res.data
		learnMode.value = config.value.mode == '学习模式' ? 1 : 2
	}
	onMounted(() => {
		getConfig()
	})
	defineExpose({
		show,
		config
	})
</script>

<style lang="scss" scoped>
	.popup {
		width: 240px;
		padding: 15px;

		.title {
			text-align: center;
		}

		.daystudy {
			height: 50px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: $uni-font-size-base;
		}
	}
</style>