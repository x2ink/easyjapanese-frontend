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
	getSentence() {
		return http.get(`sentence`)
	},
	getDailyTalk(data) {
		return http.get(`dailytalk`, data)
	},
	getCultureList(data) {
		return http.get(`culture`, data)
	},
	breakSentence(data) {
		return http.post(`tools/break-sentence`, data)
	},
	submitNote(data) {
		return http.post(`notes/submit`, data)
	},
	deleteNote(data) {
		return http.post(`notes/delete`, data)
	},
	getNoteList(params) {
		return http.get(`notes/list`, params)
	},
	getNoteInfo(params) {
		return http.get(`notes/info`, params)
	},
	queryNoteOrigin(params) {
		return http.get(`notes/origin`, params)
	}
}