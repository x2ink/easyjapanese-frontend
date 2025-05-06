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
export const kanaData = [{
		"rome": "a",
		"hiragana": "あ",
		"katakana": "ア",
		"hiragana_origin": "平假名「あ」源自汉字「安」的草书体。",
		"katakana_origin": "片假名「ア」取自汉字「阿」的偏旁。"
	},
	{
		"rome": "i",
		"hiragana": "い",
		"katakana": "イ",
		"hiragana_origin": "平假名「い」源自汉字「以」的草书体。",
		"katakana_origin": "片假名「イ」取自汉字「伊」的偏旁。"
	},
	{
		"rome": "u",
		"hiragana": "う",
		"katakana": "ウ",
		"hiragana_origin": "平假名「う」源自汉字「宇」的草书体。",
		"katakana_origin": "片假名「ウ」取自汉字「宇」的偏旁。"
	},
	{
		"rome": "e",
		"hiragana": "え",
		"katakana": "エ",
		"hiragana_origin": "平假名「え」源自汉字「衣」的草书体。",
		"katakana_origin": "片假名「エ」取自汉字「江」的偏旁。"
	},
	{
		"rome": "o",
		"hiragana": "お",
		"katakana": "オ",
		"hiragana_origin": "平假名「お」源自汉字「於」的草书体。",
		"katakana_origin": "片假名「オ」取自汉字「於」的偏旁。"
	},
	{
		"rome": "ka",
		"hiragana": "か",
		"katakana": "カ",
		"hiragana_origin": "平假名「か」源自汉字「加」的草书体。",
		"katakana_origin": "片假名「カ」取自汉字「加」的偏旁。"
	},
	{
		"rome": "ki",
		"hiragana": "き",
		"katakana": "キ",
		"hiragana_origin": "平假名「き」源自汉字「幾」的草书体。",
		"katakana_origin": "片假名「キ」取自汉字「幾」的偏旁。"
	},
	{
		"rome": "ku",
		"hiragana": "く",
		"katakana": "ク",
		"hiragana_origin": "平假名「く」源自汉字「久」的草书体。",
		"katakana_origin": "片假名「ク」取自汉字「久」的偏旁。"
	},
	{
		"rome": "ke",
		"hiragana": "け",
		"katakana": "ケ",
		"hiragana_origin": "平假名「け」源自汉字「計」的草书体。",
		"katakana_origin": "片假名「ケ」取自汉字「介」的偏旁。"
	},
	{
		"rome": "ko",
		"hiragana": "こ",
		"katakana": "コ",
		"hiragana_origin": "平假名「こ」源自汉字「己」的草书体。",
		"katakana_origin": "片假名「コ」取自汉字「己」的偏旁。"
	},
	{
		"rome": "sa",
		"hiragana": "さ",
		"katakana": "サ",
		"hiragana_origin": "平假名「さ」源自汉字「左」的草书体。",
		"katakana_origin": "片假名「サ」取自汉字「散」的部首。"
	},
	{
		"rome": "shi",
		"hiragana": "し",
		"katakana": "シ",
		"hiragana_origin": "平假名「し」源自汉字「之」的草书体。",
		"katakana_origin": "片假名「シ」取自汉字「之」的部首。"
	},
	{
		"rome": "su",
		"hiragana": "す",
		"katakana": "ス",
		"hiragana_origin": "平假名「す」源自汉字「寸」的草书体。",
		"katakana_origin": "片假名「ス」取自汉字「須」的部首。"
	},
	{
		"rome": "se",
		"hiragana": "せ",
		"katakana": "セ",
		"hiragana_origin": "平假名「せ」源自汉字「世」的草书体。",
		"katakana_origin": "片假名「セ」取自汉字「世」的部首。"
	},
	{
		"rome": "so",
		"hiragana": "そ",
		"katakana": "ソ",
		"hiragana_origin": "平假名「そ」源自汉字「曾」的草书体。",
		"katakana_origin": "片假名「ソ」取自汉字「曾」的部首。"
	},
	{
		"rome": "ta",
		"hiragana": "た",
		"katakana": "タ",
		"hiragana_origin": "平假名「た」源自汉字「太」的草书体。",
		"katakana_origin": "片假名「タ」取自汉字「多」的偏旁。"
	},
	{
		"rome": "chi",
		"hiragana": "ち",
		"katakana": "チ",
		"hiragana_origin": "平假名「ち」源自汉字「知」的草书体。",
		"katakana_origin": "片假名「チ」取自汉字「千」的偏旁。"
	},
	{
		"rome": "tsu",
		"hiragana": "つ",
		"katakana": "ツ",
		"hiragana_origin": "平假名「つ」源自汉字「川」的草书体。",
		"katakana_origin": "片假名「ツ」取自汉字「川」的偏旁。"
	},
	{
		"rome": "te",
		"hiragana": "て",
		"katakana": "テ",
		"hiragana_origin": "平假名「て」源自汉字「天」的草书体。",
		"katakana_origin": "片假名「テ」取自汉字「天」的偏旁。"
	},
	{
		"rome": "to",
		"hiragana": "と",
		"katakana": "ト",
		"hiragana_origin": "平假名「と」源自汉字「止」的草书体。",
		"katakana_origin": "片假名「ト」取自汉字「止」的偏旁。"
	},
	{
		"rome": "na",
		"hiragana": "な",
		"katakana": "ナ",
		"hiragana_origin": "平假名「な」源自汉字「奈」的草书体。",
		"katakana_origin": "片假名「ナ」取自汉字「奈」的偏旁。"
	},
	{
		"rome": "ni",
		"hiragana": "に",
		"katakana": "ニ",
		"hiragana_origin": "平假名「に」源自汉字「仁」的草书体。",
		"katakana_origin": "片假名「ニ」取自汉字「二」。"
	},
	{
		"rome": "nu",
		"hiragana": "ぬ",
		"katakana": "ヌ",
		"hiragana_origin": "平假名「ぬ」源自汉字「奴」的草书体。",
		"katakana_origin": "片假名「ヌ」取自汉字「奴」的偏旁。"
	},
	{
		"rome": "ne",
		"hiragana": "ね",
		"katakana": "ネ",
		"hiragana_origin": "平假名「ね」源自汉字「祢」的草书体。",
		"katakana_origin": "片假名「ネ」取自汉字「祢」的偏旁。"
	},
	{
		"rome": "no",
		"hiragana": "の",
		"katakana": "ノ",
		"hiragana_origin": "平假名「の」源自汉字「乃」的草书体。",
		"katakana_origin": "片假名「ノ」取自汉字「乃」的偏旁。"
	},
	{
		"rome": "ha",
		"hiragana": "は",
		"katakana": "ハ",
		"hiragana_origin": "平假名「は」源自汉字「波」的草书体。",
		"katakana_origin": "片假名「ハ」取自汉字「八」的偏旁。"
	},
	{
		"rome": "hi",
		"hiragana": "ひ",
		"katakana": "ヒ",
		"hiragana_origin": "平假名「ひ」源自汉字「比」的草书体。",
		"katakana_origin": "片假名「ヒ」取自汉字「比」的偏旁。"
	},
	{
		"rome": "fu",
		"hiragana": "ふ",
		"katakana": "フ",
		"hiragana_origin": "平假名「ふ」源自汉字「不」的草书体。",
		"katakana_origin": "片假名「フ」取自汉字「不」的偏旁。"
	},
	{
		"rome": "he",
		"hiragana": "へ",
		"katakana": "ヘ",
		"hiragana_origin": "平假名「へ」源自汉字「部」的草书体。",
		"katakana_origin": "片假名「ヘ」取自汉字「部」的偏旁。"
	},
	{
		"rome": "ho",
		"hiragana": "ほ",
		"katakana": "ホ",
		"hiragana_origin": "平假名「ほ」源自汉字「保」的草书体。",
		"katakana_origin": "片假名「ホ」取自汉字「保」的偏旁。"
	},
	{
		"rome": "ma",
		"hiragana": "ま",
		"katakana": "マ",
		"hiragana_origin": "平假名「ま」源自汉字「末」的草书体。",
		"katakana_origin": "片假名「マ」取自汉字「万」的偏旁。"
	},
	{
		"rome": "mi",
		"hiragana": "み",
		"katakana": "ミ",
		"hiragana_origin": "平假名「み」源自汉字「美」的草书体。",
		"katakana_origin": "片假名「ミ」取自汉字「三」的偏旁。"
	},
	{
		"rome": "mu",
		"hiragana": "む",
		"katakana": "ム",
		"hiragana_origin": "平假名「む」源自汉字「武」的草书体。",
		"katakana_origin": "片假名「ム」取自汉字「牟」的偏旁。"
	},
	{
		"rome": "me",
		"hiragana": "め",
		"katakana": "メ",
		"hiragana_origin": "平假名「め」源自汉字「女」的草书体。",
		"katakana_origin": "片假名「メ」取自汉字「女」的偏旁。"
	},
	{
		"rome": "mo",
		"hiragana": "も",
		"katakana": "モ",
		"hiragana_origin": "平假名「も」源自汉字「毛」的草书体。",
		"katakana_origin": "片假名「モ」取自汉字「毛」的偏旁。"
	},
	{
		"rome": "ya",
		"hiragana": "や",
		"katakana": "ヤ",
		"hiragana_origin": "平假名「や」源自汉字「也」的草书体。",
		"katakana_origin": "片假名「ヤ」取自汉字「也」的偏旁。"
	},
	{
		"rome": "yu",
		"hiragana": "ゆ",
		"katakana": "ユ",
		"hiragana_origin": "平假名「ゆ」源自汉字「由」的草书体。",
		"katakana_origin": "片假名「ユ」取自汉字「由」的偏旁。"
	},
	{
		"rome": "yo",
		"hiragana": "よ",
		"katakana": "ヨ",
		"hiragana_origin": "平假名「よ」源自汉字「与」的草书体。",
		"katakana_origin": "片假名「ヨ」取自汉字「与」的偏旁。"
	},
	{
		"rome": "ra",
		"hiragana": "ら",
		"katakana": "ラ",
		"hiragana_origin": "平假名「ら」源自汉字「良」的草书体。",
		"katakana_origin": "片假名「ラ」取自汉字「良」的偏旁。"
	},
	{
		"rome": "ri",
		"hiragana": "り",
		"katakana": "リ",
		"hiragana_origin": "平假名「り」源自汉字「利」的草书体。",
		"katakana_origin": "片假名「リ」取自汉字「利」的偏旁。"
	},
	{
		"rome": "ru",
		"hiragana": "る",
		"katakana": "ル",
		"hiragana_origin": "平假名「る」源自汉字「留」的草书体。",
		"katakana_origin": "片假名「ル」取自汉字「留」的偏旁。"
	},
	{
		"rome": "re",
		"hiragana": "れ",
		"katakana": "レ",
		"hiragana_origin": "平假名「れ」源自汉字「礼」的草书体。",
		"katakana_origin": "片假名「レ」取自汉字「礼」的偏旁。"
	},
	{
		"rome": "ro",
		"hiragana": "ろ",
		"katakana": "ロ",
		"hiragana_origin": "平假名「ろ」源自汉字「呂」的草书体。",
		"katakana_origin": "片假名「ロ」取自汉字「呂」的偏旁。"
	},
	{
		"rome": "wa",
		"hiragana": "わ",
		"katakana": "ワ",
		"hiragana_origin": "平假名「わ」源自汉字「和」的草书体。",
		"katakana_origin": "片假名「ワ」取自汉字「和」的偏旁。"
	},
	{
		"rome": "wo",
		"hiragana": "を",
		"katakana": "ヲ",
		"hiragana_origin": "平假名「を」源自汉字「遠」的草书体。",
		"katakana_origin": "片假名「ヲ」取自汉字「遠」的偏旁。"
	}, {
		"rome": "n",
		"hiragana": "ん",
		"katakana": "​ン",
		"hiragana_origin": "平假名「ん」源自汉字“无”的草书形式，形状类似汉字“人”。",
		"katakana_origin": "片假名「ン」源自汉字“尓”上部的部件，形状类似汉字“二”。"
	},
	{
		"rome": "ga",
		"hiragana": "が",
		"katakana": "ガ",
		"hiragana_origin": "平假名「が」源自汉字「我」的草书体。",
		"katakana_origin": "片假名「ガ」取自汉字「我」的偏旁。"
	},
	{
		"rome": "gi",
		"hiragana": "ぎ",
		"katakana": "ギ",
		"hiragana_origin": "平假名「ぎ」源自汉字「技」的草书体。",
		"katakana_origin": "片假名「ギ」取自汉字「技」的偏旁。"
	},
	{
		"rome": "gu",
		"hiragana": "ぐ",
		"katakana": "グ",
		"hiragana_origin": "平假名「ぐ」源自汉字「具」的草书体。",
		"katakana_origin": "片假名「グ」取自汉字「具」的偏旁。"
	},
	{
		"rome": "ge",
		"hiragana": "げ",
		"katakana": "ゲ",
		"hiragana_origin": "平假名「げ」源自汉字「下」的草书体。",
		"katakana_origin": "片假名「ゲ」取自汉字「下」的偏旁。"
	},
	{
		"rome": "go",
		"hiragana": "ご",
		"katakana": "ゴ",
		"hiragana_origin": "平假名「ご」源自汉字「後」的草书体。",
		"katakana_origin": "片假名「ゴ」取自汉字「後」的偏旁。"
	},
	{
		"rome": "za",
		"hiragana": "ざ",
		"katakana": "ザ",
		"hiragana_origin": "平假名「ざ」源自汉字「座」的草书体。",
		"katakana_origin": "片假名「ザ」取自汉字「座」的偏旁。"
	},
	{
		"rome": "ji",
		"hiragana": "じ",
		"katakana": "ジ",
		"hiragana_origin": "平假名「じ」源自汉字「慈」的草书体。",
		"katakana_origin": "片假名「ジ」取自汉字「慈」的偏旁。"
	},
	{
		"rome": "zu",
		"hiragana": "ず",
		"katakana": "ズ",
		"hiragana_origin": "平假名「ず」源自汉字「図」的草书体。",
		"katakana_origin": "片假名「ズ」取自汉字「図」的偏旁。"
	},
	{
		"rome": "ze",
		"hiragana": "ぜ",
		"katakana": "ゼ",
		"hiragana_origin": "平假名「ぜ」源自汉字「是」的草书体。",
		"katakana_origin": "片假名「ゼ」取自汉字「是」的偏旁。"
	},
	{
		"rome": "zo",
		"hiragana": "ぞ",
		"katakana": "ゾ",
		"hiragana_origin": "平假名「ぞ」源自汉字「曽」的草书体。",
		"katakana_origin": "片假名「ゾ」取自汉字「曽」的偏旁。"
	},
	{
		"rome": "da",
		"hiragana": "だ",
		"katakana": "ダ",
		"hiragana_origin": "平假名「だ」源自汉字「太」的草书体。",
		"katakana_origin": "片假名「ダ」取自汉字「太」的偏旁。"
	},
	{
		"rome": "di",
		"hiragana": "ぢ",
		"katakana": "ヂ",
		"hiragana_origin": "平假名「ぢ」源自汉字「知」的草书体。",
		"katakana_origin": "片假名「ヂ」取自汉字「知」的偏旁。"
	},
	{
		"rome": "du",
		"hiragana": "づ",
		"katakana": "ヅ",
		"hiragana_origin": "平假名「づ」源自汉字「豆」的草书体。",
		"katakana_origin": "片假名「ヅ」取自汉字「豆」的偏旁。"
	},
	{
		"rome": "de",
		"hiragana": "で",
		"katakana": "デ",
		"hiragana_origin": "平假名「で」源自汉字「出」的草书体。",
		"katakana_origin": "片假名「デ」取自汉字「出」的偏旁。"
	},
	{
		"rome": "do",
		"hiragana": "ど",
		"katakana": "ド",
		"hiragana_origin": "平假名「ど」源自汉字「土」的草书体。",
		"katakana_origin": "片假名「ド」取自汉字「土」的偏旁。"
	},
	{
		"rome": "ba",
		"hiragana": "ば",
		"katakana": "バ",
		"hiragana_origin": "平假名「ば」源自汉字「馬」的草书体。",
		"katakana_origin": "片假名「バ」取自汉字「馬」的偏旁。"
	},
	{
		"rome": "bi",
		"hiragana": "び",
		"katakana": "ビ",
		"hiragana_origin": "平假名「び」源自汉字「美」的草书体。",
		"katakana_origin": "片假名「ビ」取自汉字「美」的偏旁。"
	},
	{
		"rome": "bu",
		"hiragana": "ぶ",
		"katakana": "ブ",
		"hiragana_origin": "平假名「ぶ」源自汉字「武」的草书体。",
		"katakana_origin": "片假名「ブ」取自汉字「武」的偏旁。"
	},
	{
		"rome": "be",
		"hiragana": "べ",
		"katakana": "ベ",
		"hiragana_origin": "平假名「べ」源自汉字「部」的草书体。",
		"katakana_origin": "片假名「ベ」取自汉字「部」的偏旁。"
	},
	{
		"rome": "bo",
		"hiragana": "ぼ",
		"katakana": "ボ",
		"hiragana_origin": "平假名「ぼ」源自汉字「母」的草书体。",
		"katakana_origin": "片假名「ボ」取自汉字「母」的偏旁。"
	},
	{
		"rome": "pa",
		"hiragana": "ぱ",
		"katakana": "パ",
		"hiragana_origin": "平假名「ぱ」源自汉字「波」的草书体。",
		"katakana_origin": "片假名「パ」取自汉字「波」的偏旁。"
	},
	{
		"rome": "pi",
		"hiragana": "ぴ",
		"katakana": "ピ",
		"hiragana_origin": "平假名「ぴ」源自汉字「比」的草书体。",
		"katakana_origin": "片假名「ピ」取自汉字「比」的偏旁。"
	},
	{
		"rome": "pu",
		"hiragana": "ぷ",
		"katakana": "プ",
		"hiragana_origin": "平假名「ぷ」源自汉字「不」的草书体。",
		"katakana_origin": "片假名「プ」取自汉字「不」的偏旁。"
	},
	{
		"rome": "pe",
		"hiragana": "ぺ",
		"katakana": "ペ",
		"hiragana_origin": "平假名「ぺ」源自汉字「部」的草书体。",
		"katakana_origin": "片假名「ペ」取自汉字「部」的偏旁。"
	},
	{
		"rome": "po",
		"hiragana": "ぽ",
		"katakana": "ポ",
		"hiragana_origin": "平假名「ぽ」源自汉字「保」的草书体。",
		"katakana_origin": "片假名「ポ」取自汉字「保」的偏旁。"
	},
	{
		"rome": "kya",
		"hiragana": "きゃ",
		"katakana": "キャ",
		"hiragana_origin": "平假名「きゃ」由「き」和小型「や」组成，表示复合音。",
		"katakana_origin": "片假名「キャ」由「キ」和小型「ヤ」组合而成，表示复合音。"
	},
	{
		"rome": "kyu",
		"hiragana": "きゅ",
		"katakana": "キュ",
		"hiragana_origin": "平假名「きゅ」由「き」和小型「ゆ」组成，表示复合音。",
		"katakana_origin": "片假名「キュ」由「キ」和小型「ユ」组合而成，表示复合音。"
	},
	{
		"rome": "kyo",
		"hiragana": "きょ",
		"katakana": "キョ",
		"hiragana_origin": "平假名「きょ」由「き」和小型「よ」组成，表示复合音。",
		"katakana_origin": "片假名「キョ」由「キ」和小型「ヨ」组合而成，表示复合音。"
	},
	{
		"rome": "sha",
		"hiragana": "しゃ",
		"katakana": "シャ",
		"hiragana_origin": "平假名「しゃ」由「し」和小型「や」组成，表示复合音。",
		"katakana_origin": "片假名「シャ」由「シ」和小型「ヤ」组合而成，表示复合音。"
	},
	{
		"rome": "shu",
		"hiragana": "しゅ",
		"katakana": "シュ",
		"hiragana_origin": "平假名「しゅ」由「し」和小型「ゆ」组成，表示复合音。",
		"katakana_origin": "片假名「シュ」由「シ」和小型「ユ」组合而成，表示复合音。"
	},
	{
		"rome": "sho",
		"hiragana": "しょ",
		"katakana": "ショ",
		"hiragana_origin": "平假名「しょ」由「し」和小型「よ」组成，表示复合音。",
		"katakana_origin": "片假名「ショ」由「シ」和小型「ヨ」组合而成，表示复合音。"
	},
	{
		"rome": "cha",
		"hiragana": "ちゃ",
		"katakana": "チャ",
		"hiragana_origin": "平假名「ちゃ」由「ち」和小型「や」组成，表示复合音。",
		"katakana_origin": "片假名「チャ」由「チ」和小型「ヤ」组合而成，表示复合音。"
	},
	{
		"rome": "chu",
		"hiragana": "ちゅ",
		"katakana": "チュ",
		"hiragana_origin": "平假名「ちゅ」由「ち」和小型「ゆ」组成，表示复合音。",
		"katakana_origin": "片假名「チュ」由「チ」和小型「ユ」组合而成，表示复合音。"
	},
	{
		"rome": "cho",
		"hiragana": "ちょ",
		"katakana": "チョ",
		"hiragana_origin": "平假名「ちょ」由「ち」和小型「よ」组成，表示复合音。",
		"katakana_origin": "片假名「チョ」由「チ」和小型「ヨ」组合而成，表示复合音。"
	},
	{
		"rome": "nya",
		"hiragana": "にゃ",
		"katakana": "ニャ",
		"hiragana_origin": "平假名「にゃ」由「に」和小型「や」组成，表示复合音。",
		"katakana_origin": "片假名「ニャ」由「ニ」和小型「ヤ」组合而成，表示复合音。"
	},
	{
		"rome": "nyu",
		"hiragana": "にゅ",
		"katakana": "ニュ",
		"hiragana_origin": "平假名「にゅ」由「に」和小型「ゆ」组成，表示复合音。",
		"katakana_origin": "片假名「ニュ」由「ニ」和小型「ユ」组合而成，表示复合音。"
	},
	{
		"rome": "nyo",
		"hiragana": "にょ",
		"katakana": "ニョ",
		"hiragana_origin": "平假名「にょ」由「に」和小型「よ」组成，表示复合音。",
		"katakana_origin": "片假名「ニョ」由「ニ」和小型「ヨ」组合而成，表示复合音。"
	},
	{
		"rome": "hya",
		"hiragana": "ひゃ",
		"katakana": "ヒャ",
		"hiragana_origin": "平假名「ひゃ」由「ひ」和小型「や」组成，表示复合音。",
		"katakana_origin": "片假名「ヒャ」由「ヒ」和小型「ヤ」组合而成，表示复合音。"
	},
	{
		"rome": "hyu",
		"hiragana": "ひゅ",
		"katakana": "ヒュ",
		"hiragana_origin": "平假名「ひゅ」由「ひ」和小型「ゆ」组成，表示复合音。",
		"katakana_origin": "片假名「ヒュ」由「ヒ」和小型「ユ」组合而成，表示复合音。"
	},
	{
		"rome": "hyo",
		"hiragana": "ひょ",
		"katakana": "ヒョ",
		"hiragana_origin": "平假名「ひょ」由「ひ」和小型「よ」组成，表示复合音。",
		"katakana_origin": "片假名「ヒョ」由「ヒ」和小型「ヨ」组合而成，表示复合音。"
	},
	{
		"rome": "mya",
		"hiragana": "みゃ",
		"katakana": "ミャ",
		"hiragana_origin": "平假名「みゃ」由「み」和小型「や」组成，表示复合音。",
		"katakana_origin": "片假名「ミャ」由「ミ」和小型「ヤ」组合而成，表示复合音。"
	},
	{
		"rome": "myu",
		"hiragana": "みゅ",
		"katakana": "ミュ",
		"hiragana_origin": "平假名「みゅ」由「み」和小型「ゆ」组成，表示复合音。",
		"katakana_origin": "片假名「ミュ」由「ミ」和小型「ユ」组合而成，表示复合音。"
	},
	{
		"rome": "myo",
		"hiragana": "みょ",
		"katakana": "ミョ",
		"hiragana_origin": "平假名「みょ」由「み」和小型「よ」组成，表示复合音。",
		"katakana_origin": "片假名「ミョ」由「ミ」和小型「ヨ」组合而成，表示复合音。"
	},
	{
		"rome": "rya",
		"hiragana": "りゃ",
		"katakana": "リャ",
		"hiragana_origin": "平假名「りゃ」由「り」和小型「や」组成，表示复合音。",
		"katakana_origin": "片假名「リャ」由「リ」和小型「ヤ」组合而成，表示复合音。"
	},
	{
		"rome": "ryu",
		"hiragana": "りゅ",
		"katakana": "リュ",
		"hiragana_origin": "平假名「りゅ」由「り」和小型「ゆ」组成，表示复合音。",
		"katakana_origin": "片假名「リュ」由「リ」和小型「ユ」组合而成，表示复合音。"
	},
	{
		"rome": "ryo",
		"hiragana": "りょ",
		"katakana": "リョ",
		"hiragana_origin": "平假名「りょ」由「り」和小型「よ」组成，表示复合音。",
		"katakana_origin": "片假名「リョ」由「リ」和小型「ヨ」组合而成，表示复合音。"
	},
	{
		"rome": "gya",
		"hiragana": "ぎゃ",
		"katakana": "ギャ",
		"hiragana_origin": "平假名「ぎゃ」由「ぎ」和小型「や」组成，表示复合音。",
		"katakana_origin": "片假名「ギャ」由「ギ」和小型「ヤ」组合而成，表示复合音。"
	},
	{
		"rome": "gyu",
		"hiragana": "ぎゅ",
		"katakana": "ギュ",
		"hiragana_origin": "平假名「ぎゅ」由「ぎ」和小型「ゆ」组成，表示复合音。",
		"katakana_origin": "片假名「ギュ」由「ギ」和小型「ユ」组合而成，表示复合音。"
	},
	{
		"rome": "gyo",
		"hiragana": "ぎょ",
		"katakana": "ギョ",
		"hiragana_origin": "平假名「ぎょ」由「ぎ」和小型「よ」组成，表示复合音。",
		"katakana_origin": "片假名「ギョ」由「ギ」和小型「ヨ」组合而成，表示复合音。"
	},
	{
		"rome": "ja",
		"hiragana": "じゃ",
		"katakana": "ジャ",
		"hiragana_origin": "平假名「じゃ」由「じ」和小型「や」组成，表示复合音。",
		"katakana_origin": "片假名「ジャ」由「ジ」和小型「ヤ」组合而成，表示复合音。"
	},
	{
		"rome": "ju",
		"hiragana": "じゅ",
		"katakana": "ジュ",
		"hiragana_origin": "平假名「じゅ」由「じ」和小型「ゆ」组成，表示复合音。",
		"katakana_origin": "片假名「ジュ」由「ジ」和小型「ユ」组合而成，表示复合音。"
	},
	{
		"rome": "jo",
		"hiragana": "じょ",
		"katakana": "ジョ",
		"hiragana_origin": "平假名「じょ」由「じ」和小型「よ」组成，表示复合音。",
		"katakana_origin": "片假名「ジョ」由「ジ」和小型「ヨ」组合而成，表示复合音。"
	},
	{
		"rome": "bya",
		"hiragana": "びゃ",
		"katakana": "ビャ",
		"hiragana_origin": "平假名「びゃ」由「び」和小型「や」组成，表示复合音。",
		"katakana_origin": "片假名「ビャ」由「ビ」和小型「ヤ」组合而成，表示复合音。"
	},
	{
		"rome": "byu",
		"hiragana": "びゅ",
		"katakana": "ビュ",
		"hiragana_origin": "平假名「びゅ」由「び」和小型「ゆ」组成，表示复合音。",
		"katakana_origin": "片假名「ビュ」由「ビ」和小型「ユ」组合而成，表示复合音。"
	},
	{
		"rome": "byo",
		"hiragana": "びょ",
		"katakana": "ビョ",
		"hiragana_origin": "平假名「びょ」由「び」和小型「よ」组成，表示复合音。",
		"katakana_origin": "片假名「ビョ」由「ビ」和小型「ヨ」组合而成，表示复合音。"
	},
	{
		"rome": "pya",
		"hiragana": "ぴゃ",
		"katakana": "ピャ",
		"hiragana_origin": "平假名「ぴゃ」由「ぴ」和小型「や」组成，表示复合音。",
		"katakana_origin": "片假名「ピャ」由「ピ」和小型「ヤ」组合而成，表示复合音。"
	},
	{
		"rome": "pyu",
		"hiragana": "ぴゅ",
		"katakana": "ピュ",
		"hiragana_origin": "平假名「ぴゅ」由「ぴ」和小型「ゆ」组成，表示复合音。",
		"katakana_origin": "片假名「ピュ」由「ピ」和小型「ユ」组合而成，表示复合音。"
	},
	{
		"rome": "pyo",
		"hiragana": "ぴょ",
		"katakana": "ピョ",
		"hiragana_origin": "平假名「ぴょ」由「ぴ」和小型「よ」组成，表示复合音。",
		"katakana_origin": "片假名「ピョ」由「ピ」和小型「ヨ」组合而成，表示复合音。"
	}
]