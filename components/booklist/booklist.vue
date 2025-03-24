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
				<view v-if="type=='select'&&!item.has" @click.stop="addWordBooks(item.id)">
					<wd-button plain size="small">加入</wd-button>
				</view>
				<view v-if="type=='select'&&item.has" @click.stop="deleteMyBooksWord(item.id)"><wd-button type="error" plain
						size="small">移除</wd-button></view>
			</view>
			<view class="item" @click="emits('add')">
				<view class="add _GCENTER" style="border: 2px solid #d9d9d9;">
					<wd-icon name="add" size="22px" color="#d9d9d9"></wd-icon>
				</view>
				<text class="addtext">新增单词本</text>
			</view>
		</view>
		<wd-toast selector="booklist" />
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		goPage
	} from "@/utils/common.js"
	import $http from "@/api/index.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast('booklist')
	const emits = defineEmits(['add'])
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
	const List = ref([])
	const getList = async () => {
		const res = await $http.word.getMyBooks(props.wordId)
		List.value = res.data
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
	defineExpose({
		getList
	})
</script>

<style scoped lang="scss">
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