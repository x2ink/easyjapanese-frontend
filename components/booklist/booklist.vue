<template>
	<view>
		<view :class="type!='select'?'primary list':'list'">
			<view class="item" @click="goPage('/pages/word/mybookswordlist/mybookswordlist',{
					id:item.id,name:item.name,describe:item.describe
				})" v-for="item in List" :key="item.id">
				<view class="left">
					<view class="add _GCENTER" style="border: 2px solid #fff;">
						<image src="http://jp.x2.ink/images/book.png" mode="aspectFit"></image>
					</view>
					<view class="info">
						<view class="name">{{item.name}}</view>
						<view class="describe">{{item.describe}}</view>
					</view>
				</view>
				<wd-button v-if="type=='select'&&!item.has" @click.stop="addWordBooks(item.id)" plain
					size="small">加入</wd-button>
				<wd-button type="error" v-if="type=='select'&&item.has" @click.stop="deleteMyBooksWord(item.id)" plain
					size="small">移除</wd-button>
			</view>
			<view class="item" @click="show=true">
				<view class="add _GCENTER" style="border: 2px solid #d9d9d9;">
					<wd-icon name="add" size="22px" color="#d9d9d9"></wd-icon>
				</view>
				<text class="addtext">新增单词本</text>
			</view>
		</view>
		<wd-toast />
		<wd-popup v-model="show" :z-index="100" position="bottom" custom-style="border-radius:16px 16px 0 0;">
			<view class="popup">
				<text>新增单词本</text>
				<wd-input type="text" v-model="formData.name" size="large" placeholder="请输入单词本名称" />
				<wd-input type="text" v-model="formData.describe" size="large" placeholder="请输入单词本描述" />
				<view style="padding:10px;margin-top: 15px;">
					<wd-button @click="create()" block>立即创建</wd-button>
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
	import {
		goPage
	} from "@/utils/common.js"
	onMounted(() => {
		getList()
	})
	const deleteMyBooksWord = async (bookid) => {
		const res = await $http.word.deleteMyBooksWord(Number(props.wordId), bookid)
		toast.success(`移除`)
		getList()
	}
	const addWordBooks = async (bookid) => {
		try {
			const res = await $http.word.addMyBooksWord({
				word_id: Number(props.wordId),
				book_id: bookid
			})
			toast.success(`加入成功`)
			getList()
		} catch (err) {
			toast.warning(`单词已经在该生词本内`)
		}
	}
	const toast = useToast()
	import $http from "@/api/index.js"
	const show = ref(false)
	const formData = ref({
		name: '',
		describe: ''
	})
	const List = ref([])
	const getList = async () => {
		const res = await $http.word.getMyBooks(props.wordId)
		List.value = res.data
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
	const props = defineProps({
		type: {
			default: null,
			type: String
		},
		wordId: {
			default: 0,
			type: Number
		}
	})
</script>

<style scoped lang="scss">
	.popup {
		padding: 20px;

		text {
			font-size: 16px;
			font-weight: bold;
		}
	}



	.primary {
		margin: 0 15px;
		gap: 15px;
	}

	.list {
		display: flex;
		flex-direction: column;

		.item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: white;
			padding: 10px;
			border-radius: 8px;

			.left {
				display: flex;
				align-items: center;
				gap: 10px;

				.info {
					.name {
						font-weight: bold;
					}

					.describe {
						font-size: 12px;
						color: #999;
						margin-top: 5px;
					}
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