import http from '@/utils/request.js'
export default {
	add(data) {
		return http.post(`comment`, data)
	},
	getList(target, target_id, page, size, sort, hide_id) {
		return http.get(`comment/${target}/${target_id}/${page}/${size}/${sort}/${hide_id}`)
	},
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