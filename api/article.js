import http from '@/utils/request.js'
export default {
	getList(page, size) {
		return http.get(`article/list/${page}/${size}`)
	},
	getInfo(id) {
		return http.get(`article/info/${id}`)
	}
}