<template>
	<view>
		<view class="head">
			<NavbarDefault border title="五十音图"></NavbarDefault>
			<div class="bg-white">
				<div @click="current='平假名'" :class="{active:current=='平假名'}" class="kana-tab _GCENTER">
					平假名
				</div>
				<div @click="current='片假名'" :class="{active:current=='片假名'}" class="kana-tab  _GCENTER">
					片假名
				</div>
			</div>
		</view>
		<!-- 五十音图表格 -->
		<div class="table" v-if="loading">
			<div class="space-y-2">
				<div class="kana-row-header">清音</div>
				<div class="grid">
					<div @click="playAudio(item)" class="kana-card" v-for="item in unvoicedsound" :key="item">
						<div class="kana-character">{{get(item)}}</div>
						<div class="kana-romaji">{{item}}</div>
					</div>
				</div>
			</div>
			<div class="space-y-2">
				<div class="kana-row-header">浊音</div>
				<div class="grid">
					<div @click="playAudio(item)" class="kana-card" v-for="item in dakutenHiragana" :key="item">
						<div class="kana-character">{{get(item)}}</div>
						<div class="kana-romaji">{{item}}</div>
					</div>
				</div>
			</div>
			<div class="space-y-2">
				<div class="kana-row-header">拗音</div>
				<div class="grid">
					<div @click="playAudio(item)" class="kana-card" v-for="item in youonHiragana" :key="item">
						<div class="kana-character">{{get(item)}}</div>
						<div class="kana-romaji">{{item}}</div>
					</div>
				</div>
			</div>
		</div>
		<wd-toast />
	</view>
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
	const kanaData = ref([])
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
		innerAudioContext.src = `http://jp.x2.ink/audio/${rome}.mp3`;
		innerAudioContext.play()
		innerAudioContext.onPlay(() => {
			console.log('开始播放');
		});
		innerAudioContext.onStop(() => {
			console.log('停止播放');
		});
	}
	const loading = ref(false)
	const getKanaData = async () => {
		uni.request({
			url: "https://jp.x2.ink/backend/static/kana.json",
			method: "GET",
			success(res) {
				kanaData.value = res.data
				loading.value = true
				toast.close()
			}
		})
	}
	onLoad(() => {
		toast.loading("数据加载中")
		getKanaData()
	})
</script>

<style lang="scss" scoped>
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