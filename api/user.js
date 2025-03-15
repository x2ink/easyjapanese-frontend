import http from '@/utils/request.js'
export default {
	getChartList() {
		return http.get('note/info')
	},
	getCaptcha(type, email) {
		return http.get(`captcha/${type}/${email}`)
	},
	register(data) {
		return http.post(`register`, data)
	},
	login(type, data) {
		return http.post(`login/${type}`, data)
	},
	wxLogin(data) {
		return http.post(`wxlogin`, data)
	},
	getUserInfoSimple() {
		return http.get(`user/info/simple`)
	},
	getConfig() {
		return http.get(`config`)
	},
	updateConfig(data) {
		return http.post(`config`, data)
	},
	setUserInfo(data) {
		return http.put(`user/info`, data)
	},
	ranking() {
		return http.get(`ranking`)
	},
	repwd(data) {
		return http.post(`repwd`, data)
	}
}