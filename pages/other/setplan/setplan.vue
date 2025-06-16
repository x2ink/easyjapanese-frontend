<template>
	<view>
		<NavbarDefault border title="背词设置"></NavbarDefault>
		<view class="cell">
			<view class="cellitem" @click="goPage('/pages/word/thesaurus/thesaurus')">
				<p>切换词书</p>
				<view class="_GCENTER">
					<text style="font-size: 14px;">{{config.book.name}}</text>
				</view>
			</view>
			<view class="cellitem" @click="setNumber('learn_group')">
				<p>每组学习单词量</p>
				<view class="_GCENTER">
					<text style="font-size: 14px;">{{config.learn_group}}个</text>
				</view>
			</view>
			<view class="cellitem" @click="setNumber('review_group')">
				<p>每组复习单词量</p>
				<view class="_GCENTER">
					<text style="font-size: 14px;">{{config.review_group}}个</text>
				</view>
			</view>
			<view class="cellitem" @click="datetimePicker.open()">
				<p>学习提醒</p>
				<view class="_GCENTER">
					<text style="font-size: 14px;">{{config.remind}}</text>
				</view>
			</view>
		</view>
<!-- 		<view class="cell">
			<view class="cellitem" @click="modeShow=true">
				<p>背词模式</p>
				<view class="_GCENTER">
					<text style="font-size: 14px;">{{config.mode}}</text>
				</view>
			</view>
		</view> -->
		<wd-action-sheet :z-index="100" :safe-area-inset-bottom="true" cancel-text="取消" v-model="countShow"
			:actions="countActions" @close="countShow=false" @select="countSelect" />
		<wd-toast />
		<wd-action-sheet :z-index="100" :safe-area-inset-bottom="true" cancel-text="取消" v-model="modeShow"
			:actions="modeActions" @close="modeShow=false" @select="modeSelect" />
		<wd-datetime-picker :z-index="999" custom-cell-class="pickercell" type="time" :default-value="config.remind"
			ref="datetimePicker" label="日期选择" @confirm="handleConfirm" />
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'
	import {
		onShow
	} from '@dcloudio/uni-app'
	import NavbarDefault from "@/components/navbar/default"
	import $http from "@/api/index.js"
	import {
		userStore
	} from "@/stores/index.js"
	import {
		goPage
	} from "@/utils/common.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	const countShow = ref(false)
	const modeShow = ref(false)
	const numberType = ref('')
	const setNumber = (type) => {
		numberType.value = type
		countShow.value = true
	}
	const updateListen = (e) => {
		config.value.listen_select = e.value
		updateConfig()
	}
	const datetimePicker = ref(null)
	const handleConfirm = ({
		value
	}) => {
		config.value.remind = value
		updateConfig()
	}
	const modeActions = ref([{
			name: '学习模式',
		},
		{
			name: '快速模式',
		}
	])
	const countActions = ref([{
			name: '10个',
			val: 10
		},
		{
			name: '15个',
			val: 15
		},
		{
			name: '20个',
			val: 20
		},
		{
			name: '40个',
			val: 40
		}
	])
	const modeSelect = (e) => {
		config.value.mode = e.item.name
		updateConfig()
	}
	const countSelect = (e) => {
		if (numberType.value == "learn_group") {
			config.value.learn_group = e.item.val
		} else {
			config.value.review_group = e.item.val
		}
		updateConfig()
	}
	const updateConfig = async () => {
		const res = await $http.user.updateConfig(config.value)
		toast.success(`更新成功`)
		getConfig()
	}
	const getConfig = async () => {
		const res = await $http.user.getConfig()
		config.value = res.data
	}
	const config = ref({
		id: null,
		user_id: null,
		learn_group: null,
		review_group: null,
		mode: "",
		book_id: null,
		listen_select: false,
		remind: '',
		book: {
			name: ""
		}
	})
	onShow(() => {
		getConfig()
	})
</script>

<style scoped lang="scss">
	:deep(.pickercell) {
		display: none !important;
	}

	.cell {
		padding: 8px 16px;
		margin: 16px;
		background-color: white;
		border-radius: 8px;

		.cellitem {
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 16px;

			text {
				color: #999;
			}
		}
	}
</style>