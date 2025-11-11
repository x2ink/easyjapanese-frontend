<template>
	<view style="height: 100vh;overflow: auto;">
		<NavbarDefault title="编辑单词"></NavbarDefault>
		<view style="padding:8px 16px 16px 16px;">
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
			<view style="display: flex;align-items: center;gap: 16px;margin-top: 8px;">
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
			<view class="input" style="margin-top: 8px;">
				<view class="title">
					简明释义
				</view>
				<view class="card">
					<input v-model="formData.description" type="text" placeholder="请输入简明释义">
				</view>
			</view>
			<view class="section-title" style="margin-top: 16px;">
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
			<view class="section-title" style="margin-top: 16px;">
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
				<view class="input" style="margin-top: 8px;">
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
			<view class="history">
				<view>
					修订历史
				</view>
				<uv-avatar-group :urls="avatarUrls" size="35" gap="0.5"></uv-avatar-group>
			</view>
			<button @click="submit" class="submit-btn">提交修订</button>
			<view :style="{height:getOs()=='ios'?'env(safe-area-inset-bottom)':'16px'}"></view>
		</view>
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		getOs
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
	const avatarUrls = ref([
		'https://pic1.imgdb.cn/item/68f6fc1c3203f7be0084d93a.png',
		'https://pic1.imgdb.cn/item/68f6fc1c3203f7be0084d93a.png',
		'https://pic1.imgdb.cn/item/68f6fc1c3203f7be0084d93a.png',
		'https://pic1.imgdb.cn/item/68f6fc1c3203f7be0084d93a.png'
	])
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
	})
</script>
<style>
	page {
		background-color: white;
	}
</style>
<style scoped lang="less">
	.title {
		font-size: 14px;
		font-weight: 600;
	}

	.section-title {
		font-size: 16px;
		font-weight: 600;
		color: #212121;
		margin-bottom: 12px;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.history {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		margin-top: 16px;
	}

	.section-title text {
		color: #4CAF50;
	}

	.meanings {
		display: flex;
		gap: 8px;
		margin-top: 8px;
		flex-direction: column;
	}

	.examples {
		margin-top: 8px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.input {
		.card {
			margin-top: 8px;
			border: 1px solid #E5E7EB;
			border-radius: 12px;
			padding: 12px 16px;

			textarea {
				width: 100%;
				overflow-y: auto;
				height: 80px;
				line-height: 20px;
			}
		}
	}

	.add-button {
		background-color: transparent;
		color: #07C160;
		border: 1px dashed #07C160;
		border-radius: 12px;
		padding: 12px 16px;
		font-size: 14px;
		width: 100%;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 8px;
		margin-top: 16px;
	}

	.submit-btn {
		margin-top: 16px;
		padding: 12px;
		background-color: #07C160;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 16px;
		font-weight: 500;
		cursor: pointer;
	}

	.submit-btn:active {
		background-color: #06AD56;
	}

	.add-button text {
		font-size: 14px;
	}
</style>