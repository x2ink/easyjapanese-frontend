import {
	defineStore
} from 'pinia'
export const historyrecordModule = defineStore('historyrecord', {
	unistorage: true, // 是否持久化
	state: () => {
		return {
			wordlist: [],
			trendlist: []
		}
	},
	actions: {
		push(val,type) {
			if (type == 'word') {
				this.wordlist.unshift(val)
			} else {
				this.trendlist.unshift(val)
			}
		},
		clear(type) {
			if (type == 'word') {
				this.wordlist = []
			} else {
				this.trendlist = []
			}
		}
	}
})