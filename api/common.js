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
	},
	getMessageList(page, size, type) {
		return http.get(`message/${type}/${page}/${size}`)
	},
	readMessage(id) {
		return http.get(`message/read/${id}`)
	},
	getUnread(id) {
		return http.get(`unread`)
	},
	getMessageInfo(id) {
		return http.get(`message/info/${id}`)
	}
}