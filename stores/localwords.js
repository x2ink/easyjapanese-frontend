import {
	defineStore
} from 'pinia'

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