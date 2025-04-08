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
export const tagColor = new Map([
	["N1", {
		color: "#0083ff",
		bgcolor: "#d0e8ff"
	}],
	["N2", {
		color: "#57D09B",
		bgcolor: "#D0F4E5"
	}],
	["N3", {
		color: "#f5222d",
		bgcolor: "#FAC8C8"
	}],
	["N4", {
		color: "#E78938",
		bgcolor: "#F5D6B9"
	}],
	["N5", {
		color: "#13c2c2",
		bgcolor: "#A6E6E6"
	}],
	["高考", {
		color: "#8A2BE2",
		bgcolor: "#E6D5F5"
	}],
	["考研", {
		color: "#FF69B4",
		bgcolor: "#FFE6F3"
	}],
	["新编", {
		color: "#FF4500",
		bgcolor: "#FFE4D6"
	}],
	["新标", {
		color: "#20B2AA",
		bgcolor: "#D1F2F0"
	}]
])
export const formatWordName = (word, kana) => {
	if (/^[\u30A1-\u30FA\u31F0-\u31FF\u30FC\u30C3]+$/.test(word)) {
		return word
	} else if (word == kana) {
		return word
	} else {
		return `${kana}【${word}】`
	}
}