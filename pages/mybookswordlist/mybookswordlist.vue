<template>
	<view>
		<NavBar :title="formData.name" style="background-color: #f3f3f5;">
			<template #right>
				<wd-icon @click="moreShow=true" name="ellipsis" size="30px"></wd-icon>
			</template>
		</NavBar>
		<view class="wordlist" v-if="List.length>0">
			<view @click="getInfo(item.id)" :key="item.id" v-for="item in List">
				<view class="worditem">
					<view class="head jpfont">
						<p>{{item.word}}{{item.word!=item.kana?'['+item.kana+']':''}}</p>
					</view>
					<wd-text size="14px" :lines="2" class="body" color="#999" :text="item.meaning.join('\n')"></wd-text>
					<wd-icon @click.stop="deleteWord(item.id)" name="delete-thin" color="#999" class="delete"
						size="18px"></wd-icon>
				</view>
			</view>
		</view>
		<wd-loadmore v-if="List.length>0&&total>List.length" custom-class="loadmore" :state="loadmore" />
		<wd-backtop :scrollTop="scrollTop"></wd-backtop>
		<view v-if="noResult">
			<wd-status-tip image="content" tip="没有数据" />
		</view>
		<wd-action-sheet :z-index="999" :safe-area-inset-bottom="false" cancel-text="取消" v-model="moreShow"
			:actions="actions" @close="moreShow=false" @select="select" />
		<wd-message-box />
		<wd-popup v-model="show" :z-index="99" position="bottom" custom-style="border-radius:16px 16px 0 0;">
			<view class="popup">
				<h3>修改资料</h3>
				<wd-input type="text" v-model="formData.name" size="large" placeholder="请输入单词本名称" />
				<wd-input type="text" v-model="formData.describe" size="large" placeholder="请输入单词本描述" />
				<view style="padding:10px;margin-top: 15px;">
					<wd-button @click="create()" style="width: 100%;">修改</wd-button>
				</view>
			</view>
		</wd-popup>
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'
	import {
		onLoad,
		onPageScroll,
		onReachBottom
	} from "@dcloudio/uni-app"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	import NavBar from '@/components/navbar.vue'
	import WordList from "@/components/wordlist.vue"
	import {
		useMessage
	} from '@/uni_modules/wot-design-uni'
	const getInfo = (id) => {
		uni.navigateTo({
			url: "/pages/worddetail/worddetail?id=" + id + "&type=jc"
		})
	}
	const show = ref(false)
	const formData = ref({
		name: '',
		describe: ''
	})
	const deleteWord = async (id) => {
		await $http.word.deleteMyBooksWord(id, bookid.value)
		const res = await $http.word.getMyBooksWord(bookid.value, 1, size.value * page.value)
		total.value = res.total
		List.value = res.data
		if (res.total == 0) {
			noResult.value = true
		}
	}
	const message = useMessage()
	const scrollTop = ref(0)
	const moreShow = ref(false)
	const dele = () => {
		message
			.confirm({
				msg: '删除生词本之后单词也会被删除',
				title: '温馨提示'
			})
			.then(async () => {
				const res = await $http.word.deleteMyBooks(bookid.value)
				uni.navigateBack({
					delta: 1
				});
			})
			.catch(() => {
				console.log('点击了取消按钮')
			})
	}
	const actions = ref([
		// {
		// 	name: '导出单词'
		// },
		{
			name: '修改资料'
		},
		{
			name: '删除生词本'
		}
	])
	const select = (e) => {
		if (e.index === 0) {
			goPage('feedback', "?type=单词纠错")
		} else if (e.index === 2) {
			dele()
		} else if (e.index == 1) {
			show.value = true
		}
	}
	const create = async () => {
		if (formData.value.name == "" || formData.value.name.length == 0) {
			toast.warning(`名称不可为空`)
			return
		}
		const res = await $http.word.setMyBooks(bookid.value, formData.value)
		show.value = false
		toast.success(`修改成功`)
	}
	onPageScroll((e) => {
		scrollTop.value = e.scrollTop
	})
	import $http from "@/api/index.js"
	const page = ref(1)
	const size = ref(10)
	const total = ref(0)
	const List = ref([])
	const noResult = ref(false)
	const getList = async () => {
		const res = await $http.word.getMyBooksWord(bookid.value, page.value, size.value)
		total.value = res.total
		List.value = List.value.concat(res.data)
		if (res.total == 0) {
			noResult.value = true
		}
	}
	const loadmore = computed(() => {
		if (total.value == List.value.length) {
			return "finished"
		} else {
			return "loading"
		}
	})
	onReachBottom(() => {
		if (total.value > List.value.length) {
			++page.value
			getList()
		}
	})
	const bookid = ref(null)
	onLoad((e) => {
		bookid.value = e.id
		formData.value.describe = e.describe
		formData.value.name = e.name
		getList()
	})
</script>

<style scoped lang="scss">
	:deep(.loadmore) {
		background-color: #f4f4f4;
		margin: 0;

		>view {
			margin: 0;
		}
	}

	.popup {
		padding: 15px;
	}

	.wordlist {
		display: flex;
		flex-direction: column;
		gap: 15px;
		margin: 5px 15px 15px 15px;

		.worditem {
			position: relative;
			background-color: white;
			padding: 10px;
			border-radius: 8px;

			.delete {
				position: absolute;
				right: 10px;
				top: 10px;
			}

			.body {
				// margin-top: 5px;
			}

			.head {
				display: flex;
				align-items: center;
				justify-content: space-between;

				p {
					font-weight: bold;
					font-size: 17px;
				}
			}
		}
	}
</style>