import http from '@/utils/request.js'
export default {
	add(data) {
		return http.post(`comment`, data)
	},
	getList(target, target_id, page, size) {
		return http.get(`comment/${target}/${target_id}/${page}/${size}`)
	},
	getChildComment(parent_id, page, size) {
		return http.get(`comment/child/${parent_id}/${page}/${size}`)
	},
	like(id) {
		return http.post(`comment/like/${id}`)
	}
}