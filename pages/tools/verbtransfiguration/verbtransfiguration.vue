<template>
	<view>
		<view class="head">
			<NavbarDefault border title="动词变形"></NavbarDefault>
			<!-- 搜索栏 -->
			<div style="padding:16px; background:#FFFFFF;">
				<div style="display:flex; gap:8px;">
					<input confirm-type="search" @blur="confirm" v-model="value" type="text"
						placeholder="输入动词原形 (ます形/基本形)"
						style="flex:1; padding:12px 16px; border:1px solid #E0E0E0; border-radius:8px; font-size:16px;">
				</div>
			</div>
		</view>
		<!-- 主体内容区 -->
		<div class="content-container">
			<!-- 基本变形组 -->
			<div class="transform-group">
				<div class="group-header">
					<h2>形态</h2>
				</div>
				<div class="group-content">
					<!-- 基本型 -->
					<div class="transform-item">
						<div class="transform-label">基本形</div>
						<div class="transform-value">{{get('基本形')}}</div>
					</div>
					<!-- ます形 -->
					<div class="transform-item striped">
						<div class="transform-label">ます形</div>
						<div class="transform-value">{{get('ます形')}}</div>
					</div>
					<!-- て形 -->
					<div class="transform-item">
						<div class="transform-label">て形</div>
						<div class="transform-value">{{get('て形')}}</div>
					</div>
					<!-- た形 -->
					<div class="transform-item striped">
						<div class="transform-label">た形</div>
						<div class="transform-value">{{get('た形')}}</div>
					</div>
					<!-- ない形 -->
					<div class="transform-item">
						<div class="transform-label">ない形</div>
						<div class="transform-value">{{get('ない形')}}</div>
					</div>
					<!-- 命令形 -->
					<div class="transform-item striped">
						<div class="transform-label">命令形</div>
						<div class="transform-value">{{get('命令形')}}</div>
					</div>
					<!-- 禁止形 -->
					<div class="transform-item">
						<div class="transform-label">禁止形</div>
						<div class="transform-value">{{get('禁止形')}}</div>
					</div>
					<!-- 可能形 -->
					<div class="transform-item">
						<div class="transform-label">可能形</div>
						<div class="transform-value">{{get('可能形')}}</div>
					</div>
					<!-- 被动形 -->
					<div class="transform-item striped">
						<div class="transform-label">被动形</div>
						<div class="transform-value">{{get('被动形')}}</div>
					</div>
					<!-- 使役形 -->
					<div class="transform-item">
						<div class="transform-label">使役形</div>
						<div class="transform-value">{{get('使役形')}}</div>
					</div>
					<!-- 使役被动形 -->
					<div class="transform-item striped">
						<div class="transform-label">使役被动形</div>
						<div class="transform-value">{{get('使役被动形')}}</div>
					</div>
					<!-- 假定形 -->
					<div class="transform-item">
						<div class="transform-label">假定形</div>
						<div class="transform-value">{{get('假定形')}}</div>
					</div>
					<!-- 意向形 -->
					<div class="transform-item striped">
						<div class="transform-label">意向形</div>
						<div class="transform-value">{{get('意向形')}}</div>
					</div>
				</div>
			</div>
		</div>
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		ref,
	} from 'vue'
	import {
		onLoad,
	} from "@dcloudio/uni-app"
	import {
		goPage
	} from "@/utils/common.js"
	import NavbarDefault from "@/components/navbar/default"
	import $http from "@/api/index.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	const data = ref([])
	const value = ref('')
	const get = (key) => {
		const res = data.value.find(({
			category
		}) => category == key)
		if (res) {
			return res.result
		} else {
			return res
		}
	}
	const confirm = async () => {
		try {
			if (value.value.trim().length == 0) {
				toast.warning(`单词不可为空`)
				return
			}
			toast.loading("正在获取中")
			const res = await $http.common.getVerbTrans(value.value.trim())
			data.value = res.data
			toast.close()
		} catch (err) {
			toast.warning(`这个单词不是动词`)
		}
	}
</script>

<style lang="scss" scoped>
	.content-container {
		padding: 16px 0;
		overflow-y: auto;
		padding-bottom: env(safe-area-inset-bottom);
	}
	.transform-group {
		margin-bottom: 16px;
		background: #FFFFFF;
	}

	.group-header {
		padding: 12px 16px;
		border-bottom: 1px solid #F0F0F0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.group-header h2 {
		font-size: 16px;
		color: #212121;
		margin: 0;
	}

	.group-content {
		padding: 8px 0;
	}

	.transform-item {
		display: flex;
		padding: 12px 16px;
	}

	.transform-item.striped {
		background: #FAFAFA;
	}

	.transform-label {
		flex: 1;
		color: #757575;
		font-size: 14px;
	}

	.transform-value {
		font-size: 16px;
		color: #212121;
		font-weight: 500;
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
		padding: 0 16px;
		font-size: 16px;
	}
</style>