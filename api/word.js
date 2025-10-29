import http from '@/utils/request.js'
export default {
	jcSearch(data) {
		return http.get(`jc/list`, data)
	},
	jcInfo(data) {
		return http.get(`jc/info`, data)
	},
	// 获取单词书的单词列表
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



	cjSearch(page, size, val) {
		return http.get(`cj/search/${page}/${size}/${val}`)
	},
	cjInfo(id) {
		return http.get(`cj/info/${id}`)
	},

	learnWord() {
		return http.get("learn")
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
	getReview() {
		return http.get("learn/review")
	},

	// 新增单词本
	addBook(data) {
		return http.post("book", data)
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
	setBook(id, data) {
		return http.put(`book/${id}`, data)
	},
	// 发布单词本
	releaseBook(id) {
		return http.post(`book/release/${id}`)
	},
	// 删除单词本
	deleteBook(id) {
		return http.delete(`book/${id}`)
	},
	// 移除单词
	removeBookWord(wordid, bookid) {
		return http.delete(`book/word/${bookid}/${wordid}`)
	},
	// 移除单词
	removeBookWords(bookid, data) {
		console.log(data);
		return http.delete(`book/word/${bookid}`, data)
	},
	// 加入单词
	addBookWord(data) {
		return http.post(`book/word`, data)
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