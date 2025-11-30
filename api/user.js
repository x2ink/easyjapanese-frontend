import http from '@/utils/request.js'
export default {
	setUserInfo(data) {
		return http.post(`user/info`, data)
	},
	wxLogin(data) {
		return http.post(`wxlogin`, data)
	},
	getUserInfoSimple() {
		return http.get(`user/info`)
	},
	getConfig() {
		return http.get(`config`)
	},
	updateConfig(data) {
		return http.post(`config`, data)
	},
	ranking() {
		return http.get(`ranking`)
	}
}