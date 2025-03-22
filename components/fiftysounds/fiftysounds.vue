<template>
	<view style="background-color: white;margin:0 15px;border-radius: 8px;padding: 10px;">
		<view class="bigtitle">{{title}}</view>
		<view class="unvoicedsound">
			<view class="kana" v-for="[key, value] in data.entries()" :key="key">
				<view class="head _GCENTER">{{key}}</view>
				<view @click="openPopup(item)" :style="{aspectRatio: key==''?2/1:1}" class="item _GCENTER"
					v-for="item in value" :key="item">
					<image v-if="key!=''&&item!=''" :src="`http://jp.x2.ink/images/${type}/${item}.png`"
						mode="aspectFit"></image>
					<text class="head" v-else>{{item}}</text>
				</view>
			</view>
		</view>
		<wd-popup :z-index="999" v-model="showDetail" custom-style="border-radius:32rpx;">
			<view class="detail">
				<view class="head" @click="playAudio()">
					<text style="color: #5880F2;">罗马音</text>
					<wd-icon name="sound" size="18px" color="#5880F2"></wd-icon>
				</view>
				<view class="rome">{{rome}}</view>
				<view class="spell">
					<image v-if="boardShow" :src="`http://jp.x2.ink/images/${type}/detail/${rome}.png`"
						mode="aspectFit"></image>
					<view v-if="boardShow" class="drawingboard">
						<l-signature disableScroll ref="signatureRef" :penColor="penColor" :penSize="penSize"
							:openSmooth="openSmooth"></l-signature>
					</view>
					<view v-else class="loadingtext">
						<wd-loading size="40px" />
						<text>手写板加载中</text>
					</view>
				</view>
				<view class="tools">
					<view @click="onClick('undo')">
						<wd-icon size="25" name="rollback" />
						<text>撤销</text>
					</view>
					<view @click="onClick('clear')">
						<wd-icon size="25" name="delete1" />
						<text>清空</text>
					</view>
					<view @click="onClick('save')">
						<wd-icon size="25" name="save" />
						<text>保存</text>
					</view>
				</view>
			</view>
		</wd-popup>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	const penColor = ref('black');
	const penSize = ref(15);
	const url = ref('');
	const openSmooth = ref(true);
	const signatureRef = ref(null);
	const boardShow = ref(false)
	const emits = defineEmits(['save'])
	const onClick = (type) => {
		if (type === 'openSmooth') {
			openSmooth.value = !openSmooth.value;
			return;
		}
		if (type === 'save') {
			signatureRef.value.canvasToTempFilePath({
				success: (res) => {
					emits('save', res)
				}
			});
			return;
		}
		if (signatureRef.value) {
			signatureRef.value[type]();
		}
	};
	const props = defineProps({
		title: {
			type: String
		},
		data: {
			type: Map
		},
		type: {
			type: String
		}
	})
	const showDetail = ref(false)
	const rome = ref('')
	const innerAudioContext = uni.createInnerAudioContext();
	const playAudio = () => {
		innerAudioContext.src = `http://jp.x2.ink/audio/${rome.value}.mp3`;
		innerAudioContext.play()
		innerAudioContext.onPlay(() => {
			console.log('开始播放');
		});
		innerAudioContext.onStop(() => {
			console.log('停止播放');
		});
	}
	const openPopup = (data) => {
		onClick('clear')
		if (data == "") {
			return
		}
		rome.value = data
		playAudio()
		showDetail.value = true
		setTimeout(() => {
			boardShow.value = true
		}, 1000)
	}
</script>

<style scoped lang="scss">
	.bigtitle {
		text-align: center;
		margin: 10px 0;
		font-size: 22px;
		font-weight: bold;
	}

	:deep(.btn) {
		width: 100%;
		margin-top: 10px;
	}

	.tools {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(3, 1fr);

		>view {
			display: flex;
			flex-direction: column;
			gap: 5px;
			justify-content: center;
			align-items: center;

			text {
				font-size: 14px;
			}
		}
	}

	.detail {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 15px;
		width: 300px;

		.spell {
			position: relative;
			width: 300px;
			height: 300px;

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

			.drawingboard {
				position: relative;
				width: 100%;
				height: 100%;
				z-index: 9;
			}

			image {
				opacity: 0.5;
				z-index: 1;
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				width: 300px;
				height: 300px;
			}
		}

		.rome {
			font-size: 26px;
			font-weight: bold;
		}

		.head {
			display: flex;
			gap: 5px;
			align-items: center;
		}
	}

	.unvoicedsound {
		padding: 0 15px;

		.kana {
			display: grid;
			grid-template-columns: 30px repeat(5, 1fr);

			.head {
				color: #999;
			}

			.item {


				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>