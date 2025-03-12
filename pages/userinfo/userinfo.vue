<template>
	<view>
		<NavBar title=""></NavBar>
		<view style="margin:15px;padding: 10px;background-color: white;border-radius: 10px;">
			<!-- 更换头像 -->
			<view class="_GCENTER" style="margin-top: 10px;">
				<view class="profile" @click="selectImg">
					<view v-if="!userInfo.avatar!=''" class="img _GCENTER">
						<wd-icon name="fill-camera" size="25" custom-class="img-icon"></wd-icon>
					</view>
					<wd-img v-if="userInfo.avatar!=''" round width="80px" height="80px" :src="userInfo.avatar"
						mode="aspectFit" custom-class="profile-img" />
				</view>
			</view>
			<!-- 分割线 -->
			<view style="height: 1px;background-color: #f6f6f6;margin-top: 20px;" />
			<!-- 个人信息列表 -->
			<view class="userinfoul">
				<view class="userinfoitem" @click="setNickname()">
					<text style="font-size: 14px;">昵称</text>
					<view>
						<text>{{userInfo.nickname}}</text>
						<wd-icon color="#999" name="arrow-right" size="20px"></wd-icon>
					</view>
				</view>
				<view class="hr">
				</view>
				<view class="userinfoitem">
					<text style="font-size: 14px;">邮箱</text>
					<view>
						<text>{{userInfo.email}}</text>
					</view>
				</view>
				<view class="hr">
				</view>
				<view class="userinfoitem">
					<text style="font-size: 14px;">注册时间</text>
					<view>
						<text>{{dayjs(userInfo.created_at).format('YYYY-MM-DD')}}</text>
					</view>
				</view>
				<view class="hr">
				</view>
			</view>
		</view>
		<view style="padding: 15px;">
			<wd-button @click="logout" style="width: 100%;" type="error">退出账号</wd-button>
		</view>
		<wd-message-box selector="wd-message-box-slot">
			<wd-input type="text" v-model="nickname" placeholder="请输入用户名" />
		</wd-message-box>
		<wd-message-box></wd-message-box>
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import NavBar from '@/components/navbar.vue'
	import dayjs from 'dayjs'
	import {
		userStore
	} from "@/stores/index.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	import {
		useMessage
	} from '@/uni_modules/wot-design-uni'
	const setMessage = useMessage('wd-message-box-slot')
	const nickname = ref("")
	import http from '@/utils/request.js'
	const setNickname = () => {
		nickname.value = userInfo.value.nickname
		setMessage
			.confirm({
				title: '修改昵称'
			})
			.then(async () => {
				const res = await $http.user.setUserInfo({
					avatar: userInfo.value.avatar,
					nickname: nickname.value,
				})
				toast.success('修改成功')
				userInfo.value.nickname = nickname.value
			})
			.catch((error) => {
				console.log(error)
			})
	}
	const message = useMessage()
	const userInfo = ref({
		avatar: '',
		nickname: '',
		role: "",
		email: ''
	})
	const selectImg = () => {
		uni.chooseImage({
			count: 1,
			sizeType: ['compressed'],
			sourceType: ['album'],
			success: function(res) {
				uni.uploadFile({
					url: `${http.baseUrl}upload`,
					filePath: res.tempFilePaths[0],
					name: 'file',
					success: async (fileRes) => {
						const res = await $http.user.setUserInfo({
							avatar: JSON.parse(fileRes.data).data,
							nickname: userInfo.value.nickname,
						})
						userInfo.value.avatar = JSON.parse(fileRes.data).data
					}
				});
			}
		});
	}
	const logout = () => {
		message.alert({
			title: '温馨提示',
			msg: '你将要执行退出登录操作'
		}).then(() => {
			userStore().clearTokenInfo()
			uni.navigateTo({
				url: "/pages/login/login"
			})
		})
	}
	onMounted(() => {
		getUserInfoSimple()
	})
	import $http from "@/api/index.js"
	const getUserInfoSimple = async () => {
		try {
			const res = await $http.user.getUserInfoSimple()
			userInfo.value = res.data
			userStore().setUserInfo(userInfo.value)
		} catch (err) {
			console.log("登录错误", err);
		}
	}
</script>

<style scoped lang="scss">
	.userinfoul {
		.hr {
			height: 1px;
			background-color: #f6f6f6;
		}

		.userinfoitem {
			display: flex;
			align-items: center;
			height: 50px;

			>view {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: flex-end;

				text {
					font-size: 14px;
					color: #999;
				}
			}
		}
	}

	.profile {
		color: #666;
		text-align: center;
		margin: 0;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;

		.img {
			color: #666;
			margin: 0;
			width: 80px;
			height: 80px;
			border-radius: 50%;
			background-color: rgba(0, 0, 0, .04);
			position: relative;
		}
	}
</style>