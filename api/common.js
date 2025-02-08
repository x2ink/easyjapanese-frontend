import http from '@/utils/request.js'
export default {
	retoken(userId) {
		return http.get(`token/reset/${userId}`)
	},
	getVerbTrans(word) {
		return http.get(`verbtrans/${word}`)
	},
	getGrammarList(id) {
		return http.get(`grammar`)
	},
	getGrammarInfo(id) {
		return http.get(`grammar/${id}`)
	},
	feedback(data) {
		return http.post(`feedback`, data)
	}
}