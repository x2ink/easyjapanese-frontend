<template>
	<view>
		<Navbar title="发布动态"></Navbar>
		<wd-textarea custom-class="textarea" v-model="formData.content" clearable show-word-limit placeholder="请发表你的想法"
			:maxlength="800" />
		<view style="background-color: white;padding: 10px;margin:10px;border-radius: 8px;">
			<wd-radio-group v-model="formData.section_id" shape="button">
				<wd-radio v-for="item in section" :key="item.id" :value="item.id">{{item.name}}</wd-radio>
			</wd-radio-group>
		</view>
		<wd-upload :max-size="1024*1024*10" @change="handleChange" v-model:file-list="fileList"
			:upload-method="customUpload" accept="image" :limit="9" custom-class="updload"
			show-limit-num image-mode="aspectFill" multiple :header="header"
			:action="`${http.baseUrl}upload`"></wd-upload>

		<view style="padding:0 10px;margin-top: 15px;">
			<wd-button @click="submit()" block>发布</wd-button>
		</view>
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import Navbar from '@/components/navbar/navbar.vue';
	import $http from "@/api/index.js"
	import http from '@/utils/request.js'
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	import {
		userStore
	} from "@/stores/index.js"
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
		}
	}
	const getSection = async () => {
		const res = await $http.trend.getSection()
		section.value = res.data
		formData.value.section_id = res.data[0].id
	}
	onMounted(() => {
		getSection()
	})
	const submit = () => {
		if (formData.value.content.length === 0) {
			toast.warning(`内容不可为空`)
			return
		}
		fileList.value.forEach(item => {
			if (item.status == "success") {
				formData.value.images.push(JSON.parse(item.response).data)
			}
		})
		addTrend()
	}
	const handleChange = (files) => {
		fileList.value = files.fileList
	}
	const customUpload = (file, formData, options) => {
		const uploadTask = uni.uploadFile({
			url: `${http.baseUrl}upload`,
			header: header.value,
			name: options.name,
			fileName: options.name,
			fileType: options.fileType,
			formData,
			filePath: file.url,
			success(res) {
				if (res.statusCode === options.statusCode) {
					// 设置上传成功
					options.onSuccess(res, file, formData)
					console.log("上传成功");
				} else {
					// 设置上传失败
					options.onError({
						...res,
						errMsg: res.errMsg || ''
					}, file, formData)
				}
			},
			fail(err) {
				// 设置上传失败
				options.onError(err, file, formData)
			}
		})
		// 设置当前文件加载的百分比
		uploadTask.onProgressUpdate((res) => {
			options.onProgress(res, file)
		})
	}
</script>

<style scoped lang="scss">
	:deep(.textarea) {
		margin: 0 10px;
		border-radius: 8px;
	}

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