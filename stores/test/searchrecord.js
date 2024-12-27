import {
	defineStore
} from 'pinia'
export const test_searchrecordModule = defineStore('test_searchrecord', {
	unistorage: true, // 是否持久化
	state: () => {
		return {
			list: []
		}
	},
	actions: {
		push(val) {
			this.list.unshift(val)
		},
		clear() {
			this.list = []
		}
	}
})