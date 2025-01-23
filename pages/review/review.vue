<template>
	<NavBar title="记忆复习"></NavBar>
	<view v-show="loading" class="loading _GCENTER">
		<wd-loading />
	</view>
	<view v-if="!loading">
		<view v-if="doneTask" class="learnsuccess">
			<wd-icon style="margin-top: 40px;" name="check-circle-filled" size="80px" color="#34D19D"></wd-icon>
			<text>{{total}}个单词已复习完成！</text>
			<view style="display: flex;gap: 15px;margin-top: 40px;">
				<wd-button size="large" @click="startRecite">立刻默写</wd-button>
				<wd-button size="large" type="info" @click="startRecite">稍后默写</wd-button>
			</view>
		</view>
		<view v-else>
			<wd-progress :percentage="progress" hide-text />
			<view v-if="!showAnswer">
				<WordsThinkMeaning v-if="currentProgress==0" @answer="wtmAnswer" :wordinfo="wordInfo">
				</WordsThinkMeaning>
				<WordsSelectMeaning v-else-if="currentProgress==1" ref="wordsSelectMeaningRef" @answer="answerResult"
					:wordinfo="wordInfo">
				</WordsSelectMeaning>
				<MeaningThinkWord @answer="mtwAnswer" v-else-if="currentProgress==2" :wordinfo="wordInfo">
				</MeaningThinkWord>
			</view>
			<view v-else>
				<WordDetail :wordinfo="wordInfo" type="jc"></WordDetail>
				<view class="next">
					<wd-button v-if="showButton" @click="rememberError" custom-class="btn" :round="false" size="large"
						type="info">记错了</wd-button>
					<wd-button @click="nextWord" custom-class="btn" :round="false" size="large">下一词</wd-button>
				</view>
			</view>
		</view>
	</view>
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
	import WordsThinkMeaning from '@/components/review/wordsThinkMeaning.vue';
	import MeaningThinkWord from '@/components/review/meaningThinkWord.vue';
	import WordDetail from "@/components/worddetail.vue"
	import $http from "@/api/index.js"
	import WordsSelectMeaning from "@/components/learnword/wordsSelectMeaning.vue"
	import {
		reviewStore
	} from "@/stores/index.js"
	// 需要缓存的变量
	const current = ref(0)
	const wordList = ref([])
	const total = ref(0)
	const showAnswer = ref(false)
	const showButton = ref(true)
	const wordInfo = ref({})
	const currentProgress = ref(0)
	const doneTask = ref(false)
	const setObject = () => {
		reviewStore().setObj({
			current: current.value,
			wordList: wordList.value,
			total: total.value,
			showAnswer: showAnswer.value,
			showButton: showButton.value,
			currentProgress: currentProgress.value,
			wordInfo: wordInfo.value,
			doneTask: doneTask.value
		})
	}

	const loading = ref(true)
	const wordsSelectMeaningRef = ref(null)
	const startRecite = () => {

	}
	const rememberError = () => {
		let index = wordList.value[current.value].progress.findIndex(item => item === false)
		if (index == -1) {
			index = 2
		}
		wordList.value[current.value].progress[index] = false
		wordList.value[current.value].done = false
		wordList.value[current.value].exercise = true
			++wordList.value[current.value].error_count
		nextWord()
	}
	const nextWord = async () => {
		showAnswer.value = false
		for (let index = current.value + 1; index < total.value; index++) {
			if (!wordList.value[index].done) {
				currentProgress.value = wordList.value[index].progress.findIndex(item => item === false)
				if (currentProgress.value === 1) {
					await nextTick();
					wordsSelectMeaningRef.value.setOption(wordList.value[index].meaning_option)
				}
				wordInfo.value = wordList.value[index]
				current.value = index
				return
			}
		}
		let index = wordList.value.findIndex(item => item.done === false)
		if (index == -1) {
			doneTask.value = true
			let words = wordList.value.map(item => {
				return {
					id: item.id,
					error_count: item.error_count
				}
			})
			await $http.word.updaterecord({
				words: words
			})
			return
		}
		current.value = index
		wordInfo.value = wordList.value[index]
		currentProgress.value = wordList.value[index].progress.findIndex(item => item === false)
		if (currentProgress.value === 1) {
			await nextTick();
			console.log(wordsSelectMeaningRef.value);
			wordsSelectMeaningRef.value.setOption(wordList.value[index].meaning_option)
		}

	}
	const mtwAnswer = (e) => {
		showAnswer.value = true
		showButton.value = true
		if (e) {
			wordList.value[current.value].progress[2] = true
			wordList.value[current.value].done = true
		} else {
			++wordList.value[current.value].error_count
			showButton.value = false
		}
		setObject()
	}
	const answerResult = (e) => {
		setTimeout(() => {
			showAnswer.value = true
			showButton.value = false
			if (e) {
				wordList.value[current.value].progress[1] = true
			} else {
				++wordList.value[current.value].error_count
			}
			setObject()
		}, 500)
	}
	const wtmAnswer = (e) => {
		showAnswer.value = true
		if (e) {
			if (wordList.value[current.value].exercise) {
				wordList.value[current.value].progress[0] = true
			} else {
				wordList.value[current.value].done = true
			}
		} else {
			++wordList.value[current.value].error_count
			wordList.value[current.value].exercise = true
			showButton.value = false
		}
		setObject()
	}
	const progress = computed(() => {
		let sum = 0
		wordList.value.map((item) => {
			if (item.done) {
				++sum
			}
		})
		return (sum / total.value) * 100
	})
	const init = async () => {
		const todayZeroTime = new Date();
		todayZeroTime.setHours(0, 0, 0, 0);
		const timestamp = todayZeroTime.getTime();
		if (timestamp > reviewStore().time) {
			const res = await $http.word.getTodayReview()
			wordList.value = res.data
			let index = res.data.findIndex(item => item.done === false)
			current.value = index
			wordInfo.value = res.data[index]
			total.value = wordList.value.length
			reviewStore().setTime(timestamp)
			setObject()
		} else {
			// 已经加载今天学的单词了
			current.value = reviewStore().current
			wordList.value = reviewStore().wordList
			total.value = reviewStore().total
			showAnswer.value = reviewStore().showAnswer
			showButton.value = reviewStore().showButton
			currentProgress.value = reviewStore().currentProgress
			wordInfo.value = reviewStore().wordInfo
			doneTask.value = reviewStore().doneTask
		}
		loading.value = false
	}
	onMounted(() => {
		init()
	})
</script>

<style scoped lang="scss">
	.loading {
		margin-top: 40px;
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
	}

	.btn {
		width: 50%;
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