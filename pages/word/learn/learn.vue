<template>
	<Navbar :title="`单词${recite?'背诵':'学习'}`">
		<template #bottom>
			<wd-progress :percentage="progress" hide-text />
		</template>
	</Navbar>
	<view v-show="loading" class="loading _GCENTER">
		<wd-loading />
	</view>
	<view v-if="!loading">
		<view v-if="!learnSuccess">
			<view style="padding:10px 15px;">
				<view class="word jpfont">
					<text>{{wordinfo.word.word}}</text>
				</view>
				<view class="hira jpfont">
					<span>{{wordinfo.word.kana}}{{wordinfo.word.tone}}</span>|
					<span>{{wordinfo.word.rome}}</span>
				</view>
				<view class="tools">
					<view class="item">
						<text>发音</text>
						<wd-icon name="sound" size="14px"></wd-icon>
					</view>
					<view class="item" @click="goPage(`/pages/word/followread/followread`,{
						word:wordinfo.word.kana,
						id:wordinfo.word.id
					})">
						<text>默写</text>
						<wd-icon name="edit" size="14px"></wd-icon>
					</view>
					<view class="item" @click="emits('openBook')">
						<text>生词本</text>
						<wd-icon name="books" size="14px"></wd-icon>
					</view>
				</view>
			</view>
			<view class="examples">
				<wd-skeleton theme="text" />
				<wd-skeleton theme="text" />
				<wd-skeleton theme="text" />
				<view class="example" :key="item.id" v-for="item in wordinfo.word.example.slice(0, 3)">
					<view>
						<view class="ja jpfont">
							<view class="worditem" v-for="item1 in item.read">
								<view class="top">{{item1.top}}</view>
								<view :class="{underline:item1.top}" class="body">{{item1.body}}</view>
							</view>
						</view>
						<view class="ch">
							<wd-tag custom-class="space" type="warning">译</wd-tag>
							<!-- <text>{{item.ch}}</text> -->
							<view>点击查看翻译</view>
						</view>
					</view>
				</view>
			</view>
			<!-- <Option @answer="answer" :data="wordinfo.meaning_option"></Option> -->
			<view class="_GCENTER" @click="goPage('/otherpages/feedback/feedback', {
					type:'单词纠错',
					wordid,
					wordtype:'jc'
				})" style="margin-top: 20px;gap: 10px;">
				<wd-button type="info" size="small" plain hairline icon="rollback">上一个</wd-button>
				<wd-button type="info" size="small" plain hairline icon="edit">纠错</wd-button>
				<wd-button type="info" size="small" plain hairline icon="tips">标熟</wd-button>
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
						<!-- <WordDetail :wordinfo="wordinfo" type="jc"></WordDetail> -->
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
	<!-- 占位 -->
	<view style="height: calc(60px + env(safe-area-inset-bottom));">

	</view>
	<view class="handle">
		<!-- 	<view class="btn _GCENTER">
			<text>看答案</text>
			<view style="background-color: #F0883A;"></view>
		</view> -->
		<view class="btn _GCENTER">
			<text>认识</text>
			<view style="background-color: #34D19D;"></view>
		</view>
		<view class="btn _GCENTER">
			<text>不认识</text>
			<view style="background-color: #F0883A;"></view>
		</view>
		<!-- 		<view class="btn _GCENTER">
			<text>下一个</text>
			<view style="background-color: #34D19D;"></view>
		</view>
		<view class="btn _GCENTER">
			<text>记错了</text>
			<view style="background-color: #F0883A;"></view>
		</view> -->
		<!-- <wd-button @click="previousWord" :round="false" size="large" type="info">上一个</wd-button> -->
		<!-- <wd-button @click="nextWord" :round="false" size="large">看答案</wd-button> -->
		<!-- <wd-button @click="nextWord" :round="false" size="large">下一个</wd-button> -->
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
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	import Option from '@/components/learnword/option.vue'
	const toast = useToast()
	const loading = ref(true)
	const wordinfo = ref({})
	const wordsSelectMeaningRef = ref(null)
	const init = async () => {
		const res = await $http.word.todayWord()
		wordList.value = res.data
		wordinfo.value = res.data[0]
		loading.value = false
	}
	onMounted(() => {
		init()
	})











	import WordsSelectMeaning from "@/components/learnword/wordsSelectMeaning.vue"
	import MeaningSelectWords from "@/components/learnword/meaningSelectWords.vue"
	import SelectKana from "@/components/learnword/selectKana.vue"
	import SoundSelectWord from "@/components/learnword/soundSelectWord.vue"
	// import WordDetail from "@/components/worddetail.vue"

	import {
		learnmodeStore
	} from "@/stores/index.js"

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


	const selectKanaRef = ref(null)

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
</script>

<style lang="scss" scoped>
	:deep(.wd-progress) {
		padding-top: 0px;
	}

	.examples {
		position: relative;
		display: flex;
		flex-direction: column;
		background-color: white;
		border-radius: 8px;
		padding: 15px;
		margin: 15px;
		gap: 15px;

		.example {
			.ch {
				margin-top: 5px;
				padding: 5px;
				display: flex;
				align-items: center;
				gap: 5px;
				font-size: $uni-font-size-base;
				color: $uni-text-color-grey;
				background-color: $uni-bg-color-grey;
				border-radius: 4px;
			}

			.ja {
				display: flex;
				flex-wrap: wrap;

				.worditem {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					.top {
						// color: #57D09B;
						font-size: 8px;
						height: 8px;
						margin: 0 2px;
					}

					.body {
						font-size: $uni-font-size-base;
					}

					.underline {
						// color: #57D09B;
						text-decoration: underline;
					}
				}
			}
		}
	}

	.recitelist {
		width: calc(100vw - 30px);
		display: flex;
		flex-direction: column;
		gap: 10px;
		background-color: #fff;
		padding: 20px 30px;
		margin-top: 20px;
		box-sizing: border-box;
		border-radius: $uni-border-radius-base;

		.reciteitem {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}

	.handle {
		border-top: #f5f5f5 2px solid;
		background-color: white;
		padding: 15px;
		gap: 15px;
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding-bottom: env(safe-area-inset-bottom);
		position: fixed;
		bottom: 0px;
		right: 0;
		left: 0;
		z-index: 9999;

		.btn {
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

	.loading {
		margin-top: 40px;
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

	.tools {
		display: flex;
		margin-top: 10px;
		gap: 10px;

		>.item {

			display: flex;
			align-items: center;
			justify-content: center;
			gap: 2px;
			padding: 0 10px;
			color: white;
			border-radius: 24px;
			height: 24px;
			background-color: #5880F2;
			// &:nth-of-type(1) {

			// }

			// &:nth-of-type(2) {
			// 	background-color: #5880F2;
			// }

			text {
				font-size: $uni-font-size-sm;
				line-height: $uni-font-size-sm;
			}
		}
	}
</style>