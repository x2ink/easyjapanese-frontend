import {
	defineStore
} from 'pinia'
export const test_reviewModule = defineStore('test_review', {
	unistorage: true,
	state: () => {
		return {
			time: 0,
			current: 0,
			wordList: [],
			total: 0,
			showAnswer: false,
			showButton: false,
			wordInfo: {},
			currentProgress: 0,
			doneTask: false
		}
	},
	actions: {
		setObj(obj) {
			this.current = obj.current
			this.wordList = obj.wordList
			this.total = obj.total
			this.showAnswer = obj.showAnswer
			this.showButton = obj.showButton
			this.currentProgress = obj.currentProgress
			this.wordInfo = obj.wordInfo
			this.doneTask = obj.doneTask
		},
		setTime(time) {
			this.time = time
		},
		clear() {
			this.time = 0;
			this.current = 0
			this.wordList = []
			this.total = 0
			this.showAnswer = false
			this.showButton = false
			this.currentProgress = 0
			this.wordInfo = {}
			this.doneTask = false
		}
	}
})