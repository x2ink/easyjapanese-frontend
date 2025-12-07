import {
	defineStore
} from 'pinia'
export const historyrecordModule = defineStore('historyrecord', {
	unistorage: true, 
	state: () => {
		return {
			wordlist: [],
			trendlist: []
		}
	},
	actions: {
		push(val, type) {
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
		},
		del(type, val) {
			if (type == 'word') {
				this.wordlist = this.wordlist.filter(item => item != val)
			} else {
				this.trendlist = this.trendlist.filter(item => item != val)
			}
		}
	}
})