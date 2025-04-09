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
	addNote(data) {
		return http.post(`notes`, data)
	},
	delNote(id) {
		return http.delete(`notes/${id}`)
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