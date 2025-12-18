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
export const copy = (data) => {
	uni.setClipboardData({
		data: data,
		showToast: false
	});
}
export const back = () => {
	uni.navigateBack({
		delta: 1
	})
}
export const formatWordName = (words, kana) => {
	if (words.length == 0) {
		return kana;
	} else {
		if (words.length === 1 && words[0] == kana) {
			return kana;
		} else {
			let word = words.map(item => `【${item}】`)
			return `${kana}${word.join('')}`
		}
	}
}
export const getOs = () => {
	return uni.getSystemInfoSync().osName
}
export const extractBracketContents = (text) => {
	const regex = /【([^】]*)】|([a-zA-Z]+)/g;
	const matches = [...text.matchAll(regex)];
	const result = [];
	for (const match of matches) {
		if (match[1]) {
			result.push(match[1]);
		} else if (match[2]) {
			result.push(match[2]);
		}
	}

	return result;
}