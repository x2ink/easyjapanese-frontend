<template>
	<view>
		<NavBar title="单词本" style="background-color: #f3f3f5;"></NavBar>
		<view class="list">
			<view class="item"
				@click="goPage('mybookswordlist','?id='+item.id+'&name='+item.name+'&describe='+item.describe)"
				v-for="item in List" :key="item.id">
				<view class="add _GCENTER" style="border: 2px solid #fff;">
					<image src="http://jp.x2.ink/images/mybooks.png" mode="aspectFit"></image>
				</view>
				<view class="info">
					<view class="name">{{item.name}}</view>
					<view class="describe">{{item.describe}}</view>
				</view>
				<wd-button v-if="type=='select'" @click.stop="selectBook(item.id)" plain custom-class="custom-btn" size="small">选择</wd-button>
			</view>
			<view class="item" @click="show=true">
				<view class="add _GCENTER" style="border: 2px solid #d9d9d9;">
					<wd-icon name="add" size="22px" color="#d9d9d9"></wd-icon>
				</view>
				<text class="addtext">新增单词本</text>
			</view>
		</view>
		<wd-toast />
		<wd-popup v-model="show" :z-index="99" position="bottom" custom-style="border-radius:16px 16px 0 0;">
			<view class="popup">
				<h3>新增单词本</h3>
				<wd-input type="text" v-model="formData.name" size="large" placeholder="请输入单词本名称" />
				<wd-input type="text" v-model="formData.describe" size="large" placeholder="请输入单词本描述" />
				<view style="padding:10px;margin-top: 15px;">
					<wd-button @click="create()" style="width: 100%;">立即创建</wd-button>
				</view>
			</view>
		</wd-popup>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	import {
		onShow,
		onLoad
	} from '@dcloudio/uni-app'
	import NavBar from '@/components/navbar.vue'
	import $http from "@/api/index.js"
	const show = ref(false)
	const formData = ref({
		name: '',
		describe: ''
	})
	const List = ref([])
	const getList = async () => {
		const res = await $http.word.getMyBooks()
		List.value = res.data
	}
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
	const selectBook = (id) => {
		uni.$emit("selectBookRes", id);
		uni.navigateBack({
			delta: 1
		});
	}
	const create = async () => {
		if (formData.value.name == "" || formData.value.name.length == 0) {
			toast.warning(`名称不可为空`)
			return
		}
		try {
			const res = await $http.word.addMyBooks(formData.value)
			show.value = false
			getList()
			toast.success(`创建成功`)
		} catch (err) {
			console.log(err);
			toast.warning(`单词本最多可以创建5个`)
		}
	}
	onShow(() => {
		getList()
	})
	const type = ref('')
	onLoad((e) => {
		type.value = e.type
	})
</script>

<style scoped lang="scss">
	.popup {
		padding: 15px;
	}

	:deep(.custom-btn) {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 15px;
	}

	.list {
		display: flex;
		gap: 15px;
		flex-direction: column;
		margin: 0 15px;

		.item {
			display: flex;
			align-items: center;
			gap: 10px;
			background-color: white;
			padding: 10px;
			border-radius: 8px;
			position: relative;

			.info {
				.name {
					font-weight: bold;
				}

				.describe {
					font-size: 12px;
					color: #999;
					margin-top: 10px;
				}
			}

			.addtext {
				color: #52c41a;
				font-weight: bold;
				font-size: 16px;
			}

			.add {
				border-radius: 8px;

				height: 60px;
				width: 45px;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>