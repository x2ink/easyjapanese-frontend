<template>
	<view>
		<Navbar>
			<template #left>
				<wd-popover mode="menu" :content="menu" @menuclick="changeSearchType">
					<view class="search-type">
						<text>{{ current }}</text>
						<wd-icon custom-class="icon-arrow" name="fill-arrow-down"></wd-icon>
					</view>
				</wd-popover>
			</template>
		</Navbar>
		<view class="soundlist">
			<FiftySounds @save="saveImg" :type="`${hiragana?'hiragana':'katakana'}`" title="清音" :data="unvoicedsound"></FiftySounds>
			<FiftySounds @save="saveImg" :type="`${hiragana?'hiragana':'katakana'}`" title="浊音" :data="dakutenHiragana"></FiftySounds>
			<FiftySounds @save="saveImg" :type="`${hiragana?'hiragana':'katakana'}`" title="拗音" :data="youonHiragana"></FiftySounds>
		</view>
		<wd-toast :zIndex="999"/>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import Navbar from '@/components/navbar/navbar.vue';
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	import FiftySounds from "@/components/fiftysounds/fiftysounds.vue"
	const current = ref('平假名')
	const changeSearchType = (e) => {
		current.value = e.item.content
		if (e.item.content == "平假名") {
			hiragana.value = true
		} else {
			hiragana.value = false
		}
	}
	const menu = ref([{
			content: '平假名'
		},
		{
			content: '片假名'
		}
	])
	const toast = useToast()
	const hiragana = ref(true)
	const showDetail = ref(true)
	const unvoicedsound = ref(new Map([
		['', ['a', 'i', 'u', 'e', 'o']], // あ行
		['-', ['a', 'i', 'u', 'e', 'o']], // あ行（另一种表示）
		['k', ['ka', 'ki', 'ku', 'ke', 'ko']], // か行
		['s', ['sa', 'shi', 'su', 'se', 'so']], // さ行
		['t', ['ta', 'chi', 'tsu', 'te', 'to']], // た行
		['n', ['na', 'ni', 'nu', 'ne', 'no']], // な行
		['h', ['ha', 'hi', 'fu', 'he', 'ho']], // は行
		['m', ['ma', 'mi', 'mu', 'me', 'mo']], // ま行
		['y', ['ya', '', 'yu', '', 'yo']], // や行（注意：や行只有や、ゆ、よ）
		['r', ['ra', 'ri', 'ru', 're', 'ro']], // ら行
		['w', ['wa', '', 'wo', '', 'n']], // わ行（注意：わ行只有わ、を、ん）
	]));
	const dakutenHiragana = ref(new Map([
		['', ['a', 'i', 'u', 'e', 'o']], // あ行
		['g', ['ga', 'gi', 'gu', 'ge', 'go']], // が行
		['z', ['za', 'ji', 'zu', 'ze', 'zo']], // ざ行
		['d', ['da', 'ji', 'zu', 'de', 'do']], // だ行
		['b', ['ba', 'bi', 'bu', 'be', 'bo']], // ば行
		['p', ['pa', 'pi', 'pu', 'pe', 'po']], // ぱ行
	]));
	const youonHiragana = ref(new Map([
		['', ['ya', '', 'yu', '', 'yo']], // あ行
		['ky', ['kya', '', 'kyu', '', 'kyo']], // きゃ行
		['sh', ['sha', '', 'shu', '', 'sho']], // しゃ行
		['ch', ['cha', '', 'chu', '', 'cho']], // ちゃ行
		['ny', ['nya', '', 'nyu', '', 'nyo']], // にゃ行
		['hy', ['hya', '', 'hyu', '', 'hyo']], // ひゃ行
		['my', ['mya', '', 'myu', '', 'myo']], // みゃ行
		['ry', ['rya', '', 'ryu', '', 'ryo']], // りゃ行
		['gy', ['gya', '', 'gyu', '', 'gyo']], // ぎゃ行
		['j', ['ja', '', 'ju', '', 'jo']], // じゃ行
		['by', ['bya', '', 'byu', '', 'byo']], // びゃ行
		['py', ['pya', '', 'pyu', '', 'pyo']], // ぴゃ行
	]));
	const saveImg=(res)=>{
		if (res.isEmpty) {
			console.log(toast);
			toast.warning(`画板为空`)
			return
		}
		url.value = res.tempFilePath;
		uni.saveImageToPhotosAlbum({
			filePath: res.tempFilePath,
			success: () => {
				toast.success(`保存成功`)
			},
			fail: () => {
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
</script>

<style scoped lang="scss">
	.soundlist {
		display: flex;
		flex-direction: column;
		gap: 15px;
		padding-bottom: calc(15px + env(safe-area-inset-bottom));
	}
</style>