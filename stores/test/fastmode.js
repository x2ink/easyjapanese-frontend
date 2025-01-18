import {
	defineStore
} from 'pinia'
export const test_fastmodeModule = defineStore('test_fastmode', {
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
		setTime(time) {
			this.time = time
		},
		clear() {
			this.time = 0;
			this.wordList = [];
		}
	}
})