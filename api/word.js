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
		return http.post("mybooks/book", data)
	},
	getMyBooks(id) {
		return http.get(`mybooks/book/${id}`)
	},
	setMyBooks(id, data) {
		return http.post(`mybooks/set/${id}`, data)
	},
	addMyBooksWord(data) {
		return http.post("mybooks/word", data)
	},
	getMyBooksWord(id, page, size) {
		return http.get(`mybooks/word/${id}/${page}/${size}`)
	},
	deleteMyBooks(id) {
		return http.delete(`mybooks/book/${id}`)
	},
	deleteMyBooksWord(wordid, bookid) {
		return http.delete(`mybooks/word/${wordid}/${bookid}`)
	},
	getRecommend() {
		return http.get(`recommend`)
	},
	followRead(data) {
		return http.post(`followread`, data)
	},
	getFollowRead(id, page, size) {
		return http.get(`followread/${id}/${page}/${size}`)
	},
	likeFollowRead(id) {
		return http.post(`followread/like`, id)
	},
	unlikeFollowRead(id) {
		return http.post(`followread/unlike`, id)
	},
	editWord(data) {
		return http.post(`editword`, data)
	},
	getEditWord(id) {
		return http.get(`editword/${id}`)
	}
}