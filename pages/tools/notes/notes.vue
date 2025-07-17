<template>
	<view>
		<view class="head">
			<NavbarDefault border title="我的笔记"></NavbarDefault>
		</view>
		<!-- 社区笔记 -->
		<view class="community-notes">
			<div @click="goPage('/pages/tools/notedetail/notedetail',{wordId:item.word_id})" class="note-item"
				v-for="(item,index) in List" :key="item.id">
				<div class="note-header">
					{{formatWordName(item.word,item.kana)}}
				</div>
				<div class="quoted-note" v-if="item.cite.id!=null">
					<span class="quoted-user">@{{item.cite.nickname}}</span> {{item.cite.content}}
				</div>
				<div class="note-content">
					{{item.content}}
				</div>
				<div class="note-actions">
					<view class="action-btn">
						<text class="far fa-heart"></text>{{item.like}}
					</view>
				</div>
			</div>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import NavbarDefault from "@/components/navbar/default"
	import {
		onShow,
		onReachBottom
	} from "@dcloudio/uni-app"
	import {
		userStore
	} from "@/stores/index.js"
	import {
		goPage,
		formatWordName
	} from "@/utils/common.js"
	import $http from "@/api/index.js"
	import dayjs from 'dayjs'
	const total = ref(0)
	const page = ref(1)
	const size = ref(10)
	const List = ref([])
	const getList = async () => {
		const res = await $http.common.getSelfNoteList(page.value, size.value)
		total.value = res.total
		if (total.value === 0) {
			return
		}
		List.value = List.value.concat(res.data)
	}
	onReachBottom(() => {
		if (total.value > List.value.length) {
			++page.value
			getList()
		}
	})
	const clearList=()=>{
		List.value=[]
		page.value=1
		total.value=0
	}
	onShow(() => {
		if (!userStore().loginStatus) {
			goPage("/pages/login/login?toast=请登录之后使用")
		} else {
			clearList()
			getList()
		}
	})
</script>


<style lang="scss" scoped>
	.head {
		position: sticky;
		top: 0;
		z-index: 9;
	}

	.community-notes {
		padding-bottom: calc(env(safe-area-inset-bottom) + 16px);
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin: 16px 0 16px 0;
	}

	/* 笔记项 */
	.note-item {
		background-color: white;
		padding: 16px;
	}

	.note-header {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 12px;
	}



	.note-time {
		font-size: 12px;
		color: #9E9E9E;
	}

	.note-content {
		font-size: 14px;
		color: #424242;
		line-height: 1.5;
		margin-bottom: 12px;
		padding: 12px;
		background-color: #fafafa;
		border-radius: 8px;
	}

	.note-actions {
		margin: 0;
		display: flex;
		justify-content: flex-end;
	}

	.action-btn {
		gap: 4px;
		display: flex;
		align-items: center;
		padding: 6px 12px;
		background-color: #f5f5f5;
		border-radius: 16px;
		font-size: 13px;
		color: #757575;
		border: none;
		cursor: pointer;
		margin-left: 8px;
		transition: all 0.2s ease;
	}

	.action-btn text {
		margin-right: 4px;
		font-size: 12px;
	}

	.action-btn.active {
		color: #F44336;
	}


	/* 引用笔记样式 */
	.quoted-note {
		padding: 12px;
		background-color: #f5f5f5;
		border-left: 3px solid #07C160;
		border-radius: 4px;
		margin-bottom: 12px;
		font-size: 13px;
		color: #616161;
	}

	.quoted-user {
		font-weight: 500;
		color: #07C160;
	}
</style>