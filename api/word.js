import http from '@/utils/request.js'
export default {
	jcSearch(data) {
		return http.get(`jc/list`, data)
	},
	jcInfo(data) {
		return http.get(`jc/info`, data)
	},
	getBookWord(data) {
		return http.get(`word/list`, data)
	},
	getRecommend() {
		return http.get(`recommend`)
	},
	getWordBookList() {
		return http.get(`book/list`)
	},
	getHomeInfo() {
		return http.get("homeinfo")
	},
	getFollowRead(data) {
		return http.get(`read`, data)
	},
	followRead(data) {
		return http.post(`read`, data)
	},
	getContainBook(data) {
		return http.get(`book/word`, data)
	},
	removeBookWords(data) {
		return http.post(`word/delete`, data)
	},
	addBookWord(data) {
		return http.post(`word/add`, data)
	},
	
	addBook(data) {
		return http.post("book/add", data)
	},
	deleteBook(data) {
		return http.post(`book/delete`, data)
	},
	setBook(data) {
		return http.post(`book/info`, data)
	},
	submitWord(data) {
		return http.post(`review`, data)
	},
	learnWord() {
		return http.get("learn")
	},
	getReview() {
		return http.get("review")
	},
	getLearnt(data) {
		return http.get("learnt", data)
	},
	setLearnt(data) {
		return http.post("learnt", data)
	},
	getListenOptions(data) {
		return http.get("listen/options", data)
	},
	submitEditWord(data) {
		return http.post("edit/submit", data)
	},
	getEditHistory(data) {
		return http.get("edit/history", data)
	}
}