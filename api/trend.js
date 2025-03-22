import http from '@/utils/request.js'
export default {
	getSection(target) {
		return http.get(`section`)
	},
	addTrend(data) {
		return http.post(`trend`, data)
	},
	getTrendList(page, size, section) {
		return http.get(`trend/${section}/${page}/${size}`)
	},
	searchTrend(page, size,val) {
		return http.get(`trend/search/${page}/${size}/${val}`)
	},
	getTrendInfo(id) {
		return http.get(`trend/info/${id}`)
	},
	getMyTrendList(page, size) {
		return http.get(`mytrend/${page}/${size}`)
	},
	addTrendLike(id) {
		return http.post(`trend/like/${id}`)
	},
	deleteTrend(id) {
		return http.delete(`trend/${id}`)
	},
	addComment(data) {
		return http.post(`comment`, data)
	},
	getCommentList(trend_id, page, size, sort, hide_id) {
		return http.get(`comment/${trend_id}/${sort}/${page}/${size}/${hide_id}`)
	},
	getChildComment(parent_id, page, size, sort) {
		return http.get(`comment/child/${parent_id}/${page}/${size}/${sort}`)
	},
	deleteComment(id) {
		return http.delete(`comment/${id}`)
	},
	topComment(id) {
		return http.put(`comment/top/${id}`)
	},
	addCommentLike(id) {
		return http.post(`comment/like/${id}`)
	}
}