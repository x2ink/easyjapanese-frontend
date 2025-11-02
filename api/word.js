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
	// 新增单词本
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




	cjSearch(page, size, val) {
		return http.get(`cj/search/${page}/${size}/${val}`)
	},
	cjInfo(id) {
		return http.get(`cj/info/${id}`)
	},


	getTodaywords(data) {
		return http.post("learn/gettodaywords", data)
	},
	getOptions(data) {
		return http.post("learn/getoptions", data)
	},
	recordlearn(data) {
		return http.post("learn/record/add", data)
	},
	updaterecord(data) {
		return http.post("learn/record/update", data)
	},



	// 获取我的单词本
	getSelfBooks(id) {
		return http.get(`book/self/${id}`)
	},
	// 获取我的单词本
	getSelfBooks(id) {
		return http.get(`book/self/${id}`)
	},
	// 修改我的单词本

	// 发布单词本
	releaseBook(id) {
		return http.post(`book/release/${id}`)
	},
	// 删除单词本






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