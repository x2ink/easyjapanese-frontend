<template>
	<view>
		<view class="head">
			<NavbarDefault title="单词跟读"></NavbarDefault>
		</view>
		<!-- 单词展示区 -->
		<div class="word-display">
			<div class="word-kanji">{{word.word}}</div>
			<div class="word-furigana">{{word.kana}}</div>
			<div class="word-meaning">{{word.meaning.map(item=>item.meaning).join('；')}}</div>
		</div>

		<!-- 录音控制区 -->
		<div class="recording-control">
			<button @longpress="startRecord" @touchend="endRecord" class="record-btn _GCENTER">
				<view v-if="recording" class="loadership_XNYIJ">
					<view></view>
					<view></view>
					<view></view>
					<view></view>
					<view></view>
				</view>
				<i v-else class="fas fa-microphone"></i>
			</button>
			<div class="recording-time">长按麦克风开始录音</div>
			<!-- 录音操作按钮组 (初始隐藏) -->
			<div class="recording-actions" style="display: none;">
				<button class="action-btn">取消</button>
				<button class="action-btn primary">发布</button>
			</div>
		</div>
		<!-- 其他用户录音列表 -->
		<div class="recordings-list">
			<div class="section-title">大家的发音</div>
			<!-- 录音项1 -->
			<div class="recording-item" v-for="(item,index) in List" :key="item.id">
				<div class="user-info">
					<uv-avatar size="35" :src="item.user.avatar"></uv-avatar>
					<div class="user-name">
						<view>{{item.user.nickname}}</view>
						<div class="recording-meta">{{dayjs().to(dayjs(item.time))}}</div>
					</div>
					<div class="recording-actions">
						<button @click="like(index,item.id)" class="like-btn" :class="{liked:item.has}">
							<i class="fas fa-heart"></i>
							<span class="like-count">{{item.like}}</span>
						</button>
						<button class="play-btn" @click="playUserRecord(index,item.voice)">
							<view v-if="item.play" class="loadership_XNYIJ" style="transform: scale(0.5);">
								<view></view>
								<view></view>
								<view></view>
								<view></view>
								<view></view>
							</view>
							<i v-else class="fas fa-play"></i>
						</button>
					</div>
				</div>
			</div>
			<wd-status-tip v-if="total==0" image="https://jp.x2.ink/images/status/blank.png" tip="还没有用户录音~" />
		</div>
		<!-- 发布弹窗 -->
		<wd-popup position="bottom" v-model="recorded" custom-style="border-radius:16px 16px 0 0;"
			@close="recorded=false">
			<view class="release">
				<div class="modal-header">录音完成</div>

				<div class="playback-controls">
					<button @click="playRecord()" class="playback-btn">
						<view v-if="playing" class="loadership_XNYIJ" style="transform: scale(0.8);">
							<view></view>
							<view></view>
							<view></view>
							<view></view>
							<view></view>
						</view>
						<i v-else class="fas fa-play"></i>
					</button>
				</div>
				<div class="playback-time">{{Math.round(recordDuration/1000)}}"</div>
				<div class="agreement-checkbox">
					<div @click="agree=!agree" :class="{checked:agree}" class="checkbox">
						<i class="fas fa-check" style="font-size: 12px;"></i>
					</div>
					<div class="agreement-text">
						我已阅读并同意<text class="agreement-link">《轻松日语用户发音功能使用协议》</text>
					</div>
				</div>
				<div class="modal-actions">
					<button @click="recorded=false" class="modal-btn cancel-btn">取消</button>
					<button @click="submit()" class="modal-btn confirm-btn">发布</button>
				</div>
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
	import {
		onLoad,
		onReachBottom,
		onUnload,
		onShow
	} from "@dcloudio/uni-app"
	import {
		goPage,
	} from "@/utils/common.js"
	import {
		userStore
	} from "@/stores/index.js"
	import NavbarDefault from "@/components/navbar/default"
	import $http from "@/api/index.js"
	import http from '@/utils/request.js'
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	import dayjs from 'dayjs'
	import relativeTime from 'dayjs/plugin/relativeTime'
	import 'dayjs/locale/zh'
	dayjs.locale('zh')
	dayjs.extend(relativeTime)
	const toast = useToast()
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = false;
	const playUserRecord = (index, url) => {
		innerAudioContext.src = url;
		innerAudioContext.play();
		innerAudioContext.onPlay(() => {
			List.value[index].play = true
		});
		innerAudioContext.onError((res) => {
			List.value[index].play = false
		});
		innerAudioContext.onEnded((res) => {
			List.value[index].play = false
		})
	}
	// 开始录音
	const recording = ref(false)
	const playing = ref(false)
	const playRecord = () => {
		if (voicePath.value) {
			innerAudioContext.src = voicePath.value;
			innerAudioContext.play();
			innerAudioContext.onPlay(() => {
				playing.value = true
			});
			innerAudioContext.onError((res) => {
				playing.value = false
			});
			innerAudioContext.onEnded((res) => {
				playing.value = false
			})
		}
	}
	const startRecord = () => {
		if (!userStore().loginStatus) {
			goPage("/pages/login/login?toast=请登录之后使用")
			return
		}
		recorderManager.start();
		recording.value = true
	}
	const recorded = ref(false)
	const endRecord = () => {
		recorderManager.stop();
		recording.value = false
	}
	// 加载用户发音
	const id = ref(null)
	const word = ref({
		word: null,
		kana: null,
		meaning: []
	})
	const total = ref(0)
	const page = ref(1)
	const size = ref(10)
	const List = ref([])
	const noResult = ref(false)
	const getList = async () => {
		const res = await $http.word.getFollowRead(id.value, page.value, size.value)
		total.value = res.total
		List.value = List.value.concat(res.data.map(item => ({
			...item,
			has: false,
			play: false,
		})));
		if (total.value == 0) {
			noResult.value = true
		}
	}
	const agree = ref(false)
	const submit = () => {
		if (!agree.value) {
			toast.warning(`请同意《轻松日语用户发音功能使用协议》`)
			return
		}
		if (Math.round(recordDuration.value / 500) == 0) {
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
	onReachBottom(() => {
		if (total.value > List.value.length) {
			++page.value
			getList()
		}
	})
	onLoad((op) => {
		id.value = op.id
		if (op.word) {
			word.value = JSON.parse(op.word)
		}
		getList()
	})
	onUnload(() => {
		recorderManager.stop();
	})
	const like = async (index, id) => {
		if (!userStore().loginStatus) {
			goPage("/pages/login/login?toast=请登录之后使用")
			return
		}
		if (List.value[index].has) {
			await $http.word.unlikeFollowRead({
					id
				})
				--List.value[index].like
		} else {
			await $http.word.likeFollowRead({
					id
				})
				++List.value[index].like
		}
		List.value[index].has = !List.value[index].has
	}
	const recorderManager = uni.getRecorderManager()
	const voicePath = ref(null)
	const recordDuration = ref(0)
	onMounted(() => {
		recorderManager.onStart(function(res) {
			recordDuration.value = 0
			console.log("开始录音");
		});
		recorderManager.onStop(function(res) {
			if (Math.round(res.duration / 500) == 0) {
				toast.warning(`录音时间过短`)
				return
			}
			voicePath.value = res.tempFilePath;
			recordDuration.value = res.duration
			recorded.value = true
		});
	})
</script>
<style>
	page {
		background-color: white;
	}
</style>
<style lang="scss" scoped>
	.loadership_XNYIJ {
		display: flex;
		position: relative;
		width: 23px;
		height: 30px;
	}


	.modal-header {
		font-size: 18px;
		font-weight: 600;
		color: #212121;
		margin-bottom: 16px;
		text-align: center;
	}

	.playback-controls {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 20px 0;
	}

	.playback-btn {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background-color: #07C160;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20px;
		border: none;
		cursor: pointer;
		margin: 0 12px;
	}

	.playback-time {
		font-size: 14px;
		color: #757575;
		text-align: center;
		margin-top: 8px;
	}

	.agreement-checkbox {
		display: flex;
		align-items: center;
		margin: 16px 0;
	}

	.checkbox {
		width: 18px;
		height: 18px;
		border-radius: 4px;
		margin-right: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #eeeeee;
		background-color: white;
		border: 1px solid #eeeeee;
	}

	.checked {
		background-color: #07C160;
		border-color: #07C160;
	}

	.agreement-text {
		font-size: 13px;
		color: #757575;
		line-height: 1.4;
		flex: 1;
	}

	.agreement-link {
		color: #07C160;
	}

	.modal-actions {
		display: flex;
		justify-content: space-between;
		margin-top: 20px;
	}

	.modal-btn {
		flex: 1;
		padding: 12px;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 500;
		border: none;
		cursor: pointer;
	}

	.cancel-btn {
		background-color: white;
		color: #757575;
		border: 1px solid #E0E0E0;
		margin-right: 8px;
	}

	.confirm-btn {
		background-color: #07C160;
		color: white;
		margin-left: 8px;
	}

	.confirm-btn:disabled {
		background-color: #E0E0E0;
		cursor: not-allowed;
	}


	.release {
		padding: 16px 16px calc(env(safe-area-inset-bottom) + 16px) 16px;
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

	.head {
		position: sticky;
		top: 0;
		z-index: 9;
	}

	/* 单词展示区 */
	.word-display {
		padding: 24px 16px;
		margin: 16px 16px 0 16px;
		border-radius: 8px;
		text-align: center;
		background-color: #f8f9fa;
	}

	.word-kanji {
		font-size: 28px;
		font-weight: 600;
		color: #212121;
		margin-bottom: 8px;
	}

	.word-furigana {
		font-size: 20px;
		color: #757575;
	}

	.word-meaning {
		font-size: 16px;
		color: #424242;
		margin-top: 12px;
	}

	/* 录音控制区 */
	.recording-control {
		padding: 24px 16px;
		text-align: center;
	}

	.record-btn {
		width: 72px;
		height: 72px;
		border-radius: 50%;
		background-color: #07C160;
		color: white;
		border: none;
		font-size: 24px;
		cursor: pointer;
		box-shadow: 0 4px 12px rgba(7, 193, 96, 0.3);
		transition: all 0.2s ease;
	}

	.record-btn:active {
		transform: scale(0.95);
	}

	.recording-time {
		font-size: 14px;
		color: #757575;
		margin-top: 12px;
	}

	/* 录音操作按钮组 */
	.recording-actions {
		display: flex;
		justify-content: center;
		gap: 16px;
	}

	.action-btn {
		padding: 8px 16px;
		border-radius: 20px;
		font-size: 14px;
		border: 1px solid #E0E0E0;
		background-color: white;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.action-btn.primary {
		background-color: #07C160;
		color: white;
		border-color: #07C160;
	}

	.action-btn:active {
		transform: scale(0.95);
	}

	/* 其他用户录音列表 */
	.recordings-list {
		flex: 1;
		overflow-y: auto;
		padding: 16px;
		background-color: white;
	}

	.section-title {
		font-size: 16px;
		font-weight: 600;
		color: #212121;
		padding-bottom: 8px;
		border-bottom: 1px solid #f0f0f0;
	}

	/* 录音项 */
	.recording-item {
		background-color: white;
		padding: 12px;
		border-bottom: 1px solid #f0f0f0;
	}

	.user-info {
		display: flex;
		align-items: center;
	}



	.user-name {
		margin-left: 8px;
		font-size: 14px;
		font-weight: 500;
		color: #212121;
		flex: 1;
	}

	.recording-meta {
		font-size: 12px;
		color: #9E9E9E;
		margin-left: auto;
	}



	.recording-actions {
		display: flex;
		align-items: center;
	}

	.like-btn {
		color: #9E9E9E;
		font-size: 14px;
		margin-left: 8px;
		border: none;
		background: none;
		cursor: pointer;
	}

	.like-btn.liked {
		color: #F44336;
	}

	.like-count {
		font-size: 12px;
		color: #9E9E9E;
		margin-left: 4px;
	}

	.play-btn {
		width: 32px;
		height: 32px;
		font-size: 16px;
		border-radius: 50%;
		background-color: #07C160;
		color: white;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
</style>