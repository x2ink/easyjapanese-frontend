<template>
	<view>
		<NavBar title="" style="background-color: #f5f5f5;">
			<template #right>
				<wd-icon @click="moreShow=true" name="ellipsis" size="30px"></wd-icon>
			</template>
		</NavBar>
		<view v-show="loading" class="loading _GCENTER">
			<wd-loading />
		</view>
		<WordDetail :wordinfo="wordinfo" :chinfo="chinfo" :type="type" v-show="!loading"></WordDetail>
		<wd-action-sheet :z-index="999" :safe-area-inset-bottom="false" cancel-text="取消" v-model="moreShow"
			:actions="actions" @close="moreShow=false" @select="select" />
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		computed,
		ref
	} from 'vue'
	import NavBar from '@/components/navbar.vue'
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import $http from "@/api/index.js"
	import WordList from "@/components/wordlist.vue"
	import WordDetail from "@/components/worddetail.vue"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	const type = ref('jc')
	const loading = ref(true)
	const moreShow = ref(false)
	const wordinfo = ref({
		word: null,
		voice: null,
		tone: null,
		rome: null,
		kana: null,
		detail: []
	})
	const chinfo = ref({
		ch: "",
		py: "",
		result: []
	})
	onShow(() => {
		uni.$once("selectBookRes", (data) => {
			if (data) {
				moreShow.value = false
				addWordBooks(data)
			}
		});
	})
	const addWordBooks = async (bookid) => {
		try {
			const res = await $http.word.addMyBooksWord({
				word_id: Number(id.value),
				book_id: bookid
			})
			toast.success(`加入成功`)
		} catch (err) {
			toast.warning(`单词已经在该生词本内`)
		}
	}
	const select = (e) => {
		if (e.index === 0) {
			goPage('feedback', "?type=单词纠错")
		} else if (e.index === 2) {
			uni.setClipboardData({
				data: `/pages/worddetail/worddetail?id=${id.value}`,
				showToast: false,
				success() {
					toast.success(`链接复制成功`)
				}
			});
		} else if (e.index == 1) {
			goPage('mybooks', "?type=select")
		}
	}
	const goPage = (path, params) => {
		if (params) {
			uni.navigateTo({
				url: `/pages/${path}/${path}${params}`
			})
		} else {
			uni.navigateTo({
				url: `/pages/${path}/${path}`
			})
		}
	}
	const id = ref(null)
	onLoad((e) => {
		type.value = e.type
		id.value = e.id
		if (e.type == "jc") {
			getJcInfo()
		} else {
			getCjInfo()
		}
	})
	const getCjInfo = async () => {
		const res = await $http.word.cjInfo(id.value)
		chinfo.value = res.data
		loading.value = false
	}
	const getJcInfo = async () => {
		const res = await $http.word.jcInfo(id.value)
		res.data.detail.forEach((_, i) => {
			res.data.detail[i].detail.forEach((_, k) => {
				res.data.detail[i].detail[k].show = false
			})
		})
		wordinfo.value = res.data
		loading.value = false
	}
	const actions = ref([{
			name: '单词纠错'
		},
		{
			name: '加入单词本'
		},
		{
			name: '分享单词'
		}
	])
</script>

<style lang="scss" scoped>
	.loading {
		margin-top: 40px;
	}
</style>