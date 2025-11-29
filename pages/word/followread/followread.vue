<template>
	<view class="page-container">
		<view class="fixed-header">
			<NavbarDefault title="单词跟读"></NavbarDefault>
			<view class="word-display">
				<button hover-class="none" title="发音">
					<i style="color: #07C160;" class="fas fa-volume-up"></i>
				</button>
				<view class="word-kanji">{{ word.words.join('·') }}</view>
				<view class="word-furigana">{{word.kana}}</view>
				<view class="word-meaning">{{word.description}}</view>
			</view>
			<view class="recording-control">
				<button @longpress="startRecord" @touchend="endRecord" class="record-btn _GCENTER">
					<view v-if="recording" class="loadership_XNYIJ">
						<view></view>
						<view></view>
						<view></view>
						<view></view>
						<view></view>
					</view>
					<text v-else class="fas fa-microphone"></text>
				</button>
				<view class="recording-time">长按麦克风开始录音</view>
				<view class="recording-actions" style="display: none;">
					<button class="action-btn">取消</button>
					<button class="action-btn primary">发布</button>
				</view>
			</view>
			<view class="list-title-bar">
				<view class="section-title">大家的发音</view>
			</view>
		</view>

		<scroll-view class="scroll-list" scroll-y @scrolltolower="loadMore" :lower-threshold="50">
			<view class="recordings-list">
				<view class="recording-item" v-for="(item,index) in List" :key="item.id">
					<view class="user-info">
						<uv-avatar size="35" :src="item.user.avatar"></uv-avatar>
						<view class="user-name">
							<view>{{item.user.nickname}}</view>
							<view class="recording-meta">{{dayjs().to(dayjs(item.time))}}</view>
						</view>
						<view class="recording-actions">
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
						</view>
					</view>
				</view>

				<view v-if="total === 0 && !loading" style="padding-top: 40px;">
					<wd-status-tip :image-size="{ height: 128, width: 128 }"
						image="https://jpx2ink.oss-cn-shanghai.aliyuncs.com/images/status/japan_mountain.png"
						tip="还没有用户录音~" />
				</view>
				<wd-loadmore v-if="total > 0" :state="loadStatus" />
			</view>
		</scroll-view>

		<wd-popup position="bottom" v-model="recorded" custom-style="border-radius:16px 16px 0 0;"
			@close="recorded=false">
			<view class="release">
				<view class="modal-header">录音完成</view>

				<view class="playback-controls">
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
				</view>
				<view class="playback-time">{{Math.round(recordDuration/1000)}}"</view>
				<view class="agreement-checkbox">
					<view @click="agree=!agree" :class="{checked:agree}" class="checkbox">
						<i class="fas fa-check" style="font-size: 12px;"></i>
					</view>
					<view class="agreement-text">
						我已阅读并同意<text @click="goPage('/pages/other/browse/browse',{
							src:`${http.baseUrl}html/tts_agreement.html`
						})" class="agreement-link">《轻松日语用户发音功能使用协议》</text>
					</view>
				</view>
				<view class="modal-actions">
					<button @click="recorded=false" class="modal-btn cancel-btn">取消</button>
					<button @click="submit()" class="modal-btn confirm-btn">发布</button>
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
	import {
		onLoad,
		onUnload,
		onShow
		// 移除 onReachBottom
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
	import dayjs from 'dayjs'
	import relativeTime from 'dayjs/plugin/relativeTime'
	import 'dayjs/locale/zh'
	dayjs.locale('zh')
	dayjs.extend(relativeTime)
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'

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
		uni.authorize({
			scope: 'scope.record',
			success() {
				recorderManager.start();
				recording.value = true
			},
			fail() {
				console.log("录音没权限");
				uni.showModal({
					title: "提示",
					content: `录音开启失败，请前往设置页面打开麦克风权限`,
					confirmColor: "#10B981",
					success: function(res) {
						if (res.confirm) {
							uni.openSetting({
								success(res) {}
							});
						} else if (res.cancel) {
							toast.warning("你取消了操作")
						}
					}
				});
			}
		})
	}
	const recorded = ref(false)
	const endRecord = () => {
		console.log('录音结束');
		recorderManager.stop();
		recording.value = false
	}

	// 加载用户发音
	const id = ref(null)
	const word = ref({
		id: null,
		words: [],
		kana: null,
		description: null
	})

	const total = ref(0)
	const page = ref(1)
	const size = ref(10)
	const List = ref([])
	const loading = ref(false)
	const loadStatus = ref('more') // more, loading, noMore

	const getList = async () => {
		loading.value = true
		loadStatus.value = 'loading'
		try {
			const res = await $http.word.getFollowRead({
				id: id.value,
				page: page.value,
				pageSize: size.value
			})
			total.value = res.total
			const newData = res.data.map(item => ({
				...item,
				has: false,
				play: false,
			}))
			List.value = List.value.concat(newData);

			if (List.value.length >= total.value) {
				loadStatus.value = 'noMore'
			} else {
				loadStatus.value = 'more'
			}
		} catch (e) {
			loadStatus.value = 'more'
			console.error(e)
		} finally {
			loading.value = false
		}
	}

	const loadMore = () => {
		if (loadStatus.value === 'loading' || loadStatus.value === 'noMore') return
		page.value++
		getList()
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
			header: {
				"Authorization": userStore().token
			},
			formData: {
				"file_name": `files/read/${new Date().getTime()}_${word.value.id}_${userStore().userInfo.id}.aac`
			},
			success: async (fileRes) => {
				const res = await $http.word.followRead({
					voice: JSON.parse(fileRes.data).url,
					word_id: Number(id.value),
				})
				toast.close()
				toast.success(`提交成功请等待审核`)
				recorded.value = false
			}
		});
	}

	onLoad((op) => {
		id.value = op.id
		if (op.word) {
			word.value = JSON.parse(op.word)
		}
		getList()
	})
	onUnload(() => {
		endRecord()
	})
	onShow(() => {
		endRecord()
	})

	const like = async (index, id) => {
		if (!userStore().loginStatus) {
			goPage("/pages/login/login?toast=请登录之后使用")
			return
		}
		if (List.value[index].has) {
			await $http.common.like({
					id,
					type: "read",
					like: false
				})
				--List.value[index].like
		} else {
			await $http.common.like({
					id,
					type: "read",
					like: true
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
		recorderManager.onInterruptionBegin(() => {
			endRecord()
		})
	})
</script>

<style>
	page {
		background-color: white;
		height: 100%;
		overflow: hidden;
	}
</style>
<style lang="scss" scoped>
	.page-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
	}

	.fixed-header {
		flex-shrink: 0;
		background-color: #fff;
		position: relative;
		z-index: 10;
		box-shadow: 0 1px 6px rgba(0, 0, 0, 0.02);
	}

	.scroll-list {
		flex: 1;
		height: 0;
		background-color: #fff;
	}

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
		/* 移除原有 sticky，改为 Flex 布局控制 */
		/* position: sticky; top: 0; z-index: 9; */
	}

	/* 单词展示区 */
	.word-display {
		position: relative;
		padding: 24px 16px;
		margin: 16px 16px 0 16px;
		border-radius: 8px;
		text-align: center;
		background-color: #f8f9fa;

		button {
			position: absolute;
			top: 16px;
			right: 16px;
		}
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
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		flex-direction: column;
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
		padding: 16px;
		/* 移除 flex: 1，由 scroll-view 接管 */
		/* flex: 1; overflow-y: auto; */
		background-color: white;
		min-height: 100%;
		/* 确保内容撑开 */
	}

	.list-title-bar {
		background-color: white;
		padding: 0 16px;
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