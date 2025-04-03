var baseUrl;
if (process.env.NODE_ENV === 'development') {
	console.log('开发环境');
	baseUrl = "http://127.0.0.1:8080/"
} else {
	console.log('生产环境');
	baseUrl = "http://127.0.0.1/"
}
import $http from "@/api/index.js"
import {
	userStore
} from "@/stores/index.js"
const http = {
	baseUrl: baseUrl,
	request(config) {
		config = beforeRequest(config)
		config.url = this.baseUrl + config.url
		return new Promise((resolve, reject) => {
			uni.request(config).then(res => {
				const response = beforeResponse(config, res)
				resolve(response)
			}).catch(err => {
				errorHandle()
				reject(err)
			})
		})
	},
	get(url, params) {
		return this.request({
			url: url,
			params: params,
			method: 'GET'
		})
	},
	post(url, data) {
		return this.request({
			url: url,
			data: data,
			method: 'POST'
		})
	},
	put(url, data) {
		return this.request({
			url: url,
			data: data,
			method: 'PUT'
		})
	},
	delete(url) {
		return this.request({
			url: url,
			method: 'DELETE'
		})
	}
}
// 请求拦截器
const beforeRequest = (config) => {
	let token = userStore().token
	config.header = {
		"Authorization": token
	}
	return config
}
//响应拦截器
const beforeResponse = async (config, response) => {
	const {
		statusCode,
		data
	} = response;
	if (statusCode >= 400 && statusCode < 500) {
		if (statusCode == 401) {
			if (data.code === 4001) {
				try {
					const tokenRes = await $http.common.retoken(userStore().userInfo.id)
					console.log(tokenRes);
					userStore().setToken(tokenRes.data)
					config.header = {
						"Authorization": tokenRes.data
					}
					config.url = config.url.replace(http.baseUrl, '')
					const res = await http.request(config)
					return new Promise((resolve, reject) => {
						resolve(res)
					});
				} catch (err) {
					uni.navigateTo({
						url: "/pages/login/login"
					});
					return new Promise((resolve, reject) => {
						reject(response.data)
					});
				}
			} else {
				uni.navigateTo({
					url: "/pages/login/login"
				})
				return new Promise((resolve, reject) => {
					reject(response.data)
				});
			}
		} else {
			return new Promise((resolve, reject) => {
				reject(response.data)
			});
		}
	} else if (statusCode >= 500) {
		return new Promise((resolve, reject) => {
			reject(response.data)
		});
	} else {
		return new Promise((resolve, reject) => {
			resolve(response.data)
		});
	}
}
//异常处理
const errorHandle = (err) => {
	console.log('网络异常,', err);
}
export default http