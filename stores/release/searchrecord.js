import {
	defineStore
} from 'pinia'
export const searchrecordModule = defineStore('searchrecord', {
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