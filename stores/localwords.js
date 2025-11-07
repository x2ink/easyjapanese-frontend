import {
	defineStore
} from 'pinia'
export const localwordsModule = defineStore('localwords', {
	unistorage: true,
	state: () => {
		return {
			writeWordList: [],
			reviewCache: {
				wordinfo: {},
				doneTask: false,
				showAnswer: false,
				know: false,
				sessionStep: 0,
				learningPhase: 'initial',
				interleaveCounter: 0,
				isReviewTurn: true,
				reviewTurnsLeft: 2,
				heldReviewWord: null,
				initialQueue: [],
				pendingNew: [],
				reviewQueue: [],
				learnedQueue: [],
				wordList: []
			},
			reviewTime: 0,
			learnCache: {
				wordinfo: {},
				doneTask: false,
				showAnswer: false,
				know: false,
				sessionStep: 0,
				learningPhase: 'initial',
				interleaveCounter: 0,
				isReviewTurn: true,
				reviewTurnsLeft: 2,
				heldReviewWord: null,
				initialQueue: [],
				pendingNew: [],
				reviewQueue: [],
				learnedQueue: [],
				wordList: []
			},
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
			this.reviewCache = {
				wordinfo: {},
				doneTask: false,
				showAnswer: false,
				know: false,
				sessionStep: 0,
				learningPhase: 'initial',
				interleaveCounter: 0,
				isReviewTurn: true,
				reviewTurnsLeft: 2,
				heldReviewWord: null,
				initialQueue: [],
				pendingNew: [],
				reviewQueue: [],
				learnedQueue: [],
				wordList: []
			};
		},
		setLearnCache(cache) {
			this.learnCache = cache
		},
		setLearnTime(time) {
			this.learnTime = time
		},
		clearLearnCache() {
			this.learnTime = 0;
			this.learnCache = {
				wordinfo: {},
				doneTask: false,
				showAnswer: false,
				know: false,
				sessionStep: 0,
				learningPhase: 'initial',
				interleaveCounter: 0,
				isReviewTurn: true,
				reviewTurnsLeft: 2,
				heldReviewWord: null,
				initialQueue: [],
				pendingNew: [],
				reviewQueue: [],
				learnedQueue: [],
				wordList: []
			};
		}
	}
})