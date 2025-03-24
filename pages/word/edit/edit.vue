<template>
	<view>
		<Navbar title="单词编辑">
		</Navbar>
		<view style="padding: 0 15px;">
			<view class="word">
				<text>{{jcinfo.word}}</text>
			</view>
			<view class="hira">
				<span>{{jcinfo.kana}}{{jcinfo.tone}}</span>|
				<span>{{jcinfo.rome}}</span>
			</view>
		</view>
		<view class="edit">
			<text class="title">词性</text>
			<wd-input no-border custom-class="input" type="text" v-model="formData.wordtype" clearable
				placeholder="请输入词性" />
			<text class="title">解释</text>
			<wd-textarea custom-class="textarea" v-model="formData.meaning" placeholder="请填写单词解释" />
			<text class="title">添加例句</text>
			<wd-textarea custom-class="textarea" v-model="formData.example" placeholder="请填写例句如(私は中国人です/我是中国人)" />
			<view class="history" v-if="avatars.length>0">
				<text>编辑历史</text>
				<view @click="goPage('/pages/word/edithistory/edithistory',{
					id:formData.word_id
				})">
					<uv-avatar-group :urls="avatars" size="35" gap="0.4"></uv-avatar-group>
				</view>
			</view>
			<wd-button custom-class="btn" @click="submit()">立即提交</wd-button>
		</view>
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import Navbar from '@/components/navbar/navbar.vue';
	import {
		goPage
	} from "@/utils/common.js"
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import $http from "@/api/index.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	const id = ref(null)
	const formData = ref({
		meaning: "",
		example: "",
		word_id: null,
		wordtype: ""
	})
	const avatars = ref([])
	const getAvatar = async (id) => {
		const res = await $http.word.getEditWord(id)
		avatars.value = res.data.map(item => item.user.avatar)
	}
	const jcinfo = ref({
		word: null,
		voice: null,
		tone: null,
		rome: null,
		kana: null,
		meaning: [],
		example: []
	})
	onLoad((op) => {
		formData.value.word_id = Number(op.id)
		getJcInfo(op.id)
		getAvatar(op.id)
	})
	const getJcInfo = async (id) => {
		const res = await $http.word.jcInfo(id)
		jcinfo.value = res.data
		formData.value.wordtype = res.data.wordtype
		formData.value.meaning = res.data.meaning.map(item => item.meaning).join('\n')
	}
	const submit = async () => {
		const res = await $http.word.editWord(formData.value)
		toast.success('提交成功，请等待审核')
		setTimeout(() => {
			uni.navigateBack({
				delta: 1
			})
		}, 1000)
	}
</script>

<style scoped lang="scss">
	:deep(.btn) {
		width: 100%;
		margin-top: 15px;
	}

	:deep(.input) {
		padding: 8px 15px;
		border-radius: 8px;
		margin-top: 5px;
	}

	:deep(.textarea) {
		margin-top: 5px;
	}

	.history {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 15px;

		>text {
			font-size: 14px;
		}
	}

	.title {
		font-size: $uni-font-size-sm;
		color: $uni-text-color-grey;
	}

	.edit {
		padding: 15px;
	}

	.word {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: $uni-font-size-subtitle;
		font-weight: bold;
	}

	.hira {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		color: $uni-text-color-grey;
	}
</style>