export const isEmail = (email) => {
	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return emailRegex.test(email);
}
export const goPage = (to, params) => {
	let url = to;
	if (params != undefined) {
		Object.keys(params).forEach(function(key) {
			if (url.indexOf('?') != -1) {
				url += "&" + key + "=" + params[key];
			} else {
				url += "?" + key + "=" + params[key];
			}
		});
	}
	uni.navigateTo({
		url: url
	})
}