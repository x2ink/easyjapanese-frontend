<template>
	<view>
		<Navbar :title="formData.name">
		</Navbar>
		<view class="wordlist" v-if="List.length>0">
			<view @click="goPage('/pages/word/worddetail/worddetail',{id:item.id,type:'jc'})" :key="item.id"
				v-for="item in List">
				<view class="worditem">
					<view class="head jpfont">
						<p>{{item.word}}{{item.word!=item.kana?'['+item.kana+']':''}}</p>
					</view>
					<wd-text size="14px" :lines="2" custom-class="bodytext" color="#999"
						:text="item.meaning.join('\n')"></wd-text>
					<view style="margin-top: 5px;display: flex;justify-content: flex-end;">
						<wd-icon @click.stop="deleteWord(item.id)" name="delete-thin" color="#999" class="delete"
							size="18px"></wd-icon>
					</view>
				</view>
			</view>
		</view>
		<wd-loadmore v-if="List.length>0&&total>List.length" custom-class="loadmore" :state="loadmore" />
		<wd-backtop :scrollTop="scrollTop"></wd-backtop>
		<view v-if="noResult" style="margin-top: 40px;">
			<wd-status-tip :image-size="{
			        height: 80,
			        width: 80
			}" image="http://jp.x2.ink/images/blank.png" tip="空空如也" />
		</view>
		<wd-popup v-model="show" :safe-area-inset-bottom="true" :z-index="99" position="bottom" custom-style="border-radius:16px 16px 0 0;">
			<view class="popup">
				<h3>修改资料</h3>
				<wd-input type="text" v-model="formData.name" size="large" placeholder="请输入单词本名称" />
				<wd-input type="text" v-model="formData.describe" size="large" placeholder="请输入单词本描述" />
				<view style="padding:10px;margin-top: 15px;">
					<wd-button @click="create()" block style="width: 100%;">修改</wd-button>
				</view>
			</view>
		</wd-popup>
		<wd-toast />
		<wd-fab :gap="{right: 15, bottom: 60 }">
			<view style="display: flex;flex-direction: column;gap: 12px;">
				<view class="btn _GCENTER" @click="show=true">
					<wd-icon name="edit" sitze="20px" color="#fff"></wd-icon>
				</view>
				<view class="btn _GCENTER">
					<wd-icon name="print" size="20px" color="#fff"></wd-icon>
				</view>
				<view class="btn _GCENTER" @click="dele()">
					<wd-icon name="delete1" size="20px" color="#fff"></wd-icon>
				</view>
			</view>
		</wd-fab>
		<wd-message-box></wd-message-box>
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
	import Navbar from '@/components/navbar/navbar.vue';
	import WordList from "@/components/wordlist.vue"
	import {
		goPage
	} from "@/utils/common.js"
	import {
		useMessage
	} from '@/uni_modules/wot-design-uni'
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
	const dele = () => {
		console.log("删除");
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
	.btn {
		width: 56px;
		height: 56px;
		border-radius: 100%;
		&:nth-of-type(1){
			background-color: #5880F2;
		}
		&:nth-of-type(2){
			background-color: #57D09B;
		}
		&:nth-of-type(3){
			background-color: #EF4651;
		}
	}

	:deep(.loadmore) {
		background-color: #f4f4f4;
		margin: 0;

		>view {
			margin: 0;
		}
	}

	:deep(.bodytext) {
		margin-top: 5px;
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