import {
	defineStore
} from 'pinia'
export const test_writefrommemoryModule = defineStore('test_writefrommemory', {
	unistorage: true,
	state: () => {
		return {
			time: 0,
			wordList: [],
		}
	},
	actions: {
		push(word) {
			this.wordList.push(word)
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