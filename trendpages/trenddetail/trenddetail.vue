<template>
	<view>
		<Navbar title="动态详情">
		</Navbar>
		<view class="item">
			<view class="userinfo">
				<view>
					<uv-avatar size="40" :src="info.user.avatar"></uv-avatar>
					<text>{{info.user.nickname}}</text>
					<wd-tag v-if="info.user.role=='嘉宾'" custom-class="space">嘉宾</wd-tag>
					<wd-tag v-else-if="info.user.role=='普通'" custom-class="space" type="success">普通</wd-tag>
					<wd-tag v-else-if="info.user.role=='官方'" custom-class="space" type="primary">官方</wd-tag>
					<wd-tag v-else-if="info.user.role=='会员'" custom-class="space" type="danger">会员</wd-tag>
				</view>
				<wd-icon name="more" @click="moreShow=true" size="20px"></wd-icon>
			</view>
			<view class="body">
				<rich-text :nodes="info.content.replace(/\n/g, '<br>')" user-select></rich-text>
				<view class="images">
					<view @click="previewImage(image,info.images)" class="image" v-for="image in info.images"
						:key="image">
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
								<text class="top _GCENTER" v-if="item.top">置顶</text>
								{{item.from_user.nickname}}
								<text class="author" v-if="isAuthor(item.from_user.id)">作者</text>
								<text>
									{{dayjs().to(dayjs(item.created_at))}}
								</text>
							</view>
							<view class="thumb" @click="likeComment(index,null,item.id)">
								<text>{{item.like_count}}</text>
								<wd-icon v-if="!item.has_like" name="heart" color="#999" size="14px"></wd-icon>
								<wd-icon v-else name="heart-filled" color="#EF4651" size="14px"></wd-icon>
							</view>
						</view>
						<view @click="replyUser(item.id,item.from_user,item.id,true,true,item.content,item.top)">
							<view class="body">
								<view v-html="item.content.replace(/\n/g,'<br>')"></view>
							</view>
							<image @click="previewImage(image,item.images)" v-for="image in item.images" :key="image"
								class="image" :src="image" mode="aspectFill">
							</image>
						</view>
						<view class="childcommont" v-for="(child,index1) in item.children" :key="child.id">
							<uv-avatar size="30" :src="child.from_user.avatar" font-size="14"></uv-avatar>
							<view class="childmain">
								<view class="head">
									<view class="userinfo">
										{{child.from_user.nickname}}
										<text class="author" v-if="isAuthor(child.from_user.id)">作者</text>
										<text>{{dayjs().to(dayjs(child.created_at))}}</text>
									</view>
									<view class="thumb" @click="likeComment(index,index1,child.id)">
										<text>{{child.like_count}}</text>
										<wd-icon v-if="!child.has_like" name="heart" color="#999" size="14px"></wd-icon>
										<wd-icon v-else name="heart-filled" color="#EF4651" size="14px"></wd-icon>
									</view>
								</view>
								<view
									@click="replyUser(item.id,child.from_user,child.id,true,false,child.content,false)">
									<view class="childcontent">
										<text v-if="child.to_comment!=item.id">回复</text>
										<text v-if="child.to_comment!=item.id"
											class="text">{{child.to_user.nickname}}</text><text
											v-if="child.to_comment!=item.id">：</text>
										<view v-html="child.content.replace(/\n/g,'<br>')"></view>
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
					<wd-status-tip :image-size="{
				        height: 60,
				        width: 60
				}" image="http://jp.x2.ink/images/blank.png" tip="还没有评论呢" />
				</view>
			</view>
		</view>
		<view style="height: calc(60px + env(safe-area-inset-bottom));"></view>
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
						<wd-icon v-if="!info.has" name="heart" color="#999" size="22px"></wd-icon>
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
		<wd-popup v-model="commentShow" :z-index="100" position="bottom" :safe-area-inset-bottom="true"
			custom-style="border-radius:8px 8px 0 0;padding:20px">
			<view style="padding-bottom: env(safe-area-inset-bottom);">
				<p class="commenttitle">回复<text>@{{toUser.nickname}}</text></p>
				<wd-textarea :focus="commentShow" v-model="formData.content" clearable show-word-limit
					placeholder="请发表你的想法" :maxlength="400" />
				<wd-upload accept="image" :limit="1" custom-class="updload" :max-size="1024*1024*10" show-limit-num
					image-mode="aspectFill" multiple :header="header" :action="`${http.baseUrl}upload`"
					@change="handleChange"></wd-upload>
				<view style="padding:0 10px;margin-top: 15px;">
					<wd-button @click="submit()" block>发布</wd-button>
				</view>
			</view>
		</wd-popup>
		<wd-action-sheet :z-index="100" :safe-area-inset-bottom="false" cancel-text="取消" v-model="moreShow"
			:actions="actions" @close="moreShow=false" @select="select" />
		<wd-toast />
		<!-- 操作自己的评论 -->
		<wd-action-sheet :z-index="100" :safe-area-inset-bottom="false" cancel-text="取消" v-model="commentEdit"
			:actions="commentActions" @close="commentEdit=false" @select="selectEdit" />
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
	import Navbar from '@/components/navbar/navbar.vue';
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
	const isAuthor = (userId) => {
		return userId == info.value.user.id
	}
	import {
		goPage,
		copy
	} from "@/utils/common.js"
	const previewImage = (img, imgs) => {
		wx.previewImage({
			current: img,
			urls: imgs
		})
	}
	const select = async (e) => {
		if (e.item.name == "删除动态") {
			message.alert({
				msg: '你真的要删除这条动态？',
				title: '温馨提示'
			}).then(async () => {
				const res = await $http.trend.deleteTrend(info.value.id)
				uni.$emit("delTrend", true);
				uni.navigateBack({
					delta: 1
				})
			})
		} else {
			goPage('/otherpages/feedback/feedback', {
				type: '动态举报',
				trendid: info.value.id
			})
		}
	}
	const commentTemp = ref({
		commentId: null,
		parentId: null,
		user: {},
		top: false,
		isTop: false
	})
	const selectEdit = async (e) => {
		console.log(e.item.name.indexOf("置顶"));
		if (e.item.name == "删除") {
			message.alert({
				msg: '你真的要删除这条评论？',
				title: '温馨提示'
			}).then(async () => {
				const res = await $http.trend.deleteComment(commentTemp.value.commentId)
				refresh()
			})
		} else if (e.item.name == "回复") {
			replyUser(commentTemp.value.parentId, commentTemp.value.user, commentTemp.value.parentId, false)
		} else if (e.item.name == "复制") {
			copy(commentTemp.value.content)
		} else if (e.item.name.indexOf("置顶") >= 0) {
			const res = await $http.trend.topComment(commentTemp.value.commentId)
			refresh()
		}
	}
	const commentEdit = ref(false)
	const commentActions = computed(() => {
		let temp = [{
			name: '回复'
		}, {
			name: '复制'
		}, {
			name: '删除'
		}]
		if (commentTemp.value.top) {
			return [{
				name: commentTemp.value.isTop ? '取消置顶' : '置顶'
			}, ...temp]
		} else {
			return temp
		}
	})
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
		trend_id: null,
		parent_id: null,
		images: []
	})
	const likeComment = async (parent, child, id) => {
		const res = await $http.trend.addCommentLike(id)
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
	const replyUser = (parentId, user, commentId, open, top, content, isTop) => {
		commentTemp.value = {
			parentId,
			user,
			commentId,
			top,
			content,
			isTop
		}
		if (userInfo.value.id == user.id && open) {
			commentEdit.value = true
			return
		}
		toUser.value = user
		commentShow.value = true
		formData.value.parent_id = parentId
		formData.value.to = user.id
	}
	const commentParams = ref({
		target: "trend",
		trend_id: null,
		page: 1,
		size: 10
	})
	onReachBottom(() => {
		if (count.value > List.value.length) {
			++commentParams.value.page
			getList(false)
		}
	})
	const refresh = () => {
		oneComment.value.parent_id = 0
		commentParams.value = {
			trend_id: id.value,
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
		const res = await $http.trend.getChildComment(parent_id, childParams.value.page, childParams.value.size,
			sort.value)
		List.value[index].children = List.value[index].children.concat(res.data)
	}
	const List = ref([])
	const count = ref(0)
	const noResult = ref(false)
	const getList = async (refresh) => {
		const res = await $http.trend.getCommentList(commentParams.value.trend_id,
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
		const res = await $http.trend.addComment(formData.value)
		toast.success(`回复成功`)
		commentShow.value = false
		formData.value.content = ""
		formData.value.images = []
		refresh()
	}
	const id = ref(null)
	const addLike = async () => {
		const res = await $http.trend.addTrendLike(id.value)
		if (res.msg == "like") {
			++info.value.like
			info.value.has = true
		} else {
			--info.value.like
			info.value.has = false
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
		formData.value.trend_id = Number(e.id)
		commentParams.value.trend_id = Number(e.id)
		if (e.parent_id) {
			oneComment.value.parent_id = Number(e.parent_id)
			oneComment.value.child_id = Number(e.child_id)
		}
		getInfo(e.id)
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
	.author {
		background-color: #FFEAEF;
		color: #D21C45;
		font-size: 10px !important;
		padding: 0 7px;
		border-radius: 20px;
		margin: 0 5px;
		line-height: 20px;
	}

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
		font-weight: bold;
		display: flex;
		align-items: center;
		gap: 3px;
		font-size: $uni-font-size-lg;

		text {
			font-size: $uni-font-size-base;
		}
	}

	.fixed {
		z-index: 9;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: white;
		padding-bottom: env(safe-area-inset-bottom);

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
		width: 100px !important;
	}

	:deep(.wd-segmented__item) {
		min-height: inherit !important;
		line-height: inherit !important;
		font-size: 8px !important;
		padding: 0 !important;
	}

	.commentwrap {
		margin: 15px;
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
				position: relative;
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
								display: flex;
								flex-wrap: wrap;
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

							.top {
								color: white;
								font-size: 10px;
								padding: 0 5px;
								height: 18px;
								border-radius: 4px;
								background-color: #EF4651;
								margin-right: 5px;
							}

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
		padding: 15px;
		margin: 0 15px;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		gap: 10px;

		.footer {
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

			.images {
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				gap: 10px;
				margin-bottom: 15px;
				margin-top: 10px;

				.image {
					object-fit: cover;
					width: 100%;
					aspect-ratio: 1;
					border-radius: $uni-border-radius-base;
				}
			}

			.content {
				margin: 5px 0 10px 0;
				font-size: $uni-font-size-base;
			}
		}

		.userinfo {
			display: flex;
			align-items: center;
			justify-content: space-between;

			>view {
				display: flex;
				align-items: center;
				gap: 5px;

				text {
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