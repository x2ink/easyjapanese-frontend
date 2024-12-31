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
	}
}