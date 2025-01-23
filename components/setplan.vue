<template>
	<wd-popup v-model="show" :z-index="999" closable custom-style="border-radius:8px;">
		<view class="popup">
			<p class="title">修改计划</p>
			<view class="daystudy">
				<p>每组学习：{{config.learn_group}}</p>
				<wd-input-number :min="5" :max="50" v-model="config.learn_group" without-input />
			</view>
			<view class="daystudy">
				<p>每组复习：{{config.review_group}}</p>
				<wd-input-number :min="5" :max="50" v-model="config.review_group" without-input />
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
		learn_group: null,
		review_group: null,
		mode: "",
		book_id: null
	})
	const emits = defineEmits("change")
	const updateConfig = async () => {
		const res = await $http.user.updateConfig(config.value)
		toast.success(`更新成功`)
		show.value = false
		emits("change", config.value)
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
			margin-top: 10px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: $uni-font-size-base;
		}
	}
</style>