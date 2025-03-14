<template>
	<page-meta :page-style="`overflow:${bookShow ? 'hidden' : 'visible'};`">
		<Navbar title="">
		</Navbar>
		<view v-show="loading" class="loading _GCENTER">
			<wd-loading />
		</view>
		<WordDetail @openBook="bookShow=true" :jcinfo="jcinfo" :cjinfo="cjinfo" :type="type" v-show="!loading">
		</WordDetail>
		<wd-toast />
	</page-meta>
	<!-- 生词本 -->
	<wd-popup v-model="bookShow" :z-index="99" position="bottom" :safe-area-inset-bottom="true"
		custom-style="border-radius:16px 16px 0 0;">
		<view class="books">
			<text>生词本</text>
			<scroll-view class="scroll-view_H" scroll-x="true">
				<BookList :wordId="id" type="select"></BookList>
			</scroll-view>
		</view>
	</wd-popup>
</template>

<script setup>
	import {
		computed,
		ref
	} from 'vue'
	import Navbar from '@/components/navbar/navbar.vue';
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import $http from "@/api/index.js"
	import WordList from "@/components/wordlist/wordlist.vue"
	import WordDetail from "@/components/worddetail/worddetail.vue"
	import BookList from '@/components/booklist/booklist.vue';
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const bookShow = ref(false)
	const toast = useToast()
	const type = ref('jc')
	const loading = ref(true)
	const jcinfo = ref({
		word: null,
		voice: null,
		tone: null,
		rome: null,
		kana: null,
		meaning: [],
		example: []
	})
	const cjinfo = ref({
		ch: "",
		py: "",
		result: []
	})
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
		cjinfo.value = res.data
		loading.value = false
	}
	const getJcInfo = async () => {
		const res = await $http.word.jcInfo(id.value)
		jcinfo.value = res.data
		loading.value = false
	}
</script>

<style lang="scss" scoped>
	:deep(.list) {
		gap: 0;
		margin: 0;
	}

	.loading {
		margin-top: 40px;
	}

	.books {
		padding: 20px;

		text {
			font-weight: bold;
			font-size: 16px;
		}

		.scroll-view_H {
			height: 40vh;
			margin: 10px 0;
		}
	}
</style>