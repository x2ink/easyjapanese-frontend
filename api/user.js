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
	getUserInfoSimple() {
		return http.get(`user/info/simple`)
	}
}