<template>
	<view>
		<NavBar title="发布动态"></NavBar>
		<wd-textarea style="margin: 0 10px;border-radius: 8px;" v-model="formData.content" clearable show-word-limit
			placeholder="请发表你的想法" :maxlength="800" />
		<view style="background-color: white;padding: 10px;margin:10px;border-radius: 8px;">
			<wd-radio-group v-model="formData.section_id" shape="button">
				<wd-radio v-for="item in section" :key="item.id" :value="item.id">{{item.name}}</wd-radio>
			</wd-radio-group>
		</view>
		<wd-upload v-model:file-list="fileList" ref="uploadRef" :auto-upload="false" accept="image" :limit="9"
			custom-class="updload" :max-size="1024*1024*10" show-limit-num image-mode="aspectFill" multiple
			:header="header" :action="`${http.baseUrl}upload`" @change="handleChange"></wd-upload>

		<view style="padding:0 10px;margin-top: 15px;">
			<wd-button @click="submit()" style="width: 100%;">发布</wd-button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import NavBar from '@/components/navbar.vue'
	import $http from "@/api/index.js"
	import http from '@/utils/request.js'
	const uploadRef = ref(null)
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	import {
		userStore
	} from "@/stores/index.js"
	const status = ref(false)
	const formData = ref({
		content: "",
		images: [],
		section_id: 1
	})
	const section = ref([])
	const header = ref({
		"Authorization": userStore().token
	})
	const fileList = ref([])
	const addTrend = async () => {
		try {
			const res = await $http.trend.addTrend(formData.value)
			uni.$emit("addTrend", res.data);
			uni.navigateBack({
				delta: 1
			})
		} catch (e) {
			toast.error(`发布失败请重试`)
			status.value = false
		}
	}
	const submit = () => {
		if (formData.value.content.length === 0) {
			toast.warning(`内容不可为空`)
			return
		}
		status.value = true
		if (fileList.value.length == 0) {
			addTrend()
		} else {
			uploadRef.value.submit()
		}
	}
	const getSection = async () => {
		const res = await $http.trend.getSection("trend")
		section.value = res.data
		formData.value.section_id = res.data[0].id
	}
	onMounted(() => {
		getSection()
	})
	const handleChange = (files) => {
		files.fileList.map((item) => {
			if (item.status == "success") {
				formData.value.images.push(JSON.parse(item.response).data)
			}
		})
		if (status.value) {
			addTrend()
		}
	}
</script>

<style scoped lang="scss">
	:deep(.updload) {
		margin: 15px 10px 0 10px;
	}

	:deep(.wd-upload__preview) {
		margin: 0;
	}

	:deep(.wd-upload) {
		display: grid;
		gap: 10px;
		grid-template-columns: repeat(4, 1fr);
	}
</style>