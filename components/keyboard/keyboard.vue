<template>
	<view>
		<view class="content">
			<scroll-view class="scroll-view_H" scroll-x="true">
				<view v-for="kana in currentKanaOptions" :key="kana" class="kana-option" @click="selectKana(kana)">
					{{ kana }}
				</view>
			</scroll-view>
			<view style="height: 20px;line-height: 20px;">{{inputText}}</view>
		</view>
		<view class="keyboard">
			<!-- 第一行 -->
			<view class="row">
				<view v-for="key in rows[0]" :key="key" class="key _GCENTER" @click="handleKeyPress(key)">
					{{ key }}
				</view>
			</view>

			<!-- 第二行 -->
			<view class="row">
				<view v-for="key in rows[1]" :key="key" class="key _GCENTER" @click="handleKeyPress(key)">
					{{ key }}
				</view>
			</view>
			<view class="row">
				<view v-for="key in rows[2]" :key="key" class="key _GCENTER" @click="handleKeyPress(key)">
					{{ key }}
				</view>
			</view>
			<view class="row">
				<view v-for="key in rows[3]" :key="key" class="key _GCENTER" @click="handleKeyPress(key)">
					{{ key }}
				</view>
			</view>
			<!-- 第三行 -->
			<view class="row last-row">
				<!-- 左侧功能按钮 -->
				<view class="key _GCENTER function" @click="handleFunction('help')">
					<wd-icon name="help-circle" size="20px"></wd-icon>
				</view>

				<!-- 中间字母 -->
				<view v-for="key in rows[4]" :key="key" class="key _GCENTER" @click="handleKeyPress(key)">
					{{key}}
				</view>

				<!-- 右侧功能按钮 -->
				<view class="key _GCENTER function" @click="handleFunction('del')">
					<wd-icon name="keyboard-delete" size="20px"></wd-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'

	const rows = [
		['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ'],
		['さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と'],
		['な', 'に', 'ぬ', 'ね', 'の', 'は', 'ひ', 'ふ', 'へ', 'ほ'],
		['ま', 'み', 'む', 'め', 'も', 'ら', 'り', 'る', 'れ', 'ろ'],
		['や', 'ゆ', 'よ', 'わ', 'を', 'ん', 'ー']
	]

	const shiftActive = ref(false)
	const inputText = ref('')
	const handleKeyPress = (key) => {
		inputText.value = key
	}
	const handleFunction = (type) => {
		if (type == 'del') {
			inputText.value = inputText.value.slice(0, -1)
		}
	}
	const keys = ref(new Map([
		['あ', ['あ', 'ア', 'ぁ', 'ァ']],
		['い', ['い', 'イ', 'ぃ', 'ィ']],
		['う', ['う', 'ウ', 'ぅ', 'ゥ']],
		['え', ['え', 'エ', 'ぇ', 'ェ']],
		['お', ['お', 'オ', 'ぉ', 'ォ']],
		['か', ['か', 'カ', 'が', 'ガ']],
		['き', ['き', 'キ', 'ぎ', 'ギ']],
		['く', ['く', 'ク', 'ぐ', 'グ']],
		['け', ['け', 'ケ', 'げ', 'ゲ']],
		['こ', ['こ', 'コ', 'ご', 'ゴ']],
		['さ', ['さ', 'サ', 'ざ', 'ザ']],
		['し', ['し', 'シ', 'じ', 'ジ']],
		['す', ['す', 'ス', 'ず', 'ズ']],
		['せ', ['せ', 'セ', 'ぜ', 'ゼ']],
		['そ', ['そ', 'ソ', 'ぞ', 'ゾ']],
		['た', ['た', 'タ', 'だ', 'ダ']],
		['ち', ['ち', 'チ', 'ぢ', 'ヂ']],
		['つ', ['つ', 'ツ', 'づ', 'ヅ', 'っ', 'ッ']],
		['て', ['て', 'テ', 'で', 'デ']],
		['と', ['と', 'ト', 'ど', 'ド']],
		['な', ['な', 'ナ']],
		['に', ['に', 'ニ']],
		['ぬ', ['ぬ', 'ヌ']],
		['ね', ['ね', 'ネ']],
		['の', ['の', 'ノ']],
		['は', ['は', 'ハ', 'ば', 'バ', 'ぱ', 'パ']],
		['ひ', ['ひ', 'ヒ', 'び', 'ビ', 'ぴ', 'ピ']],
		['ふ', ['ふ', 'フ', 'ぶ', 'ブ', 'ぷ', 'プ']],
		['へ', ['へ', 'ヘ', 'べ', 'ベ', 'ぺ', 'ペ']],
		['ほ', ['ほ', 'ホ', 'ぼ', 'ボ', 'ぽ', 'ポ']],
		['ま', ['ま', 'マ']],
		['み', ['み', 'ミ']],
		['む', ['む', 'ム']],
		['め', ['め', 'メ']],
		['も', ['も', 'モ']],
		['や', ['や', 'ヤ', 'ゃ', 'ャ']],
		['ゆ', ['ゆ', 'ユ', 'ゅ', 'ュ']],
		['よ', ['よ', 'ヨ', 'ょ', 'ョ']],
		['わ', ['わ', 'ワ', 'ゎ', 'ヮ']],
		['を', ['を', 'ヲ']],
		['ん', ['ん', 'ン']],
		['ー', ['ー', '−', '―', '‐']]
	]));
	const currentKanaOptions = computed(() => {
		return keys.value.get(inputText.value)
	})
</script>

<style scoped lang="scss">
	.content {
		padding: 5px;
		background-color: #f5f5f5;
		border-bottom: 1px solid #ddd;

		.input-preview {
			font-size: 24px;
			min-height: 36px;
		}

		.scroll-view_H {
			white-space: nowrap;
			width: 100%;
			height: 30px;
		}

		.kana-option {
			display: inline-block;
			height: 30px;
			line-height: 30px;
			text-align: center;
			font-size: 18px;
			padding: 0 10px;

			&:active {
				background-color: #d0d0d0;
			}
		}
	}

	.keyboard {
		padding: 5px;
		background-color: #D0D0DA;

		.row {
			display: flex;
			justify-content: center;
			margin-bottom: 5px;
			gap: 5px;

			&:not(.last-row) .key {
				width: calc((100% - 5px * 9) / 10);
				aspect-ratio: 1;
			}

			&.last-row {
				.key {
					width: calc((100% - 5px * 9) / 10);
					aspect-ratio: 1;

					&.function {
						flex-grow: 1;
						aspect-ratio: inherit;
						background-color: #c0c0d0;
					}
				}
			}
		}

		.key {
			border-radius: 8px;
			background-color: white;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 18px;
			font-weight: bold;
			box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);

			&:active {
				background-color: #e0e0e0;
			}
		}
	}
</style>