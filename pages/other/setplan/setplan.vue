<template>
	<view class="head">
		<NavbarDefault border title="背词设置"></NavbarDefault>
	</view>
	<view style="padding-bottom: env(safe-area-inset-bottom);">
		<view class="cell">
			<view class="cell-title">
				<text>切换词书</text>
			</view>
			<view class="cell-content" @click="goPage('/pages/word/thesaurus/thesaurus')">
				<text>当前词书</text>
				<view>
					<text>{{config.book.name}}</text>
					<i class="fa-solid fa-angle-right"></i>
				</view>
			</view>
		</view>
		<view class="cell">
			<view class="cell-title">
				<text>学习设置</text>
			</view>
			<view class="cell-progress">
				<text>每组新学{{config.learn_group}}单词</text>
				<view style="margin-top: 8px;">
					<wd-slider :min="5" :max="20" v-model="config.learn_group" active-color="#42C05C" hide-label />
				</view>
			</view>
			<view class="cell-progress">
				<text>每组复习{{config.review_group}}单词</text>
				<view style="margin-top: 8px;">
					<wd-slider :min="5" :max="50" v-model="config.review_group" active-color="#42C05C" hide-label />
				</view>
			</view>
			<view class="cell-progress">
				<text>每组默写{{config.write_group}}单词</text>
				<view style="margin-top: 8px;">
					<wd-slider :min="5" :max="50" v-model="config.write_group" active-color="#42C05C" hide-label />
				</view>
			</view>
			<view class="cell-progress">
				<text>每组听写{{config.sound_group}}单词</text>
				<view style="margin-top: 8px;">
					<wd-slider :min="5" :max="50" v-model="config.sound_group" active-color="#42C05C" hide-label />
				</view>
			</view>
		</view>
		<view class="cell">
			<view class="cell-title">
				<text>记忆周期设置</text>
			</view>
			<view class="cell-progress">
				<text>遗忘单词权重:{{config.cycle_config.extent.forgotten}}%</text>
				<view style="margin-top: 8px;">
					<wd-slider :step="10" :min="10" :max="100" v-model="config.cycle_config.extent.forgotten"
						active-color="#42C05C" hide-label />
				</view>
			</view>
			<view class="cell-progress">
				<text>模糊记忆权重:{{config.cycle_config.extent.vague}}%</text>
				<view style="margin-top: 8px;">
					<wd-slider :step="10" :min="10" :max="100" v-model="config.cycle_config.extent.vague"
						active-color="#42C05C" hide-label />
				</view>
			</view>
			<view class="cell-progress">
				<text>部分记忆权重:{{config.cycle_config.extent.partial}}%</text>
				<view style="margin-top: 8px;">
					<wd-slider :step="10" :min="10" :max="100" v-model="config.cycle_config.extent.partial"
						active-color="#42C05C" hide-label />
				</view>
			</view>
			<view class="cell-progress">
				<text>复习周期</text>
				<view style="margin-top: 8px;">
					<input type="text" v-model="tempcycle" placeholder="请注意输入格式例如（1，3，7，14，30）"
						style="flex:1; padding:12px 16px; border:1px solid #E0E0E0; border-radius:8px; font-size:16px;">
				</view>
			</view>

		</view>
		<button class="btn _GCENTER" @click="updateConfig()">保存配置</button>
		<wd-toast />
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
	const updateConfig = async () => {
		config.value.cycle_config.cycle = tempcycle.value.split(",").map(item => Number(item))
		const res = await $http.user.updateConfig(config.value)
		toast.success(`更新成功`)
		getConfig()
	}
	const getConfig = async () => {
		const res = await $http.user.getConfig()
		config.value = res.data
		tempcycle.value = config.value.cycle_config.cycle.join(",")
		console.log(config.value);
	}
	const tempcycle = ref('')
	const config = ref({
		id: null,
		user_id: null,
		learn_group: 0,
		review_group: 0,
		write_group: 0,
		sound_group: 0,
		book_id: null,
		book: {
			name: ""
		},
		cycle_config: {
			cycle: [],
			extent: {
				forgotten: 0,
				vague: 0,
				partial: 0
			}
		}
	})
	onShow(() => {
		if (!userStore().loginStatus) {
			goPage("/pages/login/login?toast=请登录之后使用")
		} else {
			getConfig()
		}

	})
</script>

<style scoped lang="scss">
	:deep(.pickercell) {
		display: none !important;
	}

	.head {
		position: sticky;
		top: 0;
		z-index: 9;
	}

	.btn {
		background: #07C160;
		color: white;
		border-radius: 8px;
		font-size: 16px;
		margin: 16px;
		height: 45px;
	}

	.cell {
		padding: 16px;
		margin: 16px;
		background-color: white;
		border-radius: 8px;

		.cell-title {
			display: flex;
			align-items: center;



			text {
				font-size: 16px;
				font-weight: bold;
			}

		}

		.cell-progress {
			margin-top: 16px;

		}

		.cell-content {
			margin-top: 16px;
			display: flex;
			align-items: center;
			justify-content: space-between;

			>text {
				font-size: 14px;
			}

			>view {
				display: flex;
				align-items: center;

				>text {
					font-size: 14px;
				}

				.fa-angle-right {
					font-size: 18px;
					margin-left: 8px;
				}
			}
		}

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