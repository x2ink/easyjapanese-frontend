import {
	defineStore
} from 'pinia'
export const test_localwordsModule = defineStore('test_localwords', {
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
				answerShow:false,
				misrememberShow:false,
				knowBtnShow:false,
				wordList:[],
				current:{},
				wordinfo:{},
				pattern:0
			},
			reviewTime: 0,
			learnCache: {
				total: 0,
				pendingNew: [],
				reviewQueue: [],
				learned: [],
				nextIsReview: false,
				initialQueue: [],
				answerShow:false,
				misrememberShow:false,
				knowBtnShow:false,
				wordList:[],
				current:{},
				wordinfo:{},
				pattern:0
			},
			learnTime: 0
		}
	},
	actions: {
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
				initialQueue: []
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
				initialQueue: []
			};
		},
		clear() {
			this.time = 0;
			this.writeList = [];
			this.soundList = [];
		}
	}
})