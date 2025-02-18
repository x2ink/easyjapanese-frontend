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
	getNoticeList(page, size) {
		return http.get(`notice/list/${page}/${size}`)
	},
	getNoticeInfo(id) {
		return http.get(`notice/info/${id}`)
	},
	getLikeRecordList(page, size) {
		return http.get(`likerecord/${page}/${size}`)
	},
	getMessageList(page, size) {
		return http.get(`message/${page}/${size}`)
	},
	getUnread() {
		return http.get(`unread`)
	},
	setMessageRead(id) {
		return http.get(`message/read/${id}`)
	}
}