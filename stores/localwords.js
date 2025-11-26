import {
	defineStore
} from 'pinia'

// 默认空状态
const defaultCacheState = {
	wordinfo: {},
	doneTask: false,
	showAnswer: false,
	know: false,
	sessionStep: 0,
	lastWordId: null,
	nextShouldBeNew: true,
	queuePending: [],
	queueActive: [],
	queueCompleted: [],
	queueHard: [],
	wordList: [],
}

export const localwordsModule = defineStore('localwords', {
	unistorage: true,
	state: () => {
		return {
			writeWordList: [],
			// 确保缓存字段结构完整，避免 undefined 错误
			reviewCache: JSON.parse(JSON.stringify(defaultCacheState)),
			reviewTime: 0,
			learnCache: JSON.parse(JSON.stringify(defaultCacheState)),
			learnTime: 0,
		}
	},
	actions: {
		setWriteWordList(data) {
			this.writeWordList = data
		},
		setReviewCache(cache) {
			this.reviewCache = cache
		},
		setReviewTime(time) {
			this.reviewTime = time
		},
		clearReviewCache() {
			this.reviewTime = 0;
			this.reviewCache = JSON.parse(JSON.stringify(defaultCacheState));
		},
		setLearnCache(cache) {
			this.learnCache = cache
		},
		setLearnTime(time) {
			this.learnTime = time
		},
		clearLearnCache() {
			this.learnTime = 0;
			this.learnCache = JSON.parse(JSON.stringify(defaultCacheState));
		}
	}
})