import http from '@/utils/request.js'
export default {
	uploadbase64(data) {
		return http.post(`base64`, data)
	},
	retoken(userId) {
		return http.get(`token?userId=${userId}`)
	},
	like(data) {
		return http.post(`like`, data)
	},
	getGrammarList(data) {
		return http.get(`grammar/list`, data)
	},
	getGrammarInfo(data) {
		return http.get(`grammar/info`, data)
	},
	getVerbTrans(data) {
		return http.get(`verbtrans`, data)
	},
	feedback(data) {
		return http.post(`feedback`, data)
	},
	addNote(data) {
		return http.post(`notes`, data)
	},
	delQuote(id) {
		return http.delete(`notes/quote/${id}`)
	},
	likeNote(type, id) {
		return http.get(`notes/like/${type}/${id}`)
	},
	getNoteList(id, page, size) {
		return http.get(`notes/list/${id}/${page}/${size}`)
	},
	getSelfNoteList(page, size) {
		return http.get(`notes/self/${page}/${size}`)
	},
	getNoteInfo(id) {
		return http.get(`notes/info/${id}`)
	},
	getSentence() {
		return http.get(`sentence`)
	},
	getDailyTalk(page, size) {
		return http.get(`dailytalk/${page}/${size}`)
	},
	// 句子拆分
	breakSentence(data) {
		return http.post(`tools/break-sentence`, data)
	}
}