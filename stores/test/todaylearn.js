import {
	defineStore
} from 'pinia'
export const test_todaylearnModule = defineStore('test_todaylearn', {
	unistorage: true, // 是否持久化
	state: () => {
		return {
			time: 0,
			wordList: [],
		}
	},
	actions: {
		setList(wordList) {
			this.wordList = wordList
		},
		unshift(data) {
			this.wordList.unshift(data)
		},
		update(index, data) {
			this.wordList[index] = data
		},
		setTime(time) {
			this.time = time
		},
		clear() {
			this.time = 0;
			this.wordList = [];
		}
	}
})