import {
	defineStore
} from 'pinia'
export const writefrommemoryModule = defineStore('writefrommemory', {
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