<template>
	<view class="head">
		<NavbarDefault border title="背词设置"></NavbarDefault>
	</view>
	<view :style="{
		paddingBottom:`${getOs()=='ios'?'env(safe-area-inset-bottom)':'32rpx'}`
	}">
		<view class="cell">
			<view class="cell-title">
				<text>切换词书</text>
			</view>
			<view class="cell-content" @click="goPage('/pages/word/thesaurus/thesaurus')">
				<text>当前词书</text>
				<view>
					<text>{{config.book.name}}</text>
					<i class="fas fa-angle-right"></i>
				</view>
			</view>
		</view>
		<view class="cell">
			<view class="cell-title">
				<text>学习设置</text>
			</view>
			<view class="cell-progress">
				<text>每组新学{{config.learn_group}}单词</text>
				<view style="margin-top: 16rpx;">
					<wd-slider :min="5" :max="20" v-model="config.learn_group" active-color="#42C05C" hide-label />
				</view>
			</view>
			<view class="cell-progress">
				<text>每组复习{{config.review_group}}单词</text>
				<view style="margin-top: 16rpx;">
					<wd-slider :min="5" :max="50" v-model="config.review_group" active-color="#42C05C" hide-label />
				</view>
			</view>
			<view class="cell-progress">
				<text>每组默写{{config.write_group}}单词</text>
				<view style="margin-top: 16rpx;">
					<wd-slider :min="5" :max="50" v-model="config.write_group" active-color="#42C05C" hide-label />
				</view>
			</view>
			<view class="cell-progress">
				<text>每组听写{{config.sound_group}}单词</text>
				<view style="margin-top: 16rpx;">
					<wd-slider :min="5" :max="50" v-model="config.sound_group" active-color="#42C05C" hide-label />
				</view>
			</view>
		</view>
		<view class="cell">
			<view class="cell-title">
				<text>记忆周期设置</text>
				<i @click="help()" style="color: #999;" class="fas fa-circle-question"></i>
			</view>
			<view class="cell-progress">
				<text>遗忘单词权重:{{config.cycle_config.extent.forgotten}}%</text>
				<view style="margin-top: 16rpx;">
					<wd-slider :step="10" :min="10" :max="100" v-model="config.cycle_config.extent.forgotten"
						active-color="#42C05C" hide-label />
				</view>
			</view>
			<view class="cell-progress">
				<text>模糊记忆权重:{{config.cycle_config.extent.vague}}%</text>
				<view style="margin-top: 16rpx;">
					<wd-slider :step="10" :min="10" :max="100" v-model="config.cycle_config.extent.vague"
						active-color="#42C05C" hide-label />
				</view>
			</view>
			<view class="cell-progress">
				<text>部分记忆权重:{{config.cycle_config.extent.partial}}%</text>
				<view style="margin-top: 16rpx;">
					<wd-slider :step="10" :min="10" :max="100" v-model="config.cycle_config.extent.partial"
						active-color="#42C05C" hide-label />
				</view>
			</view>
			<view class="cell-progress">
				<text>复习周期</text>
				<view style="margin-top: 16rpx;">
					<input type="text" v-model="tempcycle" placeholder="请注意输入格式例如（1，3，7，14，30）"
						style="flex:1; padding:24rpx 32rpx; border:2rpx solid #E0E0E0; border-radius:16rpx; font-size:32rpx;">
				</view>
			</view>

		</view>
		<button class="btn _GCENTER" @click="updateConfig()">保存配置</button>
		<wd-toast />
		<wd-message-box>
			<view style="text-align: left;" v-html="helpText"></view>
		</wd-message-box>
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
		goPage,
		getOs
	} from "@/utils/common.js"
	import {
		useToast,
		useMessage
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	const message = useMessage()
	const helpText = ref(`
			单词学习算法的复习间隔调整机制详解<br>
			本系统采用四级掌握程度分类和动态间隔调整策略来优化单词复习计划。以下是核心机制：<br>
			1. 掌握程度分级标准<br>
			- 记住：0次错误<br>
			- 部分：1-2次错误<br>
			- 模糊：3-5次错误<br>
			- 遗忘：6次及以上错误<br>
			2. 间隔调整计算公式<br>
			系统会根据错误次数对应的掌握程度，使用配置的百分比来缩短原定复习间隔：<br>
			下次复习间隔 = 原定间隔 × (1 - 对应百分比)<br>
			具体调整规则：<br>
			- 记住：保持原周期不变<br>
			- 部分：原间隔 × (1 - Partial%)<br>
			- 模糊：原间隔 × (1 - Vague%)<br>
			- 遗忘：原间隔 × (1 - Forgotten%)<br>
			3. 阶段推进机制<br>
			当单词被"记住"时：<br>
			- 复习阶段会提升（如从阶段1→阶段2）<br>
			- 后续使用更长的周期（如从7天变为14天）<br>
			当单词出现错误时：<br>
			- 保持或降低当前阶段<br>
			- 按缩短后的间隔安排复习<br>
			4. 实际计算示例<br>
			假设用户配置：<br>
			Partial=20%，Vague=40%，Forgotten=60%<br>
			基础周期：[7天，14天，30天]<br>
			场景1：阶段1单词（原计划7天后复习）<br>
			- 错误4次 → 模糊<br>
			- 新间隔：7×(1-0.4)=4.2天→4天后<br>
			- 保持阶段1<br>
			场景2：下次测试0错误 → 记住<br>
			- 推进到阶段2<br>
			- 新间隔：14天后<br>
			场景3：再测试错误6次 → 遗忘<br>
			- 新间隔：14×(1-0.6)=5.6天→6天后<br>
			- 降回阶段1<br>
			5. 保护机制<br>
			- 最小间隔不低于1天<br>
			- 所有时间以午夜为基准取整<br>
			- 错误次数越多，间隔缩短幅度越大<br>
			这种设计确保：<br>
			- 困难单词获得更多复习机会<br>
			- 已掌握单词减少无效重复<br>
			- 每个单词根据实际记忆情况获得个性化安排<br>
			注意事项：<br>
			1. 百分比数值越大，间隔缩短越多<br>
			2. 阶段升降与间隔调整相互配合<br>
			3. 实际间隔会取整到最近的整天数<br>
			`)
	const help = () => {
		message.alert({
			confirmButtonProps: {
				type: 'success',
				customClass: 'custom-shadow'
			},
			title: '记忆周期配置解释'
		})
	}
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

	:deep() {
		.wd-message-box {
			.custom-shadow {
				background: #07C160!important;
				color: white!important;
				border-radius: 16rpx!important;
				font-size: 28rpx!important;
				height: 80rpx!important;
			}
		}
	}

	.head {
		position: sticky;
		top: 0;
		z-index: 9;
	}

	.btn {
		background: #07C160;
		color: white;
		border-radius: 16rpx;
		font-size: 32rpx;
		margin: 32rpx;
		height: 90rpx;
	}

	.cell {
		padding: 32rpx;
		margin: 32rpx;
		background-color: white;
		border-radius: 16rpx;

		.cell-title {
			display: flex;
			align-items: center;
			justify-content: space-between;


			text {
				font-size: 32rpx;
				font-weight: bold;
			}

		}

		.cell-progress {
			margin-top: 32rpx;

		}

		.cell-content {
			margin-top: 32rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			>text {
				font-size: 28rpx;
			}

			>view {
				display: flex;
				align-items: center;

				>text {
					font-size: 28rpx;
				}

				.fa-angle-right {
					font-size: 36rpx;
					margin-left: 16rpx;
				}
			}
		}

		.cellitem {
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 32rpx;

			text {
				color: #999;
			}
		}
	}
</style>