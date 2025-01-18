import {
	defineStore
} from 'pinia'
export const test_learnmodeModule = defineStore('test_learnmode', {
	unistorage: true, // 是否持久化
	state: () => {
		return {
			time: 0,
			current: 0,
			wordList: [],
			total: 0,
			recite: false,
			doneTodayTask: false,
			currentProgress: 0,
			showWord: false,
			doneWord: [],
			learnSuccess: false
		}
	},
	actions: {
		setObj(obj) {
			this.current = obj.current
			this.wordList = obj.wordList
			this.total = obj.total
			this.recite = obj.recite
			this.doneTodayTask = obj.doneTodayTask
			this.currentProgress = obj.currentProgress
			this.showWord = obj.showWord
			this.doneWord = obj.doneWord
			this.learnSuccess = obj.learnSuccess
		},
		setTime(time) {
			this.time = time
		},
		clear() {
			this.time = 0;
			this.current = 0;
			this.wordList = [];
			this.total = 0;
			this.recite = false;
			this.doneTodayTask = false;
			this.currentProgress = 0;
			this.showWord = false;
			this.doneWord = [];
			this.learnSuccess = false;
		}
	}
})