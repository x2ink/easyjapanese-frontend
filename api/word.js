import http from '@/utils/request.js'
export default {
	jcSearch(page, size, val) {
		return http.get(`jc/search/${page}/${size}/${val}`)
	},
	jcInfo(id) {
		return http.get(`jc/info/${id}`)
	},
	cjSearch(page, size, val) {
		return http.get(`cj/search/${page}/${size}/${val}`)
	},
	cjInfo(id) {
		return http.get(`cj/info/${id}`)
	},
	getWordBook() {
		return http.get(`wordbook`)
	},
	getWordBookList(id, page, size) {
		return http.get(`wordbook/${id}/${page}/${size}`)
	},
	todayWord() {
		return http.get("todayword")
	},
	writeFromMemory() {
		return http.get("learn/writefrommemory")
	},
	recordlearn(data) {
		return http.post("learn/record/add", data)
	},
	updaterecord(data) {
		return http.post("learn/record/update", data)
	},
	getTodayReview() {
		return http.get("learn/review")
	},
	getHomeInfo() {
		return http.get("learn/info")
	},
	addMyBooks(data) {
		return http.post("mybooks", data)
	},
	getMyBooks() {
		return http.get("mybooks")
	},
	addMyBooks(data) {
		return http.post("mybooks", data)
	},
	setMyBooks(id, data) {
		return http.post(`mybooks/set/${id}`, data)
	},
	addMyBooksWord(data) {
		return http.post("mybooks/add", data)
	},
	getMyBooksWord(id, page, size) {
		return http.get(`mybooks/list/${id}/${page}/${size}`)
	},
	deleteMyBooks(id) {
		return http.post(`mybooks/del/book/${id}`)
	},
	deleteMyBooksWord(wordid,bookid) {
		return http.post(`mybooks/del/word/${wordid}/${bookid}`)
	}
}