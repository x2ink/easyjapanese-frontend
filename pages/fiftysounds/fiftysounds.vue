<template>
	<NavBar title="五十音学习" style="background-color:#F3F3F5;">
		<template #bottom>
			<wd-tabs slidable custom-class="tabs" v-model="current">
				<block v-for="(item,index) in tabList" :key="item.name">
					<wd-tab :title="item.name">
					</wd-tab>
				</block>
			</wd-tabs>
		</template>
	</NavBar>
	<view>
		<FiftySounds :type="`${current==0?'hiragana':'katakana'}`" title="清音" :data="unvoicedsound"></FiftySounds>
		<FiftySounds :type="`${current==0?'hiragana':'katakana'}`" title="浊音" :data="dakutenHiragana"></FiftySounds>
		<FiftySounds :type="`${current==0?'hiragana':'katakana'}`" title="拗音" :data="youonHiragana"></FiftySounds>
	</view>
	<view style="height: 60px;"></view>
	<wd-toast />
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import NavBar from '@/components/navbar.vue'
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	import FiftySounds from "@/components/fiftysounds.vue"
	const toast = useToast()
	const current = ref(0)
	const tabList = ref([{
		name: "平假名"
	}, {
		name: "片假名"
	}])
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
</script>

<style scoped lang="scss">
	:deep(.wd-tabs) {
		background-color: transparent;
	}

	:deep(.wd-tabs__nav) {
		background-color: transparent;
	}
</style>