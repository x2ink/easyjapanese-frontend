<template>
	<Navbar title="单词学习">
	</Navbar>
	<view v-show="loading" class="loading _GCENTER">
		<wd-loading />
	</view>
	<view v-if="!loading">
		<swiper :style="{height:`calc(100vh - ${navBarHeight} - 95px - env(safe-area-inset-bottom))`}" circular>
			<swiper-item v-for="item in wordList" :key="item.id">
				<LearnWord :wordinfo="item"></LearnWord>
			</swiper-item>
		</swiper>
	</view>
	<view class="handle">
		<!-- <wd-progress :percentage="percentage" hide-text /> -->
		<view>
			<view @click="previous()" class="btn _GCENTER">
				<text>上一个</text>
				<view style="background-color: #E78938;"></view>
			</view>
			<wd-icon @click="hideMeaning=!hideMeaning" v-if="!hideMeaning" name="browse" size="25px"
				color="#999"></wd-icon>
			<wd-icon @click="hideMeaning=!hideMeaning" v-else name="browse-off" size="25px" color="#999"></wd-icon>
			<view @click="next()" class="btn _GCENTER">
				<text>下一个</text>
				<view style="background-color: #34D19D;"></view>
			</view>
		</view>
	</view>
	<wd-toast />
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed,
		watch,
		nextTick
	} from 'vue'
	import Navbar from '@/components/navbar/navbar.vue';
	import $http from "@/api/index.js"
	import LearnWord from "@/components/learnword/learnword.vue"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	import {
		goPage,
		tagColor,
		formatWordName
	} from "@/utils/common.js"
	const toast = useToast()
	const loading = ref(true)
	const position = ref(0)
	const previous = () => {
		if (position.value == 0) {
			position.value = wordList.value.length - 1
		} else {
			--position.value
		}
	}
	const next = () => {
		if (position.value == wordList.value.length - 1) {
			position.value = 0
		} else {
			++position.value
		}
	}
	const wordinfo = ref({})
	const wordList = ref([])
	watch(
		() => position.value,
		(newValues, oldValues) => {
			wordinfo.value = wordList.value[newValues]
		}
	);
	const total = ref(0)
	const hideMeaning = ref(false)
	const init = async () => {
		const res = await $http.word.learnWord()
		wordList.value = res.data
		console.log(wordList.value.map(item => item.word));
		total.value = res.total
		wordinfo.value = res.data[0]
		loading.value = false
	}
	const navBarHeight = ref('')
	onMounted(() => {
		const systemInfo = wx.getSystemInfoSync();
		const statusBarHeight = systemInfo.statusBarHeight;
		navBarHeight.value = statusBarHeight + 'px'
		init()
	})
</script>

<style lang="scss" scoped>
	:deep(.wd-progress) {
		padding-top: 0px;
	}


	:deep(.wd-progress) {
		padding-top: 0 !important;
	}

	.handle {
		border-top: #f5f5f5 2px solid;
		padding-top: 10px;
		background-color: white;
		padding-bottom: env(safe-area-inset-bottom);
		position: fixed;
		bottom: 0px;
		right: 0;
		left: 0;
		z-index: 9999;

		>view {
			gap: 15px;
			display: flex;
			justify-content: space-around;
			align-items: center;

			.btn {
				width: 80px;
				height: 40px;
				flex-direction: column;
				gap: 5px;

				>text {
					font-size: 14px;
					font-weight: bold;
				}

				>view {
					width: 15px;
					height: 3px;
					border-radius: 3px;
				}
			}
		}
	}

	.loading {
		margin-top: 40px;
	}


	.learnsuccess {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 15px;
		justify-content: center;

		text {
			color: $uni-text-color-grey;
		}
	}
</style>