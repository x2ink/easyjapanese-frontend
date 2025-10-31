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





	getVerbTrans(word) {
		return http.get(`verbtrans/${word}`)
	},

	feedback(data) {
		return http.post(`feedback`, data)
	},
	addNote(data) {
		return http.post(`notes`, data)
	},
	delNote(id) {
		return http.delete(`notes/${id}`)
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
	getSentence() {
		return http.get(`sentence`)
	},
	getDailyTalk(page, size) {
		console.log(page, size);
		return http.get(`dailytalk/${page}/${size}`)
	}
}