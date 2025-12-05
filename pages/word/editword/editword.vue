<template>
	<view style="height: 100vh;overflow: auto;">
		<NavbarDefault title="编辑单词"></NavbarDefault>
		<view style="padding:16rpx 32rpx 32rpx 32rpx;">
			<view class="section-title">
				<text class="fas fa-book"></text>
				基本信息
			</view>
			<view class="input">
				<view class="title">
					单词（多个异体字请用“,”分割）
				</view>
				<view class="card">
					<input v-model="formData.words" type="text" placeholder="请输入单词如：筆跡，筆蹟">
				</view>
			</view>
			<view style="display: flex;align-items: center;gap: 32rpx;margin-top: 16rpx;">
				<view class="input">
					<view class="title">
						假名
					</view>
					<view class="card">
						<input v-model="formData.kana" type="text" placeholder="请输入假名">
					</view>
				</view>
				<view class="input">
					<view class="title">
						音调
					</view>
					<view class="card">
						<input v-model="formData.tone" type="text" placeholder="请输入音调">
					</view>
				</view>
			</view>
			<view class="input" style="margin-top: 16rpx;">
				<view class="title">
					简明释义
				</view>
				<view class="card">
					<input v-model="formData.description" type="text" placeholder="请输入简明释义">
				</view>
			</view>
			<view class="section-title" style="margin-top: 32rpx;">
				<text class="fas fa-list"></text>
				详细释义
			</view>
			<view :key="'meaning-'+index" v-for="(item,index) in formData.meanings" class="meanings">
				<view style="display: flex;align-items: center;justify-content: space-between;">
					<view class="title">
						释义{{index+1}}
					</view>
					<text @click="deleteMeaning(index)" style="color: #F44336;" class="fa-solid fa-trash"></text>
				</view>
				<view class="input">
					<view class="title">
						词性
					</view>
					<view class="card">
						<input v-model="item.type" type="text" placeholder="请输入词性">
					</view>
				</view>
				<view class="input">
					<view class="title">
						释义
					</view>
					<view class="card">
						<textarea v-model="item.meanings" placeholder="请输入释义"></textarea>
					</view>
				</view>
			</view>
			<button @click="pushMeaning()" class="add-button">
				<text class="fas fa-plus"></text>
				添加释义
			</button>
			<view class="section-title" style="margin-top: 32rpx;">
				<text class="fas fa-list"></text>
				例句
			</view>
			<view :key="'example-'+index" v-for="(item,index) in formData.examples">
				<view class="examples">
					<view class="title">
						释义{{index+1}}
					</view>
					<text @click="deleteExample(index)" style="color: #F44336;" class="fa-solid fa-trash"></text>
				</view>
				<view class="input">
					<view class="title">
						日文
					</view>
					<view class="card">
						<input v-model="item.jp" type="text" placeholder="请输入日文">
					</view>
				</view>
				<view class="input" style="margin-top: 16rpx;">
					<view class="title">
						中文
					</view>
					<view class="card">
						<input v-model="item.zh" type="text" placeholder="请输入中文">
					</view>
				</view>
			</view>
			<button @click="pushExample()" class="add-button">
				<text class="fas fa-plus"></text>
				添加例句
			</button>
			<view @click="goPage('/pages/word/edithistory/edithistory',{wordId})" class="history">
				<view>
					修订历史
				</view>
				<uv-avatar-group :urls="avatarUrls" size="35" gap="0.5"></uv-avatar-group>
			</view>
			<button @click="submit" class="submit-btn">提交修订</button>
			<view :style="{height:getOs()=='ios'?'env(safe-area-inset-bottom)':'32rpx'}"></view>
		</view>
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		getOs,
		goPage
	} from "@/utils/common.js"
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	import NavbarDefault from "@/components/navbar/default"
	const avatarUrls = ref([])
	const getUserAvatar = async () => {
		const res = await $http.word.getEditHistory({
			word_id: wordId.value,
			page: 1,
			page_size: 10
		})
		avatarUrls.value = res.data.map(item => item.user.avatar)
	}
	import $http from '@/api/index.js'
	const wordInfo = ref({})
	const formData = ref({
		words: null,
		kana: null,
		tone: null,
		description: null,
		meanings: [],
		examples: []
	})
	const submitted = ref(false)
	const submit = () => {
		if (submitted.value) {
			uni.showModal({
				title: '温馨提示',
				content: '你之前已经提交了一次，再次提交会覆盖之前的内容',
				success: function(res) {
					if (res.confirm) {
						task()
					}
				}
			});
		} else {
			task()
		}
		async function task() {
			try {
				const res = await $http.word.submitEditWord({
					...formData.value,
					word_id: Number(wordId.value)
				})
				toast.success("提交成功")
				submitted.value = true
			} catch (error) {
				toast.error("提交失败")
			}
		}
	}
	const getJcInfo = async () => {
		const res = await $http.word.jcInfo({
			id: wordId.value
		})
		wordInfo.value = res.data
		formData.value.words = res.data.words.join(',')
		formData.value.kana = res.data.kana
		formData.value.tone = res.data.tone
		formData.value.description = res.data.description
		formData.value.meanings = res.data.detail.map(item => {
			return {
				type: item.type,
				meanings: item.meanings.map(i => i.zh).join('\n')
			}
		})
	}
	const wordId = ref(null)
	const deleteMeaning = (index) => {
		formData.value.meanings.splice(index, 1)
	}
	const pushMeaning = () => {
		formData.value.meanings.push({
			type: "",
			meanings: ""
		})
	}
	const deleteExample = (index) => {
		formData.value.examples.splice(index, 1)
	}
	const pushExample = () => {
		formData.value.examples.push({
			jp: "",
			zh: ""
		})
	}
	onLoad((e) => {
		wordId.value = e.wordId
		getJcInfo()
		getUserAvatar()
	})
</script>
<style>
	page {
		background-color: white;
	}
</style>
<style scoped lang="less">
	.title {
		font-size: 28rpx;
		font-weight: 600;
	}

	.section-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #212121;
		margin-bottom: 24rpx;
		display: flex;
		align-items: center;
		gap: 16rpx;
	}

	.history {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		margin-top: 32rpx;
	}

	.section-title text {
		color: #4CAF50;
	}

	.meanings {
		display: flex;
		gap: 16rpx;
		margin-top: 16rpx;
		flex-direction: column;
	}

	.examples {
		margin-top: 16rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.input {
		.card {
			margin-top: 16rpx;
			border: 2rpx solid #E5E7EB;
			border-radius: 24rpx;
			padding: 24rpx 32rpx;

			textarea {
				width: 100%;
				overflow-y: auto;
				height: 160rpx;
				line-height: 40rpx;
			}
		}
	}

	.add-button {
		background-color: transparent;
		color: #07C160;
		border: 2rpx dashed #07C160;
		border-radius: 24rpx;
		padding: 24rpx 32rpx;
		font-size: 28rpx;
		width: 100%;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 16rpx;
		margin-top: 32rpx;
	}

	.submit-btn {
		margin-top: 32rpx;
		padding: 24rpx;
		background-color: #07C160;
		color: white;
		border: none;
		border-radius: 16rpx;
		font-size: 32rpx;
		font-weight: 500;
		cursor: pointer;
	}

	.submit-btn:active {
		background-color: #06AD56;
	}

	.add-button text {
		font-size: 28rpx;
	}
</style>