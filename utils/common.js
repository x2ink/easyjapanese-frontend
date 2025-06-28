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
export const formatWordName = (word, kana) => {
	if (/^[\u30A1-\u30FA\u31F0-\u31FF\u30FC\u30C3]+$/.test(word)) {
		return word
	} else if (word == kana) {
		return word
	} else {
		return `${kana}【${word}】`
	}
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