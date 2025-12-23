<template>
	<page-meta :page-style="`overflow:${showDetail? 'hidden' : 'visible'};background-color:#ffffff;`">
		<view style="height: 100vh;display: flex;flex-direction: column;background-color: #ffffff;">
			<view class="header-section">
				<NavbarDefault border title="五十音图"></NavbarDefault>
				<view class="tab-container">
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
					<div class="section-block">
						<div class="kana-row-header">清音</div>
						<div class="grid">
							<div @click="openDetail(item)" class="kana-card" v-for="(item, idx) in unvoicedsound" :key="item + '_' + idx">
								<div class="kana-character">{{get(item)}}</div>
								<div class="kana-romaji">{{ displayRomaji(item) }}</div>
							</div>
						</div>
					</div>
					<div class="section-block">
						<div class="kana-row-header">浊音</div>
						<div class="grid">
							<div @click="openDetail(item)" class="kana-card" v-for="(item, idx) in dakutenHiragana"
								:key="item + '_' + idx">
								<div class="kana-character">{{get(item)}}</div>
								<div class="kana-romaji">{{ displayRomaji(item) }}</div>
							</div>
						</div>
					</div>
					<div class="section-block">
						<div class="kana-row-header">拗音</div>
						<div class="grid">
							<div @click="openDetail(item)" class="kana-card" v-for="(item, idx) in youonHiragana" :key="item + '_' + idx">
								<div class="kana-character">{{get(item)}}</div>
								<div class="kana-romaji">{{ displayRomaji(item) }}</div>
							</div>
						</div>
					</div>
				</div>
			</view>
		</view>
	</page-meta>
	<wd-toast />

	<wd-popup lockScroll safe-area-inset-bottom v-model="showDetail" position="bottom" custom-class="minimal-popup">
		<view class="_GCENTER" style="flex-direction: column;padding: 48rpx 40rpx;">
			<view class="detail-header">
				<view class="detail-title">假名手写板</view>
				<view class="detail-subtitle">跟随描红练习书写</view>
			</view>

			<view class="detail-board-area">
				<image v-if="boardShow" class="kana-write"
					:src="`https://jpx2ink.oss-cn-shanghai.aliyuncs.com/images/${current=='平假名'?'hiragana':'katakana'}/detail/${row}.png`"
					mode="aspectFill"></image>
				<view v-if="boardShow" class="drawingboard">
					<l-signature disableScroll :minLineWidth="8" ref="signatureRef" penColor="black" :penSize="15"
						:openSmooth="true"></l-signature>
				</view>
				<view v-else class="loadingtext">
					<wd-loading size="80rpx" color="#999" />
					<text>加载中...</text>
				</view>
			</view>

			<view class="tools-btns">
				<view class="left-actions">
					<button @click="onClick('undo')" class="btn-flat-secondary">
						<text class="fas fa-reply"></text>
					</button>
					<button @click="onClick('clear')" class="btn-flat-secondary">
						<text class="fas fa-trash"></text>
					</button>
				</view>
				<button @click="onClick('save')" class="btn-flat-primary">保存图片</button>
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
		onUnload
	} from "@dcloudio/uni-app"
	import {
		goPage
	} from "@/utils/common.js"
	import NavbarDefault from "@/components/navbar/default"
	import $http from "@/api/index.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	onUnload(() => {
		if (innerAudioContext) {
			innerAudioContext.stop()
			innerAudioContext.destroy()
		}
	})
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
			"rome": "ji",
			"key": "ji2",
			"hiragana": "ぢ",
			"katakana": "ヂ"
		}, {
			"rome": "zu",
			"key": "zu2",
			"hiragana": "づ",
			"katakana": "ヅ"
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
			// 描红图用图片 key（di/du -> ji2/zu2；ji2/zu2 保持不变）
			row.value = normalizeImageKey(item)
			// 音频仍按 ji/zu 命名
			playAudio(item)
			showDetail.value = true
			setTimeout(() => {
				boardShow.value = true
			}, 100)
		}
	}

	// 兼容：
	// 1) 页面内部需要区分 ji/zu 的第二组（ぢ/づ），所以用 ji2/zu2 作为唯一 key
	// 2) 但你的音频资源仍然是 ji.mp3/zu.mp3，不改命名
	// 3) 描红图资源希望用 ji2.png/zu2.png（并且支持 di/du 映射）
	const audioAliasMap = {
		ji2: 'ji',
		zu2: 'zu',
		di: 'ji',
		du: 'zu'
	}
	const imageAliasMap = {
		di: 'ji2',
		du: 'zu2'
	}
	const normalizeAudioKey = (k) => audioAliasMap[k] || k
	const normalizeImageKey = (k) => imageAliasMap[k] || k
	// 列表展示仍显示 ji/zu（不显示 ji2/zu2）
	const displayRomajiMap = {
		ji2: 'ji',
		zu2: 'zu'
	}
	const displayRomaji = (k) => displayRomajiMap[k] || k

	const get = (key) => {
		const res = kanaData.value.find(item => key === (item.key || item.rome))
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
	const dakutenHiragana = ref(['ga', 'gi', 'gu', 'ge', 'go', 'za', 'ji', 'zu', 'ze', 'zo', 'da', 'ji2', 'zu2', 'de', 'do',
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
		const key = normalizeAudioKey(rome)
		innerAudioContext.src = `https://jpx2ink.oss-cn-shanghai.aliyuncs.com/audio/${key}.mp3`;
		innerAudioContext.play()
	}
</script>

<style lang="scss">
	._GCENTER {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.header-section {
		background: #fff;

		padding-bottom: 16rpx;
	}


	.tab-container {
		background-color: #f7f8fa;
		border-radius: 200rpx;
		padding: 8rpx;
		margin: 24rpx 40rpx;
		display: flex;
		gap: 8rpx;
	}

	.kana-tab {
		border-radius: 200rpx;
		font-size: 28rpx;
		font-weight: 500;
		flex: 1;
		height: 80rpx;
		color: #8c9096;
		transition: all 0.3s ease;
		background-color: transparent;
	}

	.kana-tab.active {
		background-color: #07C160;

		color: white;
		font-weight: 600;
	}


	.table {
		margin: 0 40rpx;
		padding-bottom: calc(env(safe-area-inset-bottom) + 64rpx);
	}

	.section-block {
		margin-bottom: 64rpx;
	}

	.kana-row-header {
		font-size: 40rpx;
		font-weight: 700;
		color: #1a1a1a;

		background-color: transparent;
		padding: 32rpx 8rpx 24rpx 8rpx;
		margin: 0;
		display: flex;
		align-items: center;
	}


	.kana-row-header::before {
		content: '';
		display: block;
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%;
		background-color: #07C160;
		margin-right: 16rpx;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 24rpx;

	}


	.kana-card {
		aspect-ratio: 1;
		border-radius: 32rpx;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #f7f8fa;

		transition: all 0.2s ease;
		box-shadow: none;

	}

	.kana-card:active {
		transform: scale(0.96);
		background-color: #ebedf0;

	}

	.kana-character {
		font-size: 48rpx;
		font-weight: 500;
		margin-bottom: 4rpx;
		color: #333;
	}

	.kana-romaji {
		font-size: 22rpx;
		color: #9aa0a6;
		font-weight: 500;
	}


	.minimal-popup {
		border-radius: 48rpx 48rpx 0 0 !important;
		background-color: #ffffff !important;
	}

	.detail-header {
		width: 100%;
		text-align: left;
		margin-bottom: 40rpx;
	}

	.detail-title {
		font-size: 48rpx;
		font-weight: 700;
		color: #1a1a1a;
		margin-bottom: 8rpx;
	}

	.detail-subtitle {
		font-size: 28rpx;
		color: #9aa0a6;
	}

	.detail-board-area {
		border-radius: 40rpx;
		width: 100%;
		aspect-ratio: 880/739;
		position: relative;
		background-color: #f7f8fa;

		border: none;

		overflow: hidden;
	}

	.kana-write {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0.3;

	}

	.drawingboard {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 9;
		top: 0;
		left: 0;
	}

	.loadingtext {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 24rpx;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		text {
			font-size: 26rpx;
			color: #9aa0a6;
		}
	}


	.tools-btns {
		margin-top: 48rpx;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 32rpx;
	}

	.left-actions {
		display: flex;
		gap: 24rpx;
		flex: 1;
	}


	button::after {
		border: none;
	}

	.btn-flat-secondary {
		background-color: #f7f8fa;
		color: #555;
		font-size: 28rpx;
		font-weight: 500;
		border-radius: 24rpx;
		padding: 0 32rpx;
		height: 96rpx;
		line-height: 96rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12rpx;
		margin: 0;
		flex: 1;
	}

	.btn-flat-primary {
		background-color: #07C160;
		color: #ffffff;
		font-size: 32rpx;
		font-weight: 600;
		border-radius: 24rpx;
		padding: 0 48rpx;
		height: 96rpx;
		line-height: 96rpx;
		margin: 0;
		flex: 1.5;

		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn-flat-primary:active {
		opacity: 0.85;
	}

	.btn-flat-secondary:active {
		background-color: #ebedf0;
	}
</style>