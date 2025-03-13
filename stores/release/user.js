import {
	defineStore
} from 'pinia'
import $http from "@/api/index.js"
export const userModule = defineStore('user', {
	unistorage: true,
	state: () => {
		return {
			token: '',
			userInfo: {
				address: "",
				avatar: '',
				nickname: '登录/注册',
				role: 1,
				email: ''
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
		setUserInfo: async (info) => {
			console.log("初始化用户信息");
			try {
				const res = await $http.user.getUserInfoSimple()
				this.userInfo = info
			} catch (err) {
				console.log("未登录", err);
			}
		},
		clearTokenInfo() {
			this.token === ''
			uni.removeStorageSync('test_user')
		}
	}
})