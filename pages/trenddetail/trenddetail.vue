<template>
	<view>
		<NavBar title="动态详情" style="background-color: #F3F3F5;">
			<template #right>
				<wd-icon @click="moreShow=true" name="ellipsis" size="30px"></wd-icon>
			</template>
		</NavBar>
		<view class="item">
			<view class="head">
				<uv-avatar size="40" :src="info.user.avatar"></uv-avatar>
				<view class="userinfo">
					<p>{{info.user.nickname}}</p>
					<wd-tag v-if="info.user.role=='嘉宾'" custom-class="space">嘉宾</wd-tag>
					<wd-tag v-else-if="info.user.role=='普通'" custom-class="space" type="success">普通</wd-tag>
					<wd-tag v-else-if="info.user.role=='官方'" custom-class="space" type="primary">官方</wd-tag>
					<wd-tag v-else-if="info.user.role=='会员'" custom-class="space" type="danger">会员</wd-tag>
				</view>
			</view>
			<view class="body">
				<p class="content" v-html="info.content.replace(/\n/g,'<br>')"></p>
				<view class="images">
					<view class="image" v-for="image in info.images" :key="image">
						<uv-image mode="aspectFill" radius="4px" width="100%" height="100%" :src="image"></uv-image>
					</view>
				</view>
			</view>
			<view class="footer">
				<p class="left">{{dayjs().to(dayjs(info.created_at))}}</p>
				<view class="right">
					<view>
						<wd-icon name="heart" color="#999" size="18px"></wd-icon>
						<text>{{info.like}}</text>
					</view>
					<view>
						<wd-icon name="browse" color="#999" size="18px"></wd-icon>
						<text>{{info.browse}}</text>
					</view>
					<view>
						<wd-icon name="chat1" color="#999" size="18px"></wd-icon>
						<text>{{count}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 评论区 -->
		<!-- 	<view class="userinput">
			<uv-avatar size="40" :src="userInfo.avatar" font-size="14"></uv-avatar>
			<view class="input" @click="replyOwner()">
				<text>说点什么...</text>
				<wd-icon name="edit-outline" color="#999" />
			</view>
		</view> -->
		<view class="commentwrap">
			<view class="commenttop">
				<text>评论留言</text>
				<wd-segmented @click="refresh()" :options="optionsList" v-model:value="optionsCurrent"></wd-segmented>
			</view>
			<view class="commentarea">
				<view class="comment" v-for="(item,index) in List" :key="item.id">
					<uv-avatar size="40" :src="item.from_user.avatar"></uv-avatar>
					<view class="main">
						<view class="head">
							<view class="userinfo">
								{{item.from_user.nickname}}
								<text>
									&nbsp;·&nbsp;{{dayjs().to(dayjs(item.created_at))}}
								</text>
							</view>
							<view class="thumb" @click="likeComment(index,null,item.id)">
								<text>{{item.like_count}}</text>
								<wd-icon v-if="!item.has_like" name="heart" color="#999" size="14px"></wd-icon>
								<wd-icon v-else name="heart-filled" color="#EF4651" size="14px"></wd-icon>
							</view>
						</view>
						<view @click="replyUser(item.id,item.from_user)">
							<view class="body">
								<p v-html="item.content.replace(/\n/g,'<br>')"></p>
							</view>
							<image v-for="image in item.images" :key="image" class="image" :src="image"
								mode="aspectFill">
							</image>
						</view>
						<view class="childcommont" v-for="(child,index1) in item.children" :key="child.id">
							<uv-avatar size="30" :src="child.from_user.avatar" font-size="14"></uv-avatar>
							<view class="childmain">
								<view class="head">
									<view class="userinfo">
										{{child.from_user.nickname}}
										<text>&nbsp;·&nbsp;{{dayjs().to(dayjs(child.created_at))}}</text>
									</view>
									<view class="thumb" @click="likeComment(index,index1,child.id)">
										<text>{{child.like_count}}</text>
										<wd-icon v-if="!child.has_like" name="heart" color="#999" size="14px"></wd-icon>
										<wd-icon v-else name="heart-filled" color="#EF4651" size="14px"></wd-icon>
									</view>
								</view>
								<view @click="replyUser(item.id,child.from_user)">
									<view class="childcontent">
										<text v-if="child.to_user.id!=child.from_user.id">回复</text>
										<text v-if="child.to_user.id!=child.from_user.id"
											class="text">{{child.to_user.nickname}}</text><text
											v-if="child.to_user.id!=child.from_user.id">：</text><text
											v-html="child.content.replace(/\n/g,'<br>')"></text>
									</view>
									<image v-for="image in child.images" :key="image" class="image" :src="image"
										mode="aspectFill">
									</image>
								</view>
							</view>
						</view>
						<wd-divider @click="getChildComment(index,item.id)"
							v-if="item.child_count>10&&item.child_count>item.children.length"
							style="margin: 15px 0 0 0 ;" color="#999" content-position="right">展示更多回复</wd-divider>
					</view>
				</view>
				<wd-loadmore v-if="List.length>0&&loadMoreShow" custom-class="loadmore" :state="loadMoreText" />
				<view v-if="noResult">
					<wd-status-tip image="comment" tip="没有评论" />
				</view>
			</view>
		</view>
		<view style="height: 60px;"></view>
		<!-- 评论 -->
		<view class="fixed">
			<view class="userinput">
				<uv-avatar size="40" :src="userInfo.avatar" font-size="14"></uv-avatar>
				<view class="input" style="background-color: #F3F3F5;" @click="replyOwner()">
					<text>说点什么...</text>
					<wd-icon name="edit-outline" color="#999" />
				</view>
				<view class="count">
					<view @click="addLike()">
						<wd-icon v-if="!hasLike" name="heart" color="#999" size="22px"></wd-icon>
						<wd-icon v-else name="heart-filled" color="#EF4651" size="22px"></wd-icon>
						<text>{{info.like}}</text>
					</view>
					<view>
						<wd-icon name="chat1" color="#999" size="22px"></wd-icon>
						<text>{{count}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 弹出评论 -->
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
		<wd-action-sheet :z-index="999" :safe-area-inset-bottom="false" cancel-text="取消" v-model="moreShow"
			:actions="actions" @close="moreShow=false" @select="select" />
		<wd-toast />
		<wd-message-box></wd-message-box>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'
	import {
		userStore
	} from "@/stores/index.js"
	import dayjs from 'dayjs'
	import relativeTime from 'dayjs/plugin/relativeTime'
	import 'dayjs/locale/zh'
	dayjs.locale('zh')
	dayjs.extend(relativeTime)
	import NavBar from '@/components/navbar.vue'
	import http from '@/utils/request.js'
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	import {
		useMessage
	} from '@/uni_modules/wot-design-uni'
	const message = useMessage()
	const moreShow = ref(false)
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
	const select = async (e) => {
		if (e.item.name == "删除动态") {
			moreShow.value = true
			message.alert({
				msg: '你正在执行删除操作，此操作不可逆',
				title: '温馨提示'
			}).then(async () => {
				const res = await $http.trend.deleteTrend(info.value.id)
				uni.navigateBack({
					delta: 1
				})
			})
		} else {
			goPage('feedback', "?type=动态举报&trendid=" + info.value.id)
		}
	}
	const actions = computed(() => {
		if (info.value.my) {
			return [{
					name: '删除动态'
				},
				{
					name: '内容举报'
				}
			]
		} else {
			return [{
				name: '内容举报'
			}]
		}
	})
	const loadMoreText = computed(() => {
		if (count.value == List.value.length) {
			return "finished"
		} else {
			return "loading"
		}
	})
	const optionsList = ref(['按时间', '按赞数'])
	const optionsCurrent = ref('按时')
	const sort = computed(() => {
		if (optionsCurrent.value == "按赞数") {
			return "like"
		} else {
			return "time"
		}
	})
	const getUserInfoSimple = async () => {
		const res = await $http.user.getUserInfoSimple()
		userInfo.value = res.data
		console.log(userInfo.value);
	}
	const userInfo = ref({
		address: "",
		avatar: '',
		nickname: '',
		role: "",
		email: ''
	})
	const loadMoreShow = ref(true)
	import {
		onShow,
		onLoad,
		onReachBottom
	} from '@dcloudio/uni-app'
	import $http from "@/api/index.js"
	const commentShow = ref(false)
	const fileList = ref([])
	const header = ref({
		"Authorization": userStore().token
	})
	const formData = ref({
		content: "",
		to: null,
		target: "trend",
		target_id: null,
		parent_id: null,
		images: []
	})
	const likeComment = async (parent, child, id) => {
		const res = await $http.comment.like(id)
		if (res.msg === "like") {
			if (child == null) {
				++List.value[parent].like_count
				List.value[parent].has_like = true
			} else {
				++List.value[parent].children[child].like_count
				List.value[parent].children[child].has_like = true
			}
		} else {
			if (child == null) {
				List.value[parent].has_like = false
					--List.value[parent].like_count
			} else {
				--List.value[parent].children[child].like_count
				List.value[parent].children[child].has_like = false
			}
		}
	}
	const replyOwner = () => {
		toUser.value = info.value.user
		commentShow.value = true
		formData.value.parent_id = null
		formData.value.to = info.value.user.id
	}
	const toUser = ref({
		nickname: "",
		avatar: "",
		id: null
	})
	const replyUser = (parent_id, user) => {
		toUser.value = user
		commentShow.value = true
		formData.value.parent_id = parent_id
		formData.value.to = user.id
	}
	const commentParams = ref({
		target: "trend",
		target_id: null,
		page: 1,
		size: 10
	})
	const refresh = () => {
		oneComment.value.parent_id = 0
		commentParams.value = {
			target: "trend",
			target_id: id.value,
			page: 1,
			size: 10 * commentParams.value.page
		}
		getList(true)
	}
	const childParams = ref({
		page: 1,
		size: 10
	})
	const hideId = ref("")
	const getChildComment = async (index, parent_id, page, size) => {
		++childParams.value.page
		const res = await $http.comment.getChildComment(parent_id, childParams.value.page, childParams.value.size,
			sort.value)
		List.value[index].children = List.value[index].children.concat(res.data)
	}
	const List = ref([])
	const count = ref(0)
	const noResult = ref(false)
	const getList = async (refresh) => {
		const res = await $http.comment.getList(commentParams.value.target, commentParams.value.target_id,
			commentParams.value.page, commentParams.value.size, sort.value, oneComment.value.parent_id)
		if (refresh) {
			List.value = res.data
		} else {
			List.value = List.value.concat(res.data)
		}
		count.value = res.total
		if (oneComment.value.parent_id != 0) {
			getCommentOne()
		}
		if (res.total === List.value.length) {
			loadMoreShow.value = false
		}
		if (res.total === 0) {
			noResult.value = true
		} else {
			noResult.value = false
		}
	}
	const submit = async () => {
		if (formData.value.content.length === 0) {
			toast.warning(`内容不可为空`)
			return
		}
		const res = await $http.comment.add(formData.value)
		toast.success(`回复成功`)
		commentShow.value = false
		formData.value.content = ""
		refresh()
	}
	const id = ref(null)
	const hasLike = ref(false)
	const getHasLike = async (id) => {
		const res = await $http.trend.getHasLike(id)
		hasLike.value = res.data
	}
	const addLike = async () => {
		const res = await $http.trend.addLike(id.value)
		if (res.msg == "like") {
			++info.value.like
			hasLike.value = true
		} else {
			--info.value.like
			hasLike.value = false
		}
	}
	const info = ref({
		content: "",
		browse: 0,
		like: 0,
		section_id: 0,
		images: [],
		created_at: null,
		user: {
			id: 0,
			avatar: "",
			nickname: "",
			role: ""
		},
		id: 0
	})
	const getInfo = async (id) => {
		const res = await $http.trend.getTrendInfo(id)
		info.value = res.data
	}
	const getCommentOne = async () => {
		const res = await $http.comment.getOne(oneComment.value)
		List.value.unshift(res.data)
	}
	const oneComment = ref({
		parent_id: 0,
		child_id: 0
	})
	onLoad((e) => {
		id.value = Number(e.id)
		formData.value.target_id = Number(e.id)
		commentParams.value.target_id = Number(e.id)
		if (e.parent_id) {
			oneComment.value.parent_id = Number(e.parent_id)
			oneComment.value.child_id = Number(e.child_id)
		}
		getInfo(e.id)
		getHasLike(e.id)
		getList(false)
		getUserInfoSimple()
	})
	const handleChange = (files) => {
		formData.value.images = []
		files.fileList.map((item) => {
			if (item.status == "success") {
				formData.value.images.push(JSON.parse(item.response).data)
			}
		})
	}
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

	.commenttitle {
		display: flex;
		align-items: center;
		gap: 3px;
		font-size: $uni-font-size-lg;

		text {
			font-size: $uni-font-size-base;
		}
	}

	.fixed {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: white;

		.userinput {
			padding: 10px;
		}

		.count {
			display: flex;
			align-items: center;

			gap: 10px;

			>view {
				display: flex;
				align-items: center;

				text {
					color: #999;
					margin-left: 5px;
				}
			}
		}
	}

	.userinput {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 15px 15px 0 15px;

		.input {
			height: 35px;
			padding: 10px;
			box-sizing: border-box;
			border-radius: 35px;
			display: flex;
			align-items: center;
			background-color: #fff;
			flex: 1;
			justify-content: space-between;

			text {
				font-size: $uni-font-size-base;
				color: $uni-text-color-grey;
			}
		}
	}

	:deep(.wd-segmented) {
		width: 100px;
	}

	:deep(.wd-segmented__item) {
		min-height: inherit;
		line-height: inherit;
		font-size: 8px;
		padding: 0;
	}

	.commentwrap {
		margin: 10px;
		border-radius: 8px;
		background-color: white;


		.commenttop {
			padding: 10px 10px 0 10px;
			display: flex;
			align-items: center;
			justify-content: space-between;

			text {
				font-size: 14px;
				color: #999;
			}
		}

		.commentarea {
			padding: 15px;
			display: flex;
			flex-direction: column;
			gap: 15px;

			.comment {
				display: flex;
				gap: 15px;

				.main {
					flex: 1;

					.image {
						width: 80px;
						height: 80px;
						border-radius: 4px;
						margin-top: 5px;
					}

					.childcommont {
						display: flex;
						margin-top: 10px;
						gap: 10px;

						.childmain {
							flex: 1;
							font-size: $uni-font-size-base;



							.childcontent {
								padding: 5px 5px 5px 0;

								.text {
									margin-left: 5px;
									color: $uni-text-color-grey;
								}
							}
						}
					}

					.body {
						margin-top: 5px;
						font-size: $uni-font-size-base;
					}

					.head {
						display: flex;
						align-items: center;
						justify-content: space-between;

						.thumb {
							gap: 3px;
							color: $uni-text-color-grey;
							font-size: $uni-font-size-sm;
							display: flex;
							align-items: center;
						}

						.userinfo {
							color: $uni-text-color-grey;
							font-size: $uni-font-size-base;
							display: flex;
							align-items: center;

							text {
								font-size: 12px;
							}
						}
					}
				}
			}
		}
	}

	.item {
		background-color: white;
		padding: 10px 15px;
		margin: 0 10px;
		border-radius: 8px;

		.footer {
			margin-left: 50px;
			justify-content: space-between;
			display: flex;
			align-items: center;

			.right {
				display: flex;
				align-items: center;
				gap: 10px;

				text {
					font-size: $uni-font-size-sm;
					color: $uni-text-color-grey;
				}

				>view {
					display: flex;
					align-items: center;
					gap: 5px;
				}
			}

			.left {
				font-size: $uni-font-size-sm;
				color: $uni-text-color-grey;
			}
		}

		.body {
			margin-left: 50px;

			.images {
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				gap: 10px;
				margin-bottom: 15px;

				.image {
					object-fit: cover;
					width: 100%;
					aspect-ratio: 1;
					border-radius: $uni-border-radius-base;
				}
			}

			.content {
				margin: 5px 0;
				font-size: $uni-font-size-base;
			}
		}

		.head {
			display: flex;
			align-items: center;
			gap: 10px;
			position: relative;

			.btn {
				position: absolute;
				right: 0;
			}

			.userinfo {
				p {
					&:nth-of-type(1) {
						font-size: $uni-font-size-lg;
					}

					&:nth-of-type(2) {
						font-size: $uni-font-size-sm;
						color: $uni-text-color-grey;
					}
				}
			}
		}
	}
</style>