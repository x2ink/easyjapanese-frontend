import {
	defineStore
} from 'pinia'
export const localwordsModule = defineStore('localwords', {
	unistorage: true,
	state: () => {
		return {
			time: 0,
			writeList: [],
			soundList: [],
			reviewCache: {
				total: 0,
				pendingNew: [],
				reviewQueue: [],
				learned: [],
				nextIsReview: false,
				initialQueue: [],
				answerShow: false,
				misrememberShow: false,
				knowBtnShow: false,
				wordList: [],
				current: {},
				wordinfo: {},
				pattern: 0
			},
			reviewTime: 0,
			learnCache: {
				total: 0,
				pendingNew: [],
				reviewQueue: [],
				learned: [],
				nextIsReview: false,
				initialQueue: [],
				answerShow: false,
				misrememberShow: false,
				knowBtnShow: false,
				wordList: [],
				current: {},
				wordinfo: {},
				pattern: 0
			},
			learnTime: 0,
			localWritefrommemory: [],
			localDictation: []
		}
	},
	actions: {
		setWritefrommemory(list) {
			this.localWritefrommemory = list
		},
		setDictation(list) {
			this.localDictation = list
		},
		setTime(time) {
			this.time = time
		},
		pushWrite(word) {
			this.writeList.push(word)
		},
		pushSound(word) {
			this.soundList.push(word)
		},
		setReviewCache(cache) {
			console.log("写入",cache);
			this.reviewCache = cache
		},
		setReviewTime(time) {
			this.reviewTime = time
		},
		setLearnCache(cache) {
			this.learnCache = cache
		},
		setLearnTime(time) {
			this.learnTime = time
		},
		clearReviewCache() {
			this.reviewTime = 0;
			this.reviewCache = {
				total: 0,
				pendingNew: [],
				reviewQueue: [],
				learned: [],
				nextIsReview: false,
				initialQueue: [],
				answerShow: false,
				misrememberShow: false,
				knowBtnShow: false,
				wordList: [],
				current: {},
				wordinfo: {},
				pattern: 0
			};
		},
		clearLearnCache() {
			this.learnTime = 0;
			this.learnCache = {
				total: 0,
				pendingNew: [],
				reviewQueue: [],
				learned: [],
				nextIsReview: false,
				initialQueue: [],
				answerShow: false,
				misrememberShow: false,
				knowBtnShow: false,
				wordList: [],
				current: {},
				wordinfo: {},
				pattern: 0
			};
		},
		clear() {
			this.time = 0;
			this.writeList = [];
			this.soundList = [];
		}
	}
})