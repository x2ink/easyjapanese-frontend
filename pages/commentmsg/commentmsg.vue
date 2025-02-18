<template>
	<view>
		<NavBar title="评论" style="background-color: #f3f3f5;"></NavBar>
		<!-- 评论 -->
		<view class="commentlist">
			<view class="commentitem" @click="openDetail(item,index)" :key="item.id" v-for="(item,index) in List">
				<view class="left">
					<wd-badge is-dot :hidden="item.status!=0">
						<uv-avatar size="40" :src="item.from_user.avatar"></uv-avatar>
					</wd-badge>
				</view>
				<view class="right">
					<view class="nickname">{{item.from_user.nickname}}</view>
					<view class="magtype">
						<text>回复了你的{{item.comment.parent_id==null?'动态':'评论'}}</text>
						<text>{{dayjs().to(dayjs(item.created_at))}}</text>
					</view>
					<view class="content">
						<wd-text :text="item.comment.content" color="#000" size="14px" :lines="1"></wd-text>
					</view>
					<view class="tocontent">
						<view class="hr"></view>
						<wd-text :text="item.content" color="#999" size="12px" :lines="1"></wd-text>
					</view>
					<view class="btns">
						<view @click.stop="addLike(item.comment.id,index)" class="btn _GCENTER">
							<wd-icon v-if="!item.comment.like" name="heart" size="18px" color="#000"></wd-icon>
							<wd-icon v-else name="heart-filled" color="#EF4651" size="18px"></wd-icon>
							<text>点赞</text>
						</view>
						<view @click.stop="replyOwner(item,index)" class="btn _GCENTER">
							<wd-icon name="chat1" size="18px" color="#000"></wd-icon>
							<text>回复</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 回复消息 -->
		<wd-popup v-model="commentShow" position="bottom" :safe-area-inset-bottom="true"
			custom-style="border-radius:8px 8px 0 0;padding:15px">
			<view>
				<p class="commenttitle">回复<text>@{{toUser.nickname}}</text></p>
				<wd-textarea :focus="commentShow" v-model="formData.content" clearable show-word-limit
					placeholder="请发表你的想法" :maxlength="800" />
				<wd-upload accept="image" :limit="1" custom-class="updload" :max-size="1024*1024*10" show-limit-num
					image-mode="aspectFill" multiple :header="header" :action="`${http.baseUrl}upload`"
					@change="handleChange"></wd-upload>
				<view style="padding:0 10px;">
					<wd-button @click="submit()" style="width: 100%;margin-top: 15px;">发布</wd-button>
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
		onShow
	} from '@dcloudio/uni-app'
	import dayjs from 'dayjs'
	import relativeTime from 'dayjs/plugin/relativeTime'
	import 'dayjs/locale/zh'
	dayjs.locale('zh')
	dayjs.extend(relativeTime)
	import NavBar from '@/components/navbar.vue'
	import $http from "@/api/index.js"
	import {
		userStore
	} from "@/stores/index.js"
	import http from '@/utils/request.js'
	const header = ref({
		"Authorization": userStore().token
	})
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	import {
		onPageScroll,
		onReachBottom
	} from "@dcloudio/uni-app"
	const commentShow = ref(false)
	const submit = async () => {
		if (formData.value.content.length === 0) {
			toast.warning(`内容不可为空`)
			return
		}
		const res = await $http.comment.add(formData.value)
		toast.success(`回复成功`)
		commentShow.value = false
		formData.value.content = ""
	}
	const formData = ref({
		content: "",
		to: null,
		target: "",
		target_id: null,
		parent_id: null,
		images: []
	})
	const toUser = ref({
		nickname: "",
		avatar: "",
		id: null
	})
	const goPage = (path, params) => {
		if (params) {
			uni.navigateTo({
				url: `/pages/${path}/${path}${params}`
			})
		} else {
			uni.navigateTo({
				url: `/pages/${path}/${path}`
			})
		}
	}
	const handleChange = (files) => {
		formData.value.images = []
		files.fileList.map((item) => {
			if (item.status == "success") {
				formData.value.images.push(JSON.parse(item.response).data)
			}
		})
	}
	const replyOwner = (item, index) => {
		toUser.value = item.from_user
		commentShow.value = true
		formData.value.parent_id = item.comment.id
		formData.value.to = item.from_id
		formData.value.target = item.target
		formData.value.target_id = item.target_id
		List.value[index].status = 1
		$http.common.setMessageRead(item.id)
	}
	const addLike = async (id, index) => {
		const res = await $http.comment.like(id)
		if (res.msg == "like") {
			List.value[index].comment.like = true
		} else {
			List.value[index].comment.like = false
		}
	}
	const page = ref(1)
	const size = ref(10)
	const total = ref(0)
	const List = ref([])
	const getList = async () => {
		const res = await $http.common.getMessageList(page.value, size.value)
		total.value = res.total
		List.value = List.value.concat(res.data)
	}
	const openDetail = (item, index) => {
		$http.common.setMessageRead(item.id)
		List.value[index].status = 1
		let parent_id = 0,
			child_id = 0;
		if (item.parent_id) {
			parent_id = item.comment.parent_id
			child_id = item.comment.id
		} else {
			parent_id = item.comment.id
		}
		if (item.target == "trend") {
			goPage("trenddetail", `?id=${item.target_id}&parent_id=${parent_id}&child_id=${child_id}`)
		}
	}
	onMounted(() => {
		getList()
	})
	onReachBottom(() => {
		if (total.value > List.value.length) {
			++page.value
			getList()
		}
	})
</script>

<style scoped lang="scss">
	:deep(.updload) {
		margin: 0px 10px 0 10px;
	}

	:deep(.wd-upload__preview) {
		margin: 0;
	}

	:deep(.wd-upload) {
		display: grid;
		gap: 10px;
		grid-template-columns: repeat(4, 1fr);
	}

	.commentlist {
		padding: 0 10px 10px 10px;
		display: flex;
		flex-direction: column;
		gap: 15px;

		.commentitem {
			padding: 15px;
			background-color: white;
			border-radius: 8px;
			display: flex;
			gap: 10px;

			.right {
				.nickname {
					font-size: 14px;
				}

				.magtype {
					font-size: 12px;
					margin: 5px 0;
					display: flex;
					gap: 5px;
					color: #999;
				}

				.btns {
					padding-top: 5px;
					display: flex;
					gap: 10px;
					align-items: center;

					>view {
						border-radius: 20px;
						background-color: #F4F4F4;
						padding: 5px 10px;
						gap: 3px;

						text {
							font-size: 12px;
						}
					}
				}

				.tocontent {
					display: flex;
					gap: 5px;
					align-items: center;
					margin: 5px;

					text {
						font-size: 12px;
						color: #999;
					}

					.hr {
						width: 4px;
						height: 16px;
						border-radius: 4px;
						background-color: #E6E6E6;
					}
				}

				.content {
					font-size: 14px;
				}
			}
		}
	}
</style>