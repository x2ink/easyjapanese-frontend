<template>
	<view>
		<Navbar title="单词跟读">
		</Navbar>
		<view class="word _GCENTER">
			<text>{{word}}</text>
		</view>
		<wd-divider>用户发音</wd-divider>
		<view class="readlist">
			<view class="userread" v-for="item in List" :key="item.id">
				<view class="right">
					<view class="sound _GCENTER">
						<wd-icon name="sound" size="20" color="#57D09B" />
					</view>
					<view class="userinfo">
						<uv-avatar size="40" :src="item.user.avatar"></uv-avatar>
						<view class="text">
							<text>{{item.user.nickname}}</text>
							<text>{{dayjs().to(dayjs(item.time))}}</text>
						</view>
					</view>
				</view>
				<view class="left _GCENTER">
					<wd-icon size="20" name="thumb-up" color="#999" />
					<text>{{item.like}}</text>
				</view>
			</view>
		</view>
		<view class="followbtn">
			<wd-button type="error" size="large" @longpress="startRecord" @touchend="endRecord">
				<view v-if="recording" class="loadership_XNYIJ">
					<view></view>
					<view></view>
					<view></view>
					<view></view>
					<view></view>
				</view>
				<text v-else>长按录音</text>
			</wd-button>
		</view>
		<!-- 发布 -->
		<wd-popup v-model="recorded" :z-index="100" position="bottom" custom-style="border-radius:16px 16px 0 0;"
			@close="handleClose">
			<view class="result">
				<view class="wordtitle">{{word}}</view>
				<text>录音</text>
				<view class="chat" @click="playRecord()">
					<wd-icon name="sound" size="18px"></wd-icon>
					<text style="font-size: 14px;">{{Math.round(recordDuration/1000)}}"</text>
				</view>
				<view class="agree">
					<wd-checkbox v-model="agree">
						<view class="agreement">我已同意并阅读<text>《轻松日语用户发音功能使用协议》</text></view>
					</wd-checkbox>
				</view>
				<view class="btns">
					<wd-button type="info" custom-class="btn" @click="recorded=false">取消</wd-button>
					<wd-button custom-class="btn" @click="submit()">上传</wd-button>
				</view>
			</view>
		</wd-popup>
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import Navbar from '@/components/navbar/navbar.vue';
	import {
		onLoad,
		onShow,
		onUnload,
		onReachBottom
	} from "@dcloudio/uni-app"
	import $http from "@/api/index.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	import dayjs from 'dayjs'
	import relativeTime from 'dayjs/plugin/relativeTime'
	import 'dayjs/locale/zh'
	dayjs.locale('zh')
	dayjs.extend(relativeTime)
	import http from '@/utils/request.js'
	const recorderManager = uni.getRecorderManager();
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = true;
	const voicePath = ref(null)
	const recordDuration = ref(null)
	onMounted(() => {
		recorderManager.onStop(function(res) {
			voicePath.value = res.tempFilePath;
			recordDuration.value = res.duration
		});
	})
	const id = ref(null)
	const word = ref(null)
	const total = ref(0)
	const page = ref(1)
	const size = ref(10)
	const List = ref([])
	const getList = async () => {
		const res = await $http.word.getFollowRead(id.value, page.value, size.value)
		total.value = res.total
		List.value = List.value.concat(res.data)
	}
	onReachBottom(() => {
		if (total.value > List.value.length) {
			++page.value
			getList()
		}
	})
	onLoad((op) => {
		id.value = op.id
		word.value = op.word
		getList()
	})
	onUnload(() => {
		recorderManager.stop();
	})
	const recording = ref(false)
	const playRecord = () => {
		if (voicePath.value) {
			innerAudioContext.src = voicePath.value;
			innerAudioContext.play();
		}
	}
	const startRecord = () => {
		recorderManager.start();
		recording.value = true
	}
	const recorded = ref(false)
	const endRecord = () => {
		recorderManager.stop();
		recording.value = false
		recorded.value = true
	}
	const agree = ref(false)
	const submit = () => {
		if (!agree.value) {
			toast.warning(`请同意《轻松日语用户发音功能使用协议》`)
			return
		}
		if (Math.round(recordDuration.value / 1000) == 0) {
			toast.warning(`语音时间过短`)
			recorded.value = false
			return
		}
		toast.loading('正在提交中...')
		uni.uploadFile({
			url: `${http.baseUrl}upload`,
			filePath: voicePath.value,
			name: 'file',
			success: async (fileRes) => {
				const res = await $http.word.followRead({
					voice: JSON.parse(fileRes.data).data,
					word_id: Number(id.value),
				})
				toast.close()
				toast.success(`提交成功请等待审核`)
				recorded.value = false
			}
		});
	}
</script>

<style scoped lang="scss">
	:deep(.btn) {
		width: 100%;
	}

	.agree {
		margin-bottom: 15px;

		.agreement {
			font-size: 12px;
			color: #999;

			text {
				color: #5880F2;
			}
		}
	}

	.loadership_XNYIJ {
		display: flex;
		position: relative;
		width: 23px;
		height: 30px;
	}

	.loadership_XNYIJ view {
		position: absolute;
		width: 3px;
		height: 10px;
		background: #ffffff;
		top: 10px;
		animation: loadership_XNYIJ_scale 1.8s infinite, loadership_XNYIJ_fade 1.8s infinite;
		animation-timing-function: ease-in-out;
	}

	.loadership_XNYIJ view:nth-child(1) {
		animation-delay: 0.00s;
		left: 0px;
	}

	.loadership_XNYIJ view:nth-child(2) {
		animation-delay: 0.16s;
		left: 5px;
	}

	.loadership_XNYIJ view:nth-child(3) {
		animation-delay: 0.32s;
		left: 10px;
	}

	.loadership_XNYIJ view:nth-child(4) {
		animation-delay: 0.48s;
		left: 15px;
	}

	.loadership_XNYIJ view:nth-child(5) {
		animation-delay: 0.64s;
		left: 20px;
	}

	@keyframes loadership_XNYIJ_scale {

		0%,
		44.44444444444445%,
		100% {
			transform: scaleY(1);
		}

		22.222222222222225% {
			transform: scaleY(3);
		}
	}

	@keyframes loadership_XNYIJ_fade {

		0%,
		44.44444444444445%,
		100% {
			opacity: 1;
		}

		22.222222222222225% {
			opacity: 1;
		}
	}

	.result {
		padding: 15px;
		padding-bottom: env(safe-area-inset-bottom);

		.wordtitle {
			text-align: center;
			font-size: 24px;
			font-weight: bold;
		}

		>text {
			font-size: 14px;
		}

		.chat {
			display: flex;
			width: 60%;
			align-items: center;
			line-height: 35px;
			justify-content: space-between;
			background-color: #57D09B;
			color: white;
			padding: 0 10px;
			border-radius: 4px 35px 35px 35px;
			margin: 15px 0;
		}

		.btns {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 15px;
		}
	}

	.followbtn {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 10px;
		position: fixed;
		bottom: 0;
		right: 0;
		left: 0;
		padding: 20px 15px calc(env(safe-area-inset-bottom)) 15px;
		background: white;
		border-top: #f5f5f5 2px solid;
	}

	.word {
		margin: 0 10px;
		background-color: white;
		border-radius: 8px;
		padding: 15px;

		text {
			font-size: 28px;
			font-weight: bold;
		}
	}

	.readlist {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin: 10px;
		padding-bottom: calc(env(safe-area-inset-bottom) + 80px);

		.userread {
			background-color: white;
			border-radius: 8px;
			display: flex;
			padding: 15px;
			align-items: center;
			justify-content: space-between;

			.left {
				color: #999;
				gap: 5px;
			}

			.right {
				display: flex;
				align-items: center;
				gap: 10px;

				.sound {
					width: 30px;
					height: 30px;
					background-color: #f5f5f5;
					border-radius: 8px;
				}

				.userinfo {
					display: flex;
					align-items: center;
					gap: 10px;

					.text {
						display: flex;
						flex-direction: column;

						text {
							&:nth-of-type(1) {
								font-size: 14px;
							}

							&:nth-of-type(2) {
								font-size: 12px;
								color: #999;
								margin-top: 3px;
							}
						}
					}

				}
			}
		}
	}
</style>