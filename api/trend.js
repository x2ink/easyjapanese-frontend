import http from '@/utils/request.js'
export default {
	getSection(target) {
		return http.get(`section/${target}`)
	},
	addTrend(data) {
		return http.post(`trend`, data)
	},
	getMyTrendList(page, size) {
		return http.get(`trend/mylist/${page}/${size}`)
	},
	getTrendList(page, size, section) {
		return http.get(`trend/list/${page}/${size}/${section}`)
	},
	getTrendInfo(id) {
		return http.get(`trend/${id}`)
	},
	getHasLike(id) {
		return http.get(`trend/like/${id}`)
	},
	addLike(id) {
		return http.post(`trend/like/${id}`)
	},
	deleteTrend(id) {
		return http.delete(`trend/${id}`)
	}
}