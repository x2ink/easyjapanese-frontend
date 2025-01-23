<template>
	<NavBar :title="title" style="background-color: white;"></NavBar>
	<wd-gap bg-color="#F5f5f5" height="10px"></wd-gap>
	<WordList v-if="List.length>0" type="jc" style="margin-top: 10px;" :list="List">
	</WordList>
	<wd-loadmore v-if="List.length>0&&total>List.length" custom-class="loadmore" :state="loadmore" />
	<wd-backtop :scrollTop="scrollTop"></wd-backtop>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'
	import {
		onLoad,
		onPageScroll,
		onReachBottom
	} from "@dcloudio/uni-app"
	import NavBar from '@/components/navbar.vue'
	import WordList from "@/components/wordlist.vue"
	const scrollTop = ref(0)
	onPageScroll((e) => {
		scrollTop.value = e.scrollTop
	})
	const title = ref('')
	import $http from "@/api/index.js"
	const page = ref(1)
	const size = ref(10)
	const total = ref(0)
	const List = ref([])
	const getList = async () => {
		const res = await $http.word.getWordBookList(bookid.value, page.value, size.value)
		total.value = res.total
		List.value = List.value.concat(res.data)
	}
	const loadmore = computed(() => {
		if (total.value == List.value.length) {
			return "finished"
		} else {
			return "loading"
		}
	})
	onReachBottom(() => {
		if (total.value > List.value.length) {
			++page.value
			getList()
		}
	})
	const bookid = ref(null)
	onLoad((e) => {
		title.value = e.name
		bookid.value = e.id
		getList()
	})
</script>

<style scoped lang="scss">
	:deep(.loadmore) {
		background-color: #f4f4f4;
		margin: 0;

		>view {
			margin: 0;
		}
	}
</style>