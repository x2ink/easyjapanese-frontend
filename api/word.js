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
		return http.get(`book/list`)
	},
	getWordBookList() {
		return http.get(`book/list`)
	},
	learnWord() {
		return http.get("learn/newword")
	},
	writeFromMemory(data) {
		return http.post("learn/writefrommemory", data)
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
	getHomeInfo() {
		return http.get("learn/info")
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
	// 获取单词书的单词列表
	getBookWord(id, page, size, val) {
		return http.get(`book/word/${id}/${page}/${size}/${val}`)
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