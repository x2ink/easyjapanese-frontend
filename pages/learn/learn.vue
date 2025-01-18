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
							:wordinfo="wordList[current]">
						</SelectKana>
						<!-- 单词选择意思 -->
						<WordsSelectMeaning ref="wordsSelectMeaningRef" @answer="answerResult"
							v-else-if="currentProgress==1" :wordinfo="wordList[current]">
						</WordsSelectMeaning>
						<!-- 意思选择单词 -->
						<MeaningSelectWords ref="meaningSelectWordsRef" @answer="answerResult"
							v-else-if="currentProgress==2" :wordinfo="wordList[current]">
						</MeaningSelectWords>
						<!-- 发音选择单词 -->
						<SoundSelectWord ref="soundSelectWordRef" @answer="answerResult" v-else-if="currentProgress==3"
							:wordinfo="wordList[current]"></SoundSelectWord>
					</view>
					<view v-else>
						<WordDetail :wordinfo="wordList[current]" type="jc"></WordDetail>
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
						<wd-button size="large" @click="startRecite">立刻默写</wd-button>
						<wd-button size="large" type="info" @click="startRecite">稍后默写</wd-button>
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


	const loading = ref(true)
	const selectKanaRef = ref(null)
	const wordsSelectMeaningRef = ref(null)
	const meaningSelectWordsRef = ref(null)
	const soundSelectWordRef = ref(null)
	const reciteDone = computed(() => {
		return (doneWord.value.length / total.value) * 100
	})
	const answerResult = (e) => {
		if (e) {
			wordList.value[current.value].progress[currentProgress.value] = true
		} else {
			++wordList.value[current.value].error_count
			if (wordList.value[current.value].kana == wordList.value[current.value].word) {
				wordList.value[current.value].progress = [true, false, false, false]
			} else {
				wordList.value[current.value].progress[currentProgress.value] = [false, false, false, false]
			}
		}
		setTimeout(() => {
			showWord.value = true
		}, 500)
	}
	const isDone = () => {
		for (let item of wordList.value[current.value].progress) {
			if (!item) {
				return false
			}
		}
		return true
	}
	const continueNext = () => {
		if (isDone()) {
			doneWord.value.push({
				id: wordList.value[current.value].id,
				word: wordList.value[current.value].word,
				error_count: wordList.value[current.value].error_count,
			})
			if (current.value == wordList.value.length - 1) {
				--current.value
				wordList.value.splice(wordList.value.length - 1, 1)
			} else {
				wordList.value.splice(current.value, 1)
			}
		} else {
			let nextIndex = current.value + 1
			if (nextIndex > wordList.value.length - 1) {
				current.value = 0
			} else {
				++current.value
			}
		}
		if (wordList.value.length == 0) {
			doneTodayTask.value = true
			learnmodeStore().clear()
			return
		}
		currentProgress.value = getProgress(wordList.value[current.value].progress)
		showWord.value = false
		setOption(currentProgress.value)
		setObject()
	}
	const setOption = async (index) => {
		await nextTick();
		if (index == 0) {
			selectKanaRef.value.setOption(wordList.value[current.value].kana_option)
		} else if (index == 1) {
			wordsSelectMeaningRef.value.setOption(wordList.value[current.value].meaning_option)
		} else if (index == 2) {
			meaningSelectWordsRef.value.setOption(wordList.value[current.value].word_option)
		} else if (index == 3) {
			soundSelectWordRef.value.setOption(wordList.value[current.value].voice_option)
		}
	}
	const getProgress = (arr) => {
		for (let index in arr) {
			if (!arr[index]) {
				return index
			}
		}
		return -1
	}
	const startRecite = () => {
		current.value = 0
		currentProgress.value = getProgress(wordList.value[current.value].progress)
		recite.value = true
		setOption(currentProgress.value)
	}
	const progress = computed(() => {
		return (current.value / (wordList.value.length)) * 100
	})
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
			learnSuccess: learnSuccess.value
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
	const init = async () => {
		const todayZeroTime = new Date();
		todayZeroTime.setHours(0, 0, 0, 0);
		const timestamp = todayZeroTime.getTime();
		if (timestamp > learnmodeStore().time) {
			const res = await $http.word.todayWord()
			wordList.value = res.data
			total.value = wordList.value.length
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
			if (recite.value) {
				setOption(currentProgress.value)
			}
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