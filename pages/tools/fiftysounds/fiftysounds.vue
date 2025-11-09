<template>
	<page-meta :page-style="`overflow:${showDetail? 'hidden' : 'visible'};`">
		<view style="height: 100vh;display: flex;flex-direction: column;">
			<view>
				<NavbarDefault border title="五十音图"></NavbarDefault>
				<view class="bg-white">
					<view @click="current='平假名'" :class="{active:current=='平假名'}" class="kana-tab _GCENTER">
						平假名
					</view>
					<view @click="current='片假名'" :class="{active:current=='片假名'}" class="kana-tab  _GCENTER">
						片假名
					</view>
				</view>
			</view>
			<view style="flex: 1;overflow: scroll;">
				<div class="table">
					<div class="space-y-2">
						<div class="kana-row-header">清音</div>
						<div class="grid">
							<div @click="openDetail(item)" class="kana-card" v-for="item in unvoicedsound" :key="item">
								<div class="kana-character">{{get(item)}}</div>
								<div class="kana-romaji">{{item}}</div>
							</div>
						</div>
					</div>
					<div class="space-y-2">
						<div class="kana-row-header">浊音</div>
						<div class="grid">
							<div @click="openDetail(item)" class="kana-card" v-for="item in dakutenHiragana"
								:key="item">
								<div class="kana-character">{{get(item)}}</div>
								<div class="kana-romaji">{{item}}</div>
							</div>
						</div>
					</div>
					<div class="space-y-2">
						<div class="kana-row-header">拗音</div>
						<div class="grid">
							<div @click="openDetail(item)" class="kana-card" v-for="item in youonHiragana" :key="item">
								<div class="kana-character">{{get(item)}}</div>
								<div class="kana-romaji">{{item}}</div>
							</div>
						</div>
					</div>
				</div>
			</view>
		</view>
	</page-meta>
	<wd-toast />
	<wd-popup lockScroll safe-area-inset-bottom v-model="showDetail" position="bottom" custom-class="detail-popup">
		<view class="_GCENTER" style="flex-direction: column;padding: 16px;">
			<view class="detail-title">
				假名手写板
			</view>
			<view class="detail-img">
				<image v-if="boardShow" class="kana-write"
					:src="`https://jpx2ink.oss-cn-shanghai.aliyuncs.com/images/${current=='平假名'?'hiragana':'katakana'}/detail/${row}.png`"
					mode="aspectFill"></image>
				<view v-if="boardShow" class="drawingboard">
					<l-signature disableScroll ref="signatureRef" penColor="black" :penSize="15"
						:openSmooth="true"></l-signature>
				</view>
				<view v-else class="loadingtext">
					<wd-loading size="40px" />
					<text>手写板加载中</text>
				</view>
			</view>
			<view class="tools-btns">
				<view>
					<button @click="onClick('undo')" class="btn-info"> <text class="fas fa-reply"></text>
						撤销</button>
					<button @click="onClick('clear')" class="btn-info"> <text class="fas fa-trash"></text>
						清空</button>
				</view>
				<button @click="onClick('save')" class="btn-primary">保存图片</button>
			</view>
		</view>
	</wd-popup>
</template>

<script setup>
	import {
		ref,
	} from 'vue'
	import {
		onLoad,
	} from "@dcloudio/uni-app"
	import {
		goPage
	} from "@/utils/common.js"
	import NavbarDefault from "@/components/navbar/default"
	import $http from "@/api/index.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	const data = ref([])
	const current = ref('平假名')
	const kanaData = ref([{
			"rome": "a",
			"hiragana": "あ",
			"katakana": "ア"
		},
		{
			"rome": "i",
			"hiragana": "い",
			"katakana": "イ"
		},
		{
			"rome": "u",
			"hiragana": "う",
			"katakana": "ウ"
		},
		{
			"rome": "e",
			"hiragana": "え",
			"katakana": "エ"
		},
		{
			"rome": "o",
			"hiragana": "お",
			"katakana": "オ"
		},

		{
			"rome": "ka",
			"hiragana": "か",
			"katakana": "カ"
		},
		{
			"rome": "ki",
			"hiragana": "き",
			"katakana": "キ"
		},
		{
			"rome": "ku",
			"hiragana": "く",
			"katakana": "ク"
		},
		{
			"rome": "ke",
			"hiragana": "け",
			"katakana": "ケ"
		},
		{
			"rome": "ko",
			"hiragana": "こ",
			"katakana": "コ"
		},

		{
			"rome": "sa",
			"hiragana": "さ",
			"katakana": "サ"
		},
		{
			"rome": "shi",
			"hiragana": "し",
			"katakana": "シ"
		},
		{
			"rome": "su",
			"hiragana": "す",
			"katakana": "ス"
		},
		{
			"rome": "se",
			"hiragana": "せ",
			"katakana": "セ"
		},
		{
			"rome": "so",
			"hiragana": "そ",
			"katakana": "ソ"
		},

		{
			"rome": "ta",
			"hiragana": "た",
			"katakana": "タ"
		},
		{
			"rome": "chi",
			"hiragana": "ち",
			"katakana": "チ"
		},
		{
			"rome": "tsu",
			"hiragana": "つ",
			"katakana": "ツ"
		},
		{
			"rome": "te",
			"hiragana": "て",
			"katakana": "テ"
		},
		{
			"rome": "to",
			"hiragana": "と",
			"katakana": "ト"
		},

		{
			"rome": "na",
			"hiragana": "な",
			"katakana": "ナ"
		},
		{
			"rome": "ni",
			"hiragana": "に",
			"katakana": "ニ"
		},
		{
			"rome": "nu",
			"hiragana": "ぬ",
			"katakana": "ヌ"
		},
		{
			"rome": "ne",
			"hiragana": "ね",
			"katakana": "ネ"
		},
		{
			"rome": "no",
			"hiragana": "の",
			"katakana": "ノ"
		},

		{
			"rome": "ha",
			"hiragana": "は",
			"katakana": "ハ"
		},
		{
			"rome": "hi",
			"hiragana": "ひ",
			"katakana": "ヒ"
		},
		{
			"rome": "fu",
			"hiragana": "ふ",
			"katakana": "フ"
		},
		{
			"rome": "he",
			"hiragana": "へ",
			"katakana": "ヘ"
		},
		{
			"rome": "ho",
			"hiragana": "ほ",
			"katakana": "ホ"
		},

		{
			"rome": "ma",
			"hiragana": "ま",
			"katakana": "マ"
		},
		{
			"rome": "mi",
			"hiragana": "み",
			"katakana": "ミ"
		},
		{
			"rome": "mu",
			"hiragana": "む",
			"katakana": "ム"
		},
		{
			"rome": "me",
			"hiragana": "め",
			"katakana": "メ"
		},
		{
			"rome": "mo",
			"hiragana": "も",
			"katakana": "モ"
		},

		{
			"rome": "ya",
			"hiragana": "や",
			"katakana": "ヤ"
		},
		{
			"rome": "yu",
			"hiragana": "ゆ",
			"katakana": "ユ"
		},
		{
			"rome": "yo",
			"hiragana": "よ",
			"katakana": "ヨ"
		},

		{
			"rome": "ra",
			"hiragana": "ら",
			"katakana": "ラ"
		},
		{
			"rome": "ri",
			"hiragana": "り",
			"katakana": "リ"
		},
		{
			"rome": "ru",
			"hiragana": "る",
			"katakana": "ル"
		},
		{
			"rome": "re",
			"hiragana": "れ",
			"katakana": "レ"
		},
		{
			"rome": "ro",
			"hiragana": "ろ",
			"katakana": "ロ"
		},

		{
			"rome": "wa",
			"hiragana": "わ",
			"katakana": "ワ"
		},
		{
			"rome": "wo",
			"hiragana": "を",
			"katakana": "ヲ"
		},
		{
			"rome": "n",
			"hiragana": "ん",
			"katakana": "ン"
		},

		{
			"rome": "ga",
			"hiragana": "が",
			"katakana": "ガ"
		},
		{
			"rome": "gi",
			"hiragana": "ぎ",
			"katakana": "ギ"
		},
		{
			"rome": "gu",
			"hiragana": "ぐ",
			"katakana": "グ"
		},
		{
			"rome": "ge",
			"hiragana": "げ",
			"katakana": "ゲ"
		},
		{
			"rome": "go",
			"hiragana": "ご",
			"katakana": "ゴ"
		},

		{
			"rome": "za",
			"hiragana": "ざ",
			"katakana": "ザ"
		},
		{
			"rome": "ji",
			"hiragana": "じ",
			"katakana": "ジ"
		},
		{
			"rome": "zu",
			"hiragana": "ず",
			"katakana": "ズ"
		},
		{
			"rome": "ze",
			"hiragana": "ぜ",
			"katakana": "ゼ"
		},
		{
			"rome": "zo",
			"hiragana": "ぞ",
			"katakana": "ゾ"
		},

		{
			"rome": "da",
			"hiragana": "だ",
			"katakana": "ダ"
		},
		{
			"rome": "de",
			"hiragana": "で",
			"katakana": "デ"
		},
		{
			"rome": "do",
			"hiragana": "ど",
			"katakana": "ド"
		},

		{
			"rome": "ba",
			"hiragana": "ば",
			"katakana": "バ"
		},
		{
			"rome": "bi",
			"hiragana": "び",
			"katakana": "ビ"
		},
		{
			"rome": "bu",
			"hiragana": "ぶ",
			"katakana": "ブ"
		},
		{
			"rome": "be",
			"hiragana": "べ",
			"katakana": "ベ"
		},
		{
			"rome": "bo",
			"hiragana": "ぼ",
			"katakana": "ボ"
		},

		{
			"rome": "pa",
			"hiragana": "ぱ",
			"katakana": "パ"
		},
		{
			"rome": "pi",
			"hiragana": "ぴ",
			"katakana": "ピ"
		},
		{
			"rome": "pu",
			"hiragana": "ぷ",
			"katakana": "プ"
		},
		{
			"rome": "pe",
			"hiragana": "ぺ",
			"katakana": "ペ"
		},
		{
			"rome": "po",
			"hiragana": "ぽ",
			"katakana": "ポ"
		},

		{
			"rome": "kya",
			"hiragana": "きゃ",
			"katakana": "キャ"
		},
		{
			"rome": "kyu",
			"hiragana": "きゅ",
			"katakana": "キュ"
		},
		{
			"rome": "kyo",
			"hiragana": "きょ",
			"katakana": "キョ"
		},

		{
			"rome": "sha",
			"hiragana": "しゃ",
			"katakana": "シャ"
		},
		{
			"rome": "shu",
			"hiragana": "しゅ",
			"katakana": "シュ"
		},
		{
			"rome": "sho",
			"hiragana": "しょ",
			"katakana": "ショ"
		},

		{
			"rome": "cha",
			"hiragana": "ちゃ",
			"katakana": "チャ"
		},
		{
			"rome": "chu",
			"hiragana": "ちゅ",
			"katakana": "チュ"
		},
		{
			"rome": "cho",
			"hiragana": "ちょ",
			"katakana": "チョ"
		},

		{
			"rome": "nya",
			"hiragana": "にゃ",
			"katakana": "ニャ"
		},
		{
			"rome": "nyu",
			"hiragana": "にゅ",
			"katakana": "ニュ"
		},
		{
			"rome": "nyo",
			"hiragana": "にょ",
			"katakana": "ニョ"
		},

		{
			"rome": "hya",
			"hiragana": "ひゃ",
			"katakana": "ヒャ"
		},
		{
			"rome": "hyu",
			"hiragana": "ひゅ",
			"katakana": "ヒュ"
		},
		{
			"rome": "hyo",
			"hiragana": "ひょ",
			"katakana": "ヒョ"
		},

		{
			"rome": "mya",
			"hiragana": "みゃ",
			"katakana": "ミャ"
		},
		{
			"rome": "myu",
			"hiragana": "みゅ",
			"katakana": "ミュ"
		},
		{
			"rome": "myo",
			"hiragana": "みょ",
			"katakana": "ミョ"
		},

		{
			"rome": "rya",
			"hiragana": "りゃ",
			"katakana": "リャ"
		},
		{
			"rome": "ryu",
			"hiragana": "りゅ",
			"katakana": "リュ"
		},
		{
			"rome": "ryo",
			"hiragana": "りょ",
			"katakana": "リョ"
		},

		{
			"rome": "gya",
			"hiragana": "ぎゃ",
			"katakana": "ギャ"
		},
		{
			"rome": "gyu",
			"hiragana": "ぎゅ",
			"katakana": "ギュ"
		},
		{
			"rome": "gyo",
			"hiragana": "ぎょ",
			"katakana": "ギョ"
		},

		{
			"rome": "ja",
			"hiragana": "じゃ",
			"katakana": "ジャ"
		},
		{
			"rome": "ju",
			"hiragana": "じゅ",
			"katakana": "ジュ"
		},
		{
			"rome": "jo",
			"hiragana": "じょ",
			"katakana": "ジョ"
		},

		{
			"rome": "bya",
			"hiragana": "びゃ",
			"katakana": "ビャ"
		},
		{
			"rome": "byu",
			"hiragana": "びゅ",
			"katakana": "ビュ"
		},
		{
			"rome": "byo",
			"hiragana": "びょ",
			"katakana": "ビョ"
		},

		{
			"rome": "pya",
			"hiragana": "ぴゃ",
			"katakana": "ピャ"
		},
		{
			"rome": "pyu",
			"hiragana": "ぴゅ",
			"katakana": "ピュ"
		},
		{
			"rome": "pyo",
			"hiragana": "ぴょ",
			"katakana": "ピョ"
		}
	])
	const showDetail = ref(false)
	const row = ref('')
	const boardShow = ref(false)
	const signatureRef = ref(null)
	const onClick = (type) => {
		if (type === 'save') {
			signatureRef.value.canvasToTempFilePath({
				success: (res) => {
					saveImg(res)
				}
			});
			return;
		} else {
			signatureRef.value[type]();
		}
	};
	const saveImg = (res) => {
		if (res.isEmpty) {
			toast.warning(`画板为空`)
			return
		}
		uni.saveImageToPhotosAlbum({
			filePath: res.tempFilePath,
			success: (res) => {
				toast.success(`保存成功`)
			},
			fail: (err) => {
				wx.getSetting({
					success(res) {
						if (res.authSetting["scope.writePhotosAlbum"]) {
							toast.warning(`取消授权`)
						}
						if (res.authSetting["scope.writePhotosAlbum"] ==
							false) {
							uni.showModal({
								title: "提示",
								content: `图片保存失败，请前往设置页面允许保存相册`,
								confirmColor: "#8C5CDD",
								success: function(res) {
									if (res.confirm) {
										uni.openSetting({
											success(
												res) {}
										});
									} else if (res.cancel) {
										toast.warning(`取消授权`)
									}
								}
							});
						}
					}
				});
			}
		});
	}
	const openDetail = (item) => {
		if (item) {
			boardShow.value = false
			row.value = item
			playAudio(item)
			showDetail.value = true
			setTimeout(() => {
				boardShow.value = true
			}, 500)
		}
	}
	const get = (key) => {
		const res = kanaData.value.find(item => key == item.rome)
		if (res) {
			if (current.value == "平假名") {
				return res.hiragana
			} else {
				return res.katakana
			}
		} else {
			return ""
		}
	}
	const dakutenHiragana = ref(['ga', 'gi', 'gu', 'ge', 'go', 'za', 'ji', 'zu', 'ze', 'zo', 'da', 'ji', 'zu', 'de', 'do',
		'ba', 'bi', 'bu', 'be', 'bo', 'pa', 'pi', 'pu', 'pe', 'po'
	]);
	const unvoicedsound = ref(['a', 'i', 'u', 'e', 'o', 'ka', 'ki', 'ku', 'ke', 'ko', 'sa', 'shi', 'su', 'se', 'so', 'ta',
		'chi', 'tsu', 'te', 'to', 'na', 'ni', 'nu', 'ne', 'no', 'ha', 'hi', 'fu', 'he', 'ho', 'ma', 'mi', 'mu',
		'me', 'mo', 'ya', '', 'yu', '', 'yo', 'ra', 'ri', 'ru', 're', 'ro', 'wa', '', 'wo', '', 'n'
	]);
	const youonHiragana = ref(['kya', '', 'kyu', '', 'kyo', 'sha', '', 'shu', '', 'sho', 'cha', '', 'chu', '', 'cho',
		'nya', '', 'nyu', '', 'nyo', 'hya', '', 'hyu', '', 'hyo', 'mya', '', 'myu', '', 'myo', 'rya', '', 'ryu',
		'', 'ryo', 'gya', '', 'gyu', '', 'gyo', 'ja', '', 'ju', '', 'jo', 'bya', '', 'byu', '', 'byo', 'pya', '',
		'pyu', '', 'pyo'
	]);
	const innerAudioContext = uni.createInnerAudioContext();
	const playAudio = (rome) => {
		innerAudioContext.src = `https://jpx2ink.oss-cn-shanghai.aliyuncs.com/audio/${rome}.mp3`;
		innerAudioContext.play()
	}
</script>

<style lang="scss">
	.loadingtext {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateX(-50%) translateY(-50%);

		text {
			font-size: 12px;
			color: #999;
		}
	}

	.detail-popup {
		border-radius: 16px 16px 0 0;

		.detail-title {
			font-size: 22px;
		}

		.tools-btns {
			margin-top: 16px;
			width: calc(100% - 32px);
			display: flex;
			align-items: center;
			justify-content: space-between;

			view {
				display: flex;
				align-items: center;
				gap: 8px;
			}
		}

		.detail-img {
			border-radius: 8px;
			width: calc(100% - 32px);
			margin-top: 16px;
			aspect-ratio: 880/739;
			position: relative;
			border: 2px dashed #ccc;

			.kana-write {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				opacity: 0.5;
			}
		}
	}

	.drawingboard {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 9;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.head {
		position: sticky;
		top: 0;
		z-index: 9;
	}

	.table {
		margin: 16px;
		padding-bottom: calc(env(safe-area-inset-bottom) + 16px);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 10px;
	}

	.kana-tab {
		border-radius: 35px;
		font-size: 14px;
		flex: 1;
		height: 35px;
	}

	.bg-white {
		background-color: white;
		border-radius: 8px;
		padding: 8px;
		margin: 12px 16px;
		display: flex;
	}

	.kana-tab.active {
		background-color: #07C160;
		color: white;
	}

	.kana-card {
		aspect-ratio: 1;
		border-radius: 12px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: white;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
		transition: all 0.2s ease;
	}

	.kana-card:active {
		transform: scale(0.96);
		background-color: #f5f5f5;
	}

	.kana-character {
		font-size: 24px;
		margin-bottom: 4px;
	}

	.kana-romaji {
		font-size: 12px;
		color: #757575;
	}

	.kana-row-header {
		font-size: 14px;
		font-weight: 600;
		color: #07C160;
		background-color: #f0f9f0;
		border-radius: 8px;
		padding: 4px 8px;
		margin: 12px 0;
	}
</style>