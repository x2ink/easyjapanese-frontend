// x2ink/easyjapanese-frontend/easyjapanese-frontend-21edab511d56d0d82cd26e61d828adfeda93be14/utils/request.js

var baseUrl;
const accountInfo = wx.getAccountInfoSync();
const nowEnv = accountInfo.miniProgram.envVersion;
if (nowEnv === 'develop') {
	console.log('开发环境');
	baseUrl = "http://192.168.1.4:8080/"
} else {
	console.log('生产环境');
	baseUrl = "https://jp.x2.ink/api/"
}

import {
	userStore
} from "@/stores/index.js"

// 是否正在刷新中
let isRefreshing = false;
// 请求队列，用来存储因等待 Token 刷新而挂起的请求
let requests = [];

const http = {
	baseUrl: baseUrl,
	request(config) {
		config = beforeRequest(config)
		// 拼接完整 URL
		// 注意：如果重试时 config.url 已经包含了 baseUrl，需要避免重复拼接
		if (!config.url.startsWith("http")) {
			config.url = this.baseUrl + config.url
		}
		return new Promise((resolve, reject) => {
			uni.request(config).then(res => {
				// 响应拦截处理
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
	// 新增 delete 等其他方法按需添加
	delete(url, data) {
		return this.request({
			url: url,
			data: data,
			method: 'DELETE'
		})
	}
}

// 请求拦截器
const beforeRequest = (config) => {
	const store = userStore();
	let token = store.token;
	config.header = {
		...config.header, // 保留可能存在的其他 header
		"Authorization": token
	}
	return config
}

// 响应拦截器
const beforeResponse = async (config, response) => {
	const {
		statusCode,
		data
	} = response;

	// 处理 Token 过期的情况 (401 且 code 为 4001)
	if (statusCode == 401 && data.code === 4001) {
		const store = userStore();

		// 1. 死循环防护：如果当前报错的接口就是重置 Token 的接口，说明重置也失败了，直接登出
		// 判断 config.url 是否包含 token 接口的路径
		if (config.url.includes('/token?userId=')) {
			store.clearTokenInfo();
			// uni.navigateTo({ url: "/pages/login/login" }); // 按需开启跳转
			return Promise.reject(data);
		}

		// 2. 如果没有在刷新，则发起刷新请求
		if (!isRefreshing) {
			isRefreshing = true;
			try {
				const userId = store.userInfo.id;
				// 直接使用 http 对象调用，避免循环引用
				// 这里不需要改 header，因为 beforeRequest 会自动带上 store 里当前的（过期的）token
				const tokenRes = await http.get(`token?userId=${userId}`);

				// 假设后端返回结构是 { code: 200, data: "new_token_string", ... }
				// 根据你的代码 tokenRes.data 似乎是 token 字符串，请根据实际接口调整
				const newToken = tokenRes.data;

				console.log('Token 刷新成功:', newToken);
				store.setToken(newToken); // 更新 Pinia 中的 Token

				// 3. 执行队列中的请求
				requests.forEach(cb => cb(newToken));
				requests = []; // 清空队列

				// 4. 重试当前请求
				// 更新 header 为新 token
				config.header["Authorization"] = newToken;
				// 去掉 baseUrl 前缀，以便 http.request 重新拼接 (防止双重 baseUrl)
				config.url = config.url.replace(http.baseUrl, '');
				return http.request(config);

			} catch (err) {
				console.log('Token 刷新失败', err);
				store.clearTokenInfo();
				// 失败时，把队列里的请求也都 reject 掉（可选，或者重定向到登录页）
				requests.forEach(cb => cb(null));
				requests = [];
				// uni.navigateTo({ url: "/pages/login/login" });
				return Promise.reject(data);
			} finally {
				isRefreshing = false;
			}
		} else {
			// 5. 如果正在刷新，将当前请求存入队列
			return new Promise((resolve) => {
				requests.push((newToken) => {
					if (newToken) {
						// 刷新成功，使用新 Token 重试
						config.header["Authorization"] = newToken;
						config.url = config.url.replace(http.baseUrl, '');
						resolve(http.request(config));
					} else {
						// 刷新失败
						// resolve(Promise.reject(data));
					}
				});
			});
		}
	}

	// 其他错误处理
	if (statusCode >= 400) {
		return Promise.reject(data);
	} else {
		return Promise.resolve(data);
	}
}

// 异常处理
const errorHandle = (err) => {
	console.log('网络异常,', err);
}

export default http;