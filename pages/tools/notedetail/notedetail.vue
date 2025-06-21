<template>
	<view>
		<view class="head">
			<NavbarDefault border title="笔记"></NavbarDefault>
		</view>
		<!-- 单词信息区 -->
		<div class="word-info">
			<div class="word-header">
				<div>
					<span class="word-kanji">{{formatWordName(word.word,word.kana)}}</span>
				</div>
			</div>
			<div class="word-meaning" v-html="word.meaning.join('<br>')">
			</div>
		</div>

		<!-- 笔记编辑区 -->
		<div class="note-editor">
			<div v-if="quote.id!=null" class="quoted-note">
				<span class="quoted-user">@{{quote.nickname}}</span> {{quote.content}}
			</div>
			<textarea v-model="formData.content" class="note-textarea" placeholder="记录你的学习笔记..."></textarea>
			<div class="note-actions" style="justify-content: space-between;margin-top: 16px;">
				<div class="publish-switch">
					<span class="switch-label">公开笔记</span>
					<wd-switch @change="change" active-color="#07C160" size="24px" v-model="formData.public" />
				</div>
				<button @click="submit()" class="submit-btn">{{type=='create'?'创建':'更新'}}</button>
			</div>
		</div>
		<!-- 社区笔记 -->
		<div class="community-notes">
			<div class="section-title">社区笔记 ({{total}})</div>
			<!-- 笔记项2 (带引用) -->
			<div class="note-item" v-for="(item,index) in List" :key="item.id">
				<div class="note-header">
					<uv-avatar size="35" :src="item.user.avatar"></uv-avatar>
					<div class="user-info">
						<div class="user-name">{{item.user.nickname}}</div>
						<div class="note-time">{{dayjs(item.created_at).format('YYYY-MM-DD')}}</div>
					</div>
				</div>
				<div class="quoted-note" v-if="item.cite.id!=0">
					<span class="quoted-user">@{{item.cite.nickname}}</span> {{item.cite.content}}
				</div>
				<div class="note-content">
					{{item.content}}
				</div>
				<div class="note-actions">
					<view :class="{active:item.has}" @click="like(index,item.id)" class="action-btn">
						<text class="far fa-heart"></text>{{item.like}}
					</view>
					<view @click="quoteNote(item.id)" class="action-btn quote-btn">
						<text class="fas fa-quote-left"></text> 引用
					</view>
				</div>
			</div>
		</div>
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		onLoad,
		onReachBottom
	} from "@dcloudio/uni-app"
	import {
		goPage,
		formatWordName
	} from "@/utils/common.js"
	import NavbarDefault from "@/components/navbar/default"
	import $http from "@/api/index.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	import dayjs from 'dayjs'
	onReachBottom(() => {
		if (total.value > List.value.length) {
			++page.value
			getList()
		}
	})
	const like = async (index, id) => {
		if (List.value[index].has) {
			await $http.common.likeNote("unlike", id)
				--List.value[index].like
		} else {
			await $http.common.likeNote("like", id)
				++List.value[index].like
		}
		List.value[index].has = !List.value[index].has
	}
	const toast = useToast()
	const total = ref(0)
	const page = ref(1)
	const size = ref(10)
	const List = ref([])
	const noResult = ref(false)
	const getList = async () => {
		const res = await $http.common.getNoteList(wordId.value, page.value, size.value)
		total.value = res.total
		List.value = List.value.concat(res.data.map(item => ({
			...item,
			has: false
		})));
		if (total.value == 0) {
			noResult.value = true
		}
	}
	const wordId = ref(null)
	const word = ref({
		kana: null,
		word: null,
		meaning: []
	})
	const type = ref('')
	const formData = ref({
		cite_id: null,
		content: "",
		word_id: null,
		public: false
	})
	const change = ({
		value
	}) => {
		submit()
	}
	const quoteNote = async (id) => {
		formData.value.cite_id = id
		submit()
	}
	const submit = async () => {
		if (formData.value.content.trim().length == 0) {
			toast.warning("内容不可为空")
			return
		}
		const res = await $http.common.addNote(formData.value)
		if (type.value == "update") {
			toast.success("更新成功")
		} else {
			toast.success("创建成功")
		}
		getInfo(wordId.value)
	}
	const quote = ref({})
	const getInfo = async (id) => {
		try {
			const res = await $http.common.getNoteInfo(id)
			formData.value.content = res.data.content
			formData.value.public = res.data.public
			formData.value.cite_id = res.data.cite.id
			quote.value = res.data.cite
			type.value = "update"
			word.value = {
				word: res.data.word,
				kana: res.data.kana,
				meaning: res.data.meaning,
			}
		} catch (err) {
			type.value = "create"
			word.value = {
				word: res.data.word,
				kana: res.data.kana,
				meaning: res.data.meaning,
			}
		}

	}
	onLoad((e) => {
		if (e.wordId) {
			wordId.value = e.wordId
			formData.value.word_id = Number(e.wordId)
			getInfo(e.wordId)
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

	/* 单词信息区 */
	.word-info {
		padding: 16px;
		background-color: white;
	}

	.word-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
	}

	.word-kanji {
		font-size: 20px;
		font-weight: 600;
		color: #212121;
	}

	.word-meaning {
		font-size: 15px;
		color: #424242;
		margin-top: 8px;
		line-height: 1.5;
	}

	/* 笔记编辑区 */
	.note-editor {
		padding: 16px;
		margin-top: 16px;
		background-color: white;
	}

	.note-textarea {
		width: auto;
		min-height: 100px;
		padding: 12px;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		font-size: 14px;
		line-height: 1.5;
		resize: none;
		outline: none;
	}

	.note-textarea:focus {
		border-color: #07C160;
	}

	.note-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 12px;
	}

	.publish-switch {
		display: flex;
		align-items: center;
	}

	.switch-label {
		font-size: 14px;
		color: #757575;
		margin-right: 8px;
	}

	.switch {
		position: relative;
		display: inline-block;
		width: 44px;
		height: 24px;
	}

	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #e0e0e0;
		transition: .4s;
		border-radius: 24px;
	}

	.slider:before {
		position: absolute;
		content: "";
		height: 20px;
		width: 20px;
		left: 2px;
		bottom: 2px;
		background-color: white;
		transition: .4s;
		border-radius: 50%;
	}

	input:checked+.slider {
		background-color: #07C160;
	}

	input:checked+.slider:before {
		transform: translateX(20px);
	}

	.submit-btn {
		margin: 0;
		padding: 8px 0;
		width: 80px;
		background-color: #07C160;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
	}

	.submit-btn:active {
		opacity: 0.9;
		transform: scale(0.98);
	}

	/* 社区笔记区 */
	.community-notes {
		margin-top: 16px;
		background-color: white;
		padding: 16px 16px calc(env(safe-area-inset-bottom) + 16px) 16px;
	}

	.section-title {
		font-size: 15px;
		font-weight: 600;
		color: #212121;
		margin-bottom: 12px;
		padding-bottom: 6px;
		border-bottom: 1px solid #f0f0f0;
	}

	/* 笔记项 */
	.note-item {
		background-color: white;
		border-bottom: 1px solid #f0f0f0;
		padding: 12px 0;
	}

	.note-header {
		display: flex;
		align-items: center;
		margin-bottom: 12px;
	}


	.user-info {
		margin-left: 8px;
		flex: 1;
	}

	.user-name {
		font-size: 14px;
		font-weight: 500;
		color: #212121;
		margin-bottom: 2px;
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

	.quote-btn {
		background-color: #E8F5E9;
		color: #2E7D32;
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