import http from '@/utils/request.js'
export default {
	jaSearch(page, size, val) {
		return http.get(`ja/search/${page}/${size}/${val}`)
	},
	jaInfo(id) {
		return http.get(`ja/info/${id}`)
	}
}