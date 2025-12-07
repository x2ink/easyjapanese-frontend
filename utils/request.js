var baseUrl;
const accountInfo = wx.getAccountInfoSync();
const nowEnv = accountInfo.miniProgram.envVersion;
if (nowEnv === 'develop') {
	console.log('开发环境');
	baseUrl = "http://192.168.1.3:8080/"
} else {
	console.log('生产环境');
	baseUrl = "https://jp.x2.ink/api/"
}

import {
	userStore
} from "@/stores/index.js"


let isRefreshing = false;

let requests = [];

const http = {
	baseUrl: baseUrl,
	request(config) {
		config = beforeRequest(config)
		
		
		if (!config.url.startsWith("http")) {
			config.url = this.baseUrl + config.url
		}
		return new Promise((resolve, reject) => {
			uni.request(config).then(res => {
				
				beforeResponse(config, res).then(response => {
					resolve(response)
				}).catch(err => {
					reject(err)
				})
			}).catch(err => {
				errorHandle(err)
				reject(err)
			})
		})
	},
	get(url, params) {
		return this.request({
			url: url,
			data: params,
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
	
	delete(url, data) {
		return this.request({
			url: url,
			data: data,
			method: 'DELETE'
		})
	}
}


const beforeRequest = (config) => {
	const store = userStore();
	let token = store.token;
	config.header = {
		...config.header, 
		"Authorization": token
	}
	return config
}


const beforeResponse = async (config, response) => {
	const {
		statusCode,
		data
	} = response;

	
	if (statusCode == 401 && data.code === 4001) {
		const store = userStore();

		
		
		if (config.url.includes('/token?userId=')) {
			store.clearTokenInfo();
			
			return Promise.reject(data);
		}

		
		if (!isRefreshing) {
			isRefreshing = true;
			try {
				const userId = store.userInfo.id;
				
				
				const tokenRes = await http.get(`token?userId=${userId}`);

				
				
				const newToken = tokenRes.data;

				console.log('Token 刷新成功:', newToken);
				store.setToken(newToken); 

				
				requests.forEach(cb => cb(newToken));
				requests = []; 

				
				
				config.header["Authorization"] = newToken;
				
				config.url = config.url.replace(http.baseUrl, '');
				return http.request(config);

			} catch (err) {
				console.log('Token 刷新失败', err);
				store.clearTokenInfo();
				
				requests.forEach(cb => cb(null));
				requests = [];
				
				return Promise.reject(data);
			} finally {
				isRefreshing = false;
			}
		} else {
			
			return new Promise((resolve) => {
				requests.push((newToken) => {
					if (newToken) {
						
						config.header["Authorization"] = newToken;
						config.url = config.url.replace(http.baseUrl, '');
						resolve(http.request(config));
					} else {
						
						
					}
				});
			});
		}
	}

	
	if (statusCode >= 400) {
		return Promise.reject(data);
	} else {
		return Promise.resolve(data);
	}
}


const errorHandle = (err) => {
	console.log('网络异常,', err);
}

export default http;