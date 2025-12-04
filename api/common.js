import http from '@/utils/request.js'

export default {
	// ---原有其他接口保留---
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
	// 新增笔记
	addNote(data) {
		return http.post(`notes/add`, data)
	},
	// 删除笔记 (Go后端接收 JSON body: { "id": 4 })
	deleteNote(data) {
		return http.post(`notes/delete`, data)
	},
	// 更新笔记
	updateNote(data) {
		return http.post("notes/update", data)
	},
	// 查询笔记列表 (Go后端接收 Query: page, pageSize)
	getNoteList(params) {
		return http.get(`notes/list`, params)
	},
	// 查询笔记详情 (Go后端接收 Query: id)
	getNoteInfo(params) {
		return http.get(`notes/info`, params)
	},
	// 查询笔记源 (Go后端接收 Query: type, id)
	queryNoteOrigin(params) {
		return http.get(`notes/origin`, params)
	}
}