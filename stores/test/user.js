import {
	defineStore
} from 'pinia'
export const test_userModule = defineStore('test_user', {
	unistorage: true, // 是否持久化
	state: () => {
		return {
			token: '',
			userInfo: {
				id: '',
			}
		}
	},
	getters: {
		loginStatus: (state) => state.token.length > 0,
	},
	actions: {
		setToken(token) {
			this.token = token
		},
		setUserInfo(info) {
			this.userInfo = info
		},
		clearTokenInfo() {
			this.token === ''
			uni.removeStorageSync('test_user')
		}
	}
})