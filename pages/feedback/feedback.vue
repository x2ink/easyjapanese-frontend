<template>
	<NavBar title="反馈"></NavBar>
	<wd-textarea v-model="formData.content" clearable show-word-limit placeholder="请输入内容" :maxlength="400" />
	<wd-gap bg-color="#F5f5f5" height="15px"></wd-gap>
	<view style="background-color: white;padding: 10px;">
		<wd-radio-group v-model="formData.type" shape="button">
			<wd-radio value="单词纠错">单词纠错</wd-radio>
			<wd-radio value="意见建议">意见建议</wd-radio>
			<wd-radio value="BUG反馈">BUG反馈</wd-radio>
		</wd-radio-group>
	</view>
	<view style="padding:10px;margin-top: 15px;">
		<wd-button @click="submit()" style="width: 100%;">提交</wd-button>
	</view>
	<wd-toast />
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import NavBar from '@/components/navbar.vue'
	import $http from "@/api/index.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	const formData = ref({
		content: "",
		type: "单词纠错"
	})
	const submit = async () => {
		if (formData.value.content == "" || formData.value.content.length == 0) {
			toast.warning(`内容不可为空`)
			return
		}
		const res = await $http.common.feedback(formData.value)
		toast.success(`提交成功`)
	}
	onLoad(e => {
		if (e.type) {
			formData.value.type = e.type
		} else {
			formData.value.type = "单词纠错"
		}
	})
</script>

<style scoped lang="scss">


</style>