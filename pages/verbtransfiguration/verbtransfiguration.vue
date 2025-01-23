<template>
	<NavBar title="动词变形"></NavBar>
	<view class="input">
		<wd-input type="text" v-model="value" placeholder="请输入动词" />
		<wd-button custom-class="btn" :round="false" @click="getVerbTrans()">立即变形</wd-button>
	</view>
	<wd-table :data="data" v-if="data.length>0">
		<wd-table-col width="150" prop="category" label="类别" fixed></wd-table-col>
		<wd-table-col width="100%" prop="result" label="变形"></wd-table-col>
	</wd-table>
	<wd-toast />
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import NavBar from '@/components/navbar.vue'
	import $http from "@/api/index.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	const value = ref("")
	const data = ref([])
	const getVerbTrans = async () => {
		try {
			if (value.value == "" || value.value.length == 0) {
				toast.warning(`单词不可为空`)
				return
			}
			const res = await $http.common.getVerbTrans(value.value)
			data.value = res.data
		} catch (err) {
			toast.warning(`这个单词不是动词`)
		}
	}
</script>

<style scoped lang="scss">
	:deep(.btn) {
		margin-top: 15px;
		width: 100%;
	}

	.input {
		padding: 15px;
		gap: 15px;
	}
</style>