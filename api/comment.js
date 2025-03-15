import http from '@/utils/request.js'
export default {
	getChildComment(parent_id, page, size, sort) {
		return http.get(`comment/child/${parent_id}/${page}/${size}/${sort}`)
	},
	like(id) {
		return http.post(`comment/like/${id}`)
	},
	getOne(data) {
		return http.post(`comment/getone`, data)
	}
}