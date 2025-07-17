<template>
	<view>
		<NavbarDefault title="生词本"></NavbarDefault>
		<!-- 生词本列表 -->
		<div class="notebook-list">
			<!-- 生词本1 -->
			<div @click="goPage('/pages/word/mybookswordlist/mybookswordlist',{id:item.id})" :key="item.id"
				v-for="item in List" class="notebook-item">
				<div class="notebook-header">
					<view v-if="item.icon.type=='image'" class="notebook-icon _BACKGROUND"
						:style="{backgroundImage:`url('${item.icon.data}')`}">
					</view>
					<div v-else class="notebook-icon" :style="{backgroundColor: item.icon.bg}">
						<text v-if="item.icon.type=='icon'" class="fas" :class="item.icon.data"></text>
						<text class="text" v-else>{{item.icon.data}}</text>
					</div>
					<div class="notebook-info">
						<div class="notebook-name">
							<text>{{item.name}}</text>
							<text v-if="item.status==1" class="published-tag">
								<text class="fas fa-check-circle"></text>
								<text>已发布</text>
							</text>
						</div>
						<div class="notebook-desc">{{item.describe}}</div>
						<div class="notebook-footer">
							<view class="timeandcount">
								<div class="word-count">{{item.word}}个单词</div>
								<div class="notebook-meta">创建于{{dayjs(item.created_at).format("YYYY.MM.DD")}}</div>
							</view>
							<div @click.stop="openMoreShow(item)" class="notebook-actions _GCENTER">
								<text class="fas fa-ellipsis-h more-btn"></text>
							</div>
						</div>
					</div>
					<view class="selectbtn" v-if="selectBook">
						<button @click.stop="removeWord(item)" v-if="item.has" class="action-btn remove-btn">移除</button>
						<button @click.stop="addWord(item)" v-else class="action-btn add-btn">加入</button>
					</view>
				</div>

			</div>
			<wd-status-tip v-if="List.value==0&&!loading" image="https://jp.x2.ink/images/status/blank.png" tip="还没有创建生词本~" />
		</div>
		<!-- 创建按钮 -->
		<button @click="openPopup('create')" class="create-btn" id="createNotebookBtn">
			<i class="fas fa-plus"></i>
		</button>
		<wd-popup position="bottom" v-model="createdShow" custom-style="border-radius:32rpx;"
			@close="createdShow=false">
			<div class="popup-container">
				<div class="popup-header">
					<div class="popup-title">{{pattern=='create'?'创建':'编辑'}}生词本</div>
					<view class="close-btn" @click="createdShow=false">
						<text class="fas fa-times"></text>
					</view>
				</div>

				<div class="form-group">
					<label class="form-label">选择图标</label>
					<div class="icon-selector">
						<div @click="selected=index" :key="item.data" v-for="(item,index) in icons" class="icon-option"
							:class="{selected:index==selected}" :style="{backgroundColor:item.bg}">
							<text class="fas" :class="item.data"></text>
						</div>
					</div>
				</div>

				<div class="form-group">
					<label class="form-label">生词本名称</label>
					<input v-model="formData.name" type="text" class="form-input" placeholder="例如：N5核心词汇">
				</div>

				<div class="form-group">
					<label class="form-label">生词本描述</label>
					<textarea v-model="formData.describe" class="form-textarea"
						placeholder="简单描述这个生词本的用途和内容"></textarea>
				</div>
				<button @click="submit()" class="submit-btn">{{pattern=='create'?'创建':'更新'}}生词本</button>
			</div>
		</wd-popup>
		<wd-toast />
		<wd-action-sheet cancel-text="取消" v-model="moreShow" :actions="moreActions" @close="moreShow=false"
			@select="select" />
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import dayjs from 'dayjs'
	import $http from "@/api/index.js"
	import NavbarDefault from "@/components/navbar/default"
	import {
		userStore
	} from "@/stores/index.js"
	const navBarHeight = ref(0)
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import {
		goPage
	} from "@/utils/common.js"
	const id = ref(null)
	const createdShow = ref(false)
	const icons = ref([{
		bg: "#2196F3",
		data: "fa-book",
		type: "icon"
	}, {
		bg: "#9C27B0",
		data: "fa-scroll",
		type: "icon"
	}, {
		bg: "#FF9800",
		data: "fa-language",
		type: "icon"
	}, {
		bg: "#4CAF50",
		data: "fa-leaf",
		type: "icon"
	}, {
		bg: "#F44336",
		data: "fa-fire",
		type: "icon"
	}, {
		bg: "#607D8B",
		data: "fa-pen",
		type: "icon"
	}])
	const addWord = async (item) => {
		const res = await $http.word.addBookWord({
			book_id: item.id,
			word_id: Number(wordId.value)
		})
		getList()
	}
	const removeWord = async (item) => {
		const res = await $http.word.removeBookWord(wordId.value, item.id)
		getList()
	}
	const moreShow = ref(false)
	const moreActions = ref([])
	const select = (e) => {
		if (e.item.name == "编辑单词本") {
			openPopup("update", tempData.value)
		} else if (e.item.name == "发布单词本") {
			uni.showModal({
				title: '发布提示',
				content: '发布单词本需要进行审核，且发布之后无法撤回！',
				success: async function(res) {
					if (res.confirm) {
						try {
							await $http.word.releaseBook(tempData.value.id)
							toast.success("提交成功")
						} catch (err) {
							if (err.code == 4001) {
								toast.warning("请勿重复提交")
							}
						}
					}
				}
			});
		} else if (e.item.name == "删除单词本") {
			uni.showModal({
				title: '温馨提示',
				content: '删除单词本，单词本内单词也会被删除，且不可恢复！',
				success: async function(res) {
					if (res.confirm) {
						try {
							await $http.word.deleteBook(tempData.value.id)
							toast.success("删除成功")
							getList()
						} catch (err) {
							if (err.code == 4001) {
								toast.warning("发布中禁止删除")
							}
						}
					}
				}
			});

		}
	}
	const selected = ref(0)
	const formData = ref({
		icon: {
			data: "",
			bg: "",
			type: ""
		},
		name: "",
		describe: ""
	})
	const pattern = ref("")
	const currentId = ref(null)
	const tempData = ref({})
	const openMoreShow = (data) => {
		tempData.value = data
		moreActions.value = [{
				name: '编辑单词本'
			},
			{
				name: '删除单词本'
			}
		]
		if (data.status == 0) {
			moreActions.value = [{
				name: '发布单词本'
			}, ...moreActions.value]
		}
		moreShow.value = true
	}
	const openPopup = (type, data) => {
		if (type == "update") {
			currentId.value = data.id
			formData.value = {
				icon: data.icon,
				name: data.name,
				describe: data.describe
			}
		}
		createdShow.value = true
		pattern.value = type
	}
	const submit = async () => {
		if (formData.value.name.trim().length === 0) {
			toast.warning("单词本名词为空")
			return
		}
		if (formData.value.describe.trim().length === 0) {
			toast.warning("单词本介绍为空")
			return
		}
		formData.value.icon = icons.value[selected.value]
		if (pattern.value == 'create') {
			try {
				const res = await $http.word.addBook(formData.value)
				toast.success("创建成功")
			} catch (err) {
				if (err.code == 4001) {
					toast.warning("单词本名词重复")
					return
				}
			}
		} else {
			try {
				const res = await $http.word.setBook(tempData.value.id, formData.value)
				toast.success("更新成功")
			} catch (err) {
				if (err.code == 4001) {
					toast.warning("单词本名词重复")
					return
				}
			}
		}
		createdShow.value = false
		formData.value = {
			icon: {
				data: "",
				bg: "",
				type: ""
			},
			name: "",
			describe: ""
		}
		getList()
	}
	const List = ref([])
	const loading=ref(true)
	const getList = async () => {
		const res = await $http.word.getSelfBooks(wordId.value)
		List.value = res.data
		loading.value=false
	}
	const wordId = ref(0)
	const selectBook = ref(false)
	onShow(() => {
		getList()
	})
	onLoad((op) => {
		if (op.wordId) {
			wordId.value = op.wordId
			selectBook.value = true
		}
		if (!userStore().loginStatus) {
			goPage("/pages/login/login?toast=请登录之后使用")
		}
	})
	onMounted(() => {
		const systemInfo = wx.getSystemInfoSync();
		const statusBarHeight = systemInfo.statusBarHeight;
		navBarHeight.value = statusBarHeight + 'px'
	})
</script>

<style lang="scss" scoped>
	.published-tag {
		background-color: #e3f2fd;
		color: #2196F3;
		font-size: 10px;
		padding: 2px 8px;
		border-radius: 10px;
		font-weight: 500;
		display: flex;
		align-items: center;
	}

	.published-tag text {
		font-size: 10px;
		margin-right: 4px;
	}

	.remove-btn {
		background-color: #ffebee;
		color: #F44336;
	}

	.action-btn {
		padding: 4px 12px;
		border-radius: 12px;
		font-size: 12px;
		margin-left: 8px;
		border: none;
		outline: none;
	}

	.add-btn {
		background-color: #e8f5e9;
		color: #4CAF50;
	}

	/* 弹窗样式 */
	.popup-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 100;
		display: none;
	}

	.popup-container {
		background-color: white;
		border-top-left-radius: 16px;
		border-top-right-radius: 16px;
		padding: 24px 16px calc(env(safe-area-inset-bottom) + 24px) 16px;
	}

	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	.popup-title {
		font-size: 18px;
		font-weight: 500;
	}

	.close-btn {
		color: #757575;
		font-size: 20px;
	}

	.form-group {
		margin-bottom: 16px;
	}

	.form-label {
		display: block;
		font-size: 14px;
		margin-bottom: 8px;
		color: #616161;
	}

	.form-input {
		padding: 12px;
		border: 1px solid #E0E0E0;
		border-radius: 8px;
		font-size: 15px;
	}

	.form-textarea {
		width: auto;
		padding: 12px;
		border: 1px solid #E0E0E0;
		border-radius: 8px;
		font-size: 15px;
		min-height: 80px;
		resize: none;
	}

	.icon-selector {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
		margin-bottom: 16px;
	}

	.icon-option {
		width: 48px;
		height: 48px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20px;
		color: white;
		cursor: pointer;
	}

	.icon-option.selected {
		border: 2px solid #07C160;
	}

	.submit-btn {
		width: 100%;
		padding: 14px;
		background-color: #07C160;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 16px;
		font-weight: 500;
		margin-top: 8px;
	}

	/* 创建按钮 */
	.create-btn {
		position: fixed;
		bottom: 80px;
		right: 32px;
		width: 56px;
		height: 56px;
		border-radius: 28px;
		background-color: #07C160;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		z-index: 10;
	}

	/* 生词本列表 */
	.notebook-list {
		padding: 16px;
		overflow-y: auto;
		height: calc(100% - 56px - 56px);
	}

	.notebook-item {
		background-color: white;
		border-radius: 8px;
		padding: 12px;
		margin-bottom: 12px;
		position: relative;
	}

	.notebook-header {
		display: flex;
		margin-bottom: 8px;
		justify-content: space-between;
		position: relative;
	}

	.selectbtn {
		position: absolute;
		top: 0;
		right: 0;
	}

	.notebook-icon {
		width: 60px;
		aspect-ratio: 3 / 4;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 12px;
		color: white;
		font-size: 18px;

		.text {
			font-size: 16px;
			font-weight: bold;
		}
	}

	.notebook-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.notebook-name {
		gap: 4px;
		font-size: 18px;
		font-weight: 500;
		margin-bottom: 2px;
		display: flex;
		align-items: center;
	}

	.notebook-meta {
		font-size: 12px;
		color: #757575;
	}

	.notebook-desc {
		font-size: 13px;
		color: #616161;
	}

	.notebook-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.timeandcount {
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex: 1;
		}
	}

	.word-count {
		font-size: 12px;
		color: #757575;
	}

	.notebook-actions {
		margin-left: 16px;
	}


	.more-btn {
		color: #757575;
		font-size: 20px;
	}
</style>