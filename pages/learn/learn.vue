<template>
	<NavBar :title="`单词${recite?'背诵':'学习'}`">
	</NavBar>
	<view v-show="loading" class="loading _GCENTER">
		<wd-loading />
	</view>
	<view v-if="!loading">
		<!-- 学习单词 -->
		<view v-if="!learnSuccess">
			<wd-progress :percentage="progress" hide-text />
			<WordDetail :wordinfo="wordList[current]" type="jc"></WordDetail>
			<view class="next">
				<wd-button @click="previousWord" custom-class="btn" :round="false" size="large"
					type="info">上一个</wd-button>
				<wd-button @click="nextWord" custom-class="btn" :round="false" size="large">下一个</wd-button>
			</view>
		</view>
		<view v-else>
			<view v-if="!recite" class="learnsuccess">
				<wd-icon style="margin-top: 40px;" name="check-circle-filled" size="80px" color="#34D19D"></wd-icon>
				<text>{{total}}个单词已学习完成！</text>
				<wd-button style="margin-top: 40px;" size="large" @click="startRecite">开始背词</wd-button>
			</view>
			<view v-else>
				<view v-if="!doneTodayTask">
					<wd-progress :percentage="reciteDone" hide-text />
					<view v-if="!showWord">
						<!-- 汉字选择假名 -->
						<SelectKana ref="selectKanaRef" @answer="answerResult" v-if="currentProgress==0"
							:wordinfo="wordinfo">
						</SelectKana>
						<!-- 单词选择意思 -->
						<WordsSelectMeaning ref="wordsSelectMeaningRef" @answer="answerResult"
							v-else-if="currentProgress==1" :wordinfo="wordinfo">
						</WordsSelectMeaning>
						<!-- 意思选择单词 -->
						<MeaningSelectWords ref="meaningSelectWordsRef" @answer="answerResult"
							v-else-if="currentProgress==2" :wordinfo="wordinfo">
						</MeaningSelectWords>
						<!-- 发音选择单词 -->
						<SoundSelectWord ref="soundSelectWordRef" @answer="answerResult" v-else-if="currentProgress==3"
							:wordinfo="wordinfo"></SoundSelectWord>
					</view>
					<view v-else>
						<WordDetail :wordinfo="wordinfo" type="jc"></WordDetail>
						<view class="next">
							<wd-button @click="continueNext" custom-class="btn" :round="false"
								size="large">继续</wd-button>
						</view>
					</view>
				</view>
				<view v-else class="learnsuccess">
					<wd-icon style="margin-top: 40px;" name="check-circle-filled" size="80px" color="#34D19D"></wd-icon>
					<text>{{total}}个单词已练习完成！赶紧默写吧！</text>
					<view style="display: flex;gap: 15px;margin-top: 40px;">
						<wd-button size="large" @click="goPage('todaylearn')">立刻默写</wd-button>
						<wd-button size="large" type="info" @click="init()">再来一组</wd-button>
					</view>
					<text style="color: #000000;margin-top: 40px;">单词列表</text>
					<view class="recitelist">
						<view v-for="item in doneWord" :key="item.id" class="reciteitem">
							<text>{{item.word}}</text>
							<text>错误 {{item.error_count}} 次</text>
						</view>
					</view>
				</view>
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
	import NavBar from '@/components/navbar.vue'
	import WordList from "@/components/wordlist.vue"
	import WordsSelectMeaning from "@/components/learnword/wordsSelectMeaning.vue"
	import MeaningSelectWords from "@/components/learnword/meaningSelectWords.vue"
	import SelectKana from "@/components/learnword/selectKana.vue"
	import SoundSelectWord from "@/components/learnword/soundSelectWord.vue"
	import WordDetail from "@/components/worddetail.vue"
	import $http from "@/api/index.js"
	import {
		learnmodeStore
	} from "@/stores/index.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	// 需要被缓存的变量
	const current = ref(0)
	const wordList = ref([])
	const total = ref(0)
	const recite = ref(false)
	const doneTodayTask = ref(false)
	const currentProgress = ref(0)
	const showWord = ref(false)
	const doneWord = ref([])
	const learnSuccess = ref(false)
	const wordinfo = ref({})
	const loading = ref(true)
	const selectKanaRef = ref(null)
	const wordsSelectMeaningRef = ref(null)
	const meaningSelectWordsRef = ref(null)
	const soundSelectWordRef = ref(null)
	const goPage = (path) => {
		uni.redirectTo({
			url: `/pages/${path}/${path}`
		})
	}
	const reciteDone = computed(() => {
		return (doneWord.value.length / total.value) * 100
	})
	const setOption = () => {
		if (currentProgress.value == 0) {
			selectKanaRef.value.setOption(wordinfo.value.kana_option)
		} else if (currentProgress.value == 1) {
			wordsSelectMeaningRef.value.setOption(wordinfo.value.meaning_option)
		} else if (currentProgress.value == 2) {
			meaningSelectWordsRef.value.setOption(wordinfo.value.word_option)
		} else if (currentProgress.value == 3) {
			soundSelectWordRef.value.setOption(wordinfo.value.voice_option)
		}
	}
	const continueNext = () => {
		if (wordinfo.value.progress.findIndex(item => !item) == -1) {
			wordinfo.value.done = true
			doneWord.value.push({
				id: wordinfo.value.id,
				word: wordinfo.value.word,
				error_count: wordinfo.value.error_count,
			})
		}
		getWord()
		showWord.value = false
	}
	const answerResult = (e) => {
		if (e) {
			wordinfo.value.progress[currentProgress.value] = true
		} else {
			++wordinfo.value.error_count
			if (wordinfo.value.kana == wordinfo.value.word) {
				wordinfo.value.progress = [true, false, false, false]
			} else {
				wordinfo.value.progress = [false, false, false, false]
			}
		}
		setTimeout(() => {
			showWord.value = true
			setObject()
		}, 500)
	}
	const progress = computed(() => {
		return (current.value / (wordList.value.length)) * 100
	})
	const getWord = async () => {
		if (wordList.value.every(item => item.done)) {
			doneTodayTask.value = true
			await $http.word.recordlearn({
				words: doneWord.value.map(item => item.id)
			})
			learnmodeStore().clear()
			return
		} else {
			let index = wordList.value.findIndex(item => !item.done)
			current.value = index
			wordinfo.value = wordList.value[index]
			currentProgress.value = wordinfo.value.progress.findIndex(item => !item)
			setTimeout(() => {
				setOption()
			}, 10)
			let temp = wordList.value[0]
			wordList.value.splice(0, 1)
			wordList.value.push(temp)
		}
	}
	const startRecite = () => {
		getWord()
		recite.value = true
	}
	const setObject = () => {
		learnmodeStore().setObj({
			current: current.value,
			wordList: wordList.value,
			total: total.value,
			recite: recite.value,
			doneTodayTask: doneTodayTask.value,
			currentProgress: currentProgress.value,
			showWord: showWord.value,
			doneWord: doneWord.value,
			learnSuccess: learnSuccess.value,
			wordinfo: wordinfo.value
		})
	}
	const nextWord = () => {
		if (current.value >= wordList.value.length - 1) {
			learnSuccess.value = true
		} else {
			++current.value
		}
		setObject()
	}
	const previousWord = () => {
		if (current.value <= 0) {
			toast.warning(`没有上一个了`)
		} else {
			--current.value
		}
		setObject()
	}

	watch(current, (newVal, oldVal) => {
		if (!learnSuccess.value) {
			wordinfo.value = wordList.value[newVal]
		}
	})
	const init = async () => {
		const todayZeroTime = new Date();
		todayZeroTime.setHours(0, 0, 0, 0);
		const timestamp = todayZeroTime.getTime();
		if (timestamp > learnmodeStore().time) {
			const res = await $http.word.todayWord()
			wordList.value = res.data
			total.value = wordList.value.length
			current.value = 0
			currentProgress.value = 0
			doneWord.value = []
			wordinfo.value = {}
			recite.value = false
			doneTodayTask.value = false
			learnSuccess.value = false
			showWord.value = false
			learnmodeStore().setTime(timestamp)
			setObject()
		} else {
			// 已经加载今天学的单词了
			current.value = learnmodeStore().current
			wordList.value = learnmodeStore().wordList
			total.value = learnmodeStore().total
			recite.value = learnmodeStore().recite
			doneTodayTask.value = learnmodeStore().doneTodayTask
			currentProgress.value = learnmodeStore().currentProgress
			showWord.value = learnmodeStore().showWord
			doneWord.value = learnmodeStore().doneWord
			learnSuccess.value = learnmodeStore().learnSuccess
			wordinfo.value = learnmodeStore().wordinfo
		}

		loading.value = false
	}
	onMounted(() => {
		init()
	})
</script>

<style lang="scss" scoped>
	.recitelist {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 70%;
		background-color: #f5f5f5;
		padding: 15px;
		border-radius: $uni-border-radius-base;

		.reciteitem {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}

	.next {
		padding: 0 15px;
		gap: 15px;
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 60px;
		position: absolute;
		bottom: 15px;
		right: 0;
		left: 0;
		z-index: 9999;
	}

	.btn {
		width: 50%;
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