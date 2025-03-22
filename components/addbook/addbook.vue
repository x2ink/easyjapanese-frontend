<template>
	<view>
		<wd-popup v-model="show" :z-index="100" position="bottom" custom-style="border-radius:16px 16px 0 0;">
			<view class="popup">
				<text>新增单词本</text>
				<wd-input type="text" v-model="formData.name" size="large" placeholder="请输入单词本名称" />
				<wd-input type="text" v-model="formData.describe" size="large" placeholder="请输入单词本描述" />
				<view style="padding:10px;margin-top: 15px;">
					<wd-button @click="create()" block>立即创建</wd-button>
				</view>
			</view>
		</wd-popup>
		<wd-toast selector="addbook"/>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast('addbook')
	import $http from "@/api/index.js"
	const emits = defineEmits(['success'])
	const show = ref(false)
	const formData = ref({
		name: '',
		describe: ''
	})
	const create = async () => {
		if (formData.value.name == "" || formData.value.name.length == 0) {
			toast.warning(`名称不可为空`)
			return
		}
		try {
			const res = await $http.word.addMyBooks(formData.value)
			show.value = false
			toast.success(`创建成功`)
			formData.value = {
				name: '',
				describe: ''
			}
			emits('success')
		} catch (err) {
			toast.warning(`单词本最多可以创建5个`)
		}
	}
	defineExpose({
		show
	})
</script>

<style lang="scss">
	.popup {
		padding: 20px;

		text {
			font-size: 16px;
			font-weight: bold;
		}
	}
</style>