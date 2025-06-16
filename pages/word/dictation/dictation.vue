<template>
	<view class="head">
		<NavbarDefault border title="单词听写"></NavbarDefault>
	</view>
	<wd-progress custom-class="wdprogress" :percentage="progress" hide-text />
	<!-- 单词展示区 -->
	<div class="word-display _GCENTER">
		<button @click="playUserRecord(wordinfo.voice)" class="pronounce-btn pronounce-header" title="发音">
			<i class="fas fa-volume-up"></i>
		</button>
	</div>
	<wd-divider>请选择正确答案</wd-divider>
	<!-- 选项区 -->
	<view class="options">
		<view :class="item.class" @click="select(index,item)" class="option" v-for="(item,index) in options"
			:key="item.id">
			<view>
				{{item.meaning.map(it=>it.meaning).join('；')}}
			</view>
			<div class="word-card" v-if="item.anwser">
				<div>
					<div class="card-japanese">{{formatWordName(item.word,item.kana)}}</div>
					<div class="card-pronunciation">{{item.rome}}</div>
				</div>
			</div>
		</view>
	</view>
	<view class="_GCENTER" v-if="showContinue">
		<view class="continue" @click="getNext()"><text>继续</text><i style="font-size: 22px;"
				class="fa-solid fa-arrow-right"></i></view>
	</view>
	<wd-toast />
	<wd-message-box />
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed
	} from 'vue'
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import $http from "@/api/index.js"
	import NavbarDefault from "@/components/navbar/default"
	import {
		goPage,
		formatWordName
	} from "@/utils/common.js"
	import {
		writefrommemoryStore
	} from "@/stores"
	import {
		useToast,
		useMessage
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	const message = useMessage()
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = false;
	const playUserRecord = (url) => {
		innerAudioContext.stop();
		innerAudioContext.src = url;
		innerAudioContext.play();
	}
	const wordinfo = ref({
		meaning: []
	})
	const wordList = ref([])
	const doneList = ref([])
	const value = ref('')
	const progress = computed(() => {
		return (doneList.value.length / total.value) * 100
	})
	const options = ref([])
	const showContinue = ref(false)
	const select = (index, item) => {
		if (options.value.some(it => it.anwser)) {
			return
		}
		if (item.id == wordinfo.value.id) {
			toast.success("选择正确")
			// 回答正确
			doneList.value.push(wordinfo.value)
			wordList.value.shift()
			options.value[index].class = "success"
			options.value[index].anwser = true
		} else {
			// 回答错误
			toast.error("选择错误")
			options.value[index].class = "fail"
			options.value[index].anwser = true
			let correct = options.value.findIndex(it => it.id == wordinfo.value.id)
			options.value[correct].class = "success"
			options.value[correct].anwser = true
			wordList.value.shift()
			wordList.value.push(wordinfo.value)
		}
		showContinue.value = true
	}
	const getOptions = (id) => {
		const allWords = [...wordList.value, ...doneList.value];
		let filter = allWords.filter(item => item.id != id).sort(() => Math.random() - 0.5).slice(0, 3);
		filter.push(wordinfo.value)
		options.value = filter.sort(() => Math.random() - 0.5).map(item => {
			item = {
				...item,
				class: '',
				anwser: false,
			}
			return item
		});
		console.log(options.value);
	}
	const getAllWords = async () => {
		const res = await $http.word.writeFromMemory({
			remove: writefrommemoryStore().wordList.map(item => item.id)
		})
		wordList.value = res.data
		total.value = wordList.value.length
		getNext()
	}
	const getNext = () => {
		options.value = []
		showContinue.value = false
		value.value = ""
		wordinfo.value = wordList.value[0]
		playUserRecord(wordinfo.value.voice)
		getOptions(wordinfo.value.id)
	}
	const total = ref(0)

	onMounted(() => {

	})
	onLoad(op => {
		if (op.type == "local") {

		} else {
			getAllWords()
		}
	})
</script>

<style lang="scss">
	.head {
		position: sticky;
		top: 0;
		z-index: 9;
	}

	.continue {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 16px;
		font-weight: bold;
		margin-top: 16px;
		color: #34D19D;
	}

	.pronounce-header {
		width: 60px !important;
		height: 60px !important;
		position: relative !important;
		right: 0 !important;
		top: 0 !important;
		font-size: 18px !important;
	}

	.pronounce-btn {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f0f0f0;
		border-radius: 50%;
		border: none;
		color: #555;
		font-size: 16px;
		position: absolute;
		right: 16px;
		top: 16px;
		margin: 0;
	}

	.wdprogress {
		padding: 0 !important;
	}

	.word-display {
		background-color: #FFFFFF;
		padding: 24px;
	}

	.options {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin: 16px;


		.option {
			background-color: white;
			border-radius: 8px;
			padding: 16px;
		}
	}

	/* 单词卡片 (初始隐藏) */
	.word-card {
		background-color: white;
		color: black;
		border-radius: 8px;
		margin-top: 8px;
		padding: 8px;
	}



	.card-japanese {
		font-size: 18px;
		font-weight: bold;
	}

	.card-pronunciation {
		font-size: 16px;
		color: #757575;
	}

	/* 图标样式 */
	.icon {
		width: 24px;
		height: 24px;
		color: #757575;
	}

	.success {
		background-color: #34D19D !important;
		color: white;
	}

	.fail {
		background-color: #FA4350 !important;
		color: white;
	}
</style>