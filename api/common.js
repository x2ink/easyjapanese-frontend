import http from '@/utils/request.js'
export default {
	retoken(userId) {
		return http.get(`token/reset/${userId}`)
	},
	getVerbTrans(word) {
		return http.get(`verbtrans/${word}`)
	},
	getGrammarList(level, page, size) {
		return http.get(`grammar/list/${level}/${page}/${size}`)
	},
	searchGrammar(val, page, size) {
		return http.get(`grammar/search/${page}/${size}/${val}`)
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
	},
	getCompositionList(page, size) {
		return http.get(`composition/list/${page}/${size}`)
	},
	getCompositionInfo(id) {
		return http.get(`composition/info/${id}`)
	},
	getDailyTalk(page, size) {
		console.log(page, size);
		return http.get(`dailytalk/${page}/${size}`)
	}
}