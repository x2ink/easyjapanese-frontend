<template>
	<view style="background-color: white;margin: 15px;border-radius: 8px;padding: 10px;">
		<h3>{{title}}</h3>
		<view class="unvoicedsound">
			<view class="kana" v-for="[key, value] in data.entries()" :key="key">
				<view class="head _GCENTER">{{key}}</view>
				<view @click="openPopup(item)" :style="{aspectRatio: key==''?2/1:1}" class="item _GCENTER"
					v-for="item in value" :key="item">
					<image v-if="key!=''" :src="`/static/${type}/${item}.png`" mode="aspectFit"></image>
					<text class="head" v-else>{{item}}</text>
				</view>
			</view>
		</view>
		<wd-popup :z-index="999" v-model="showDetail" custom-style="border-radius:32rpx;">
			<view class="detail">
				<view class="head">
					<text>罗马音</text>
					<wd-icon name="sound" size="18px" color="#5880F2"></wd-icon>
				</view>
				<view class="rome">{{rome}}</view>
				<image class="spell" :src="`/static/${type}/detail/${rome}.png`" mode="widthFix"></image>
				<wd-button custom-class="btn" type="info" size="medium">练习书写</wd-button>
				<wd-button custom-class="btn" size="medium">深度学习</wd-button>
			</view>
		</wd-popup>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
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
	const openPopup = (data) => {
		showDetail.value = true
		rome.value = data
	}
</script>

<style scoped lang="scss">
	h3 {
		text-align: center;
		margin: 10px 0;
	}

	:deep(.btn) {
		width: 100%;
		margin-top: 10px;
	}

	.detail {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 15px;
		width: 300px;

		.spell {
			margin-top: 20px;
			width: 80%;
		}

		.rome {
			margin-top: 20px;
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