<template>
	<view class="page-container">
		<view class="fixed-header">
			<view class="head">
				<NavbarDefault border title="日常会话"></NavbarDefault>
			</view>
		</view>

		<scroll-view class="scroll-content" scroll-y="true">
			<view class="section-grid">
				<view class="section-item" v-for="(item, index) in sectionList" :key="index" @click="goCategory(item)">
					<view class="section-icon-bg" :style="{ backgroundColor: item.bgColor, color: item.iconColor }">
						<text :class="item.icon"></text>
					</view>
					<view class="section-info">
						<text class="section-title">{{ item.name }}</text>
					</view>
				</view>
			</view>
			<wd-toast />
		</scroll-view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import NavbarDefault from "@/components/navbar/default.vue"
	import $http from "@/api/index.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'

	const toast = useToast()
	const sectionList = ref([])

	// 定义一套配色方案（背景色 + 图标色），循环使用
	const colorPalette = [{
			bg: '#FFF7ED',
			color: '#F97316'
		}, // Orange
		{
			bg: '#F3F0FF',
			color: '#7C3AED'
		}, // Purple
		{
			bg: '#EFF6FF',
			color: '#3B82F6'
		}, // Blue
		{
			bg: '#ECFDF5',
			color: '#10B981'
		}, // Green
		{
			bg: '#FEF2F2',
			color: '#EF4444'
		}, // Red
		{
			bg: '#ECFEFF',
			color: '#06B6D4'
		}, // Cyan
		{
			bg: '#FFF1F2',
			color: '#F43F5E'
		}, // Rose
		{
			bg: '#FAF5FF',
			color: '#8B5CF6'
		} // Violet
	]

	// 图标映射
	const iconMap = {
		'问候': 'fas fa-handshake',
		'住宿': 'fas fa-bed',
		'交通': 'fas fa-subway',
		'用餐': 'fas fa-utensils',
		'购物': 'fas fa-shopping-cart',
		'旅游': 'fas fa-plane',
		'其他': 'fas fa-ellipsis-h',
		'default': 'fas fa-book-open'
	}

	const getIconClass = (name) => {
		for (const key in iconMap) {
			if (name.includes(key)) return iconMap[key]
		}
		return iconMap['default']
	}

	const getSections = async () => {
		try {
			const res = await $http.word.getSpokenSection()
			if (res.data && Array.isArray(res.data)) {
				sectionList.value = res.data.map((name, index) => {
					// 循环获取配色
					const palette = colorPalette[index % colorPalette.length]
					return {
						id: index + 1,
						name: name,
						icon: getIconClass(name),
						bgColor: palette.bg,
						iconColor: palette.color
					}
				})
			}
		} catch (error) {
			console.error("获取章节失败:", error)
			toast.error('获取章节失败')
		}
	}

	const goCategory = (item) => {
		uni.navigateTo({
			url: `/pages/tools/dailytalk/category?sid=${item.id}&title=${item.name}`
		})
	}

	onMounted(() => {
		getSections()
	})
</script>

<style>
	page {
		background-color: #f5f7fa;
		height: 100vh;
		overflow: hidden;
	}
</style>

<style lang="scss" scoped>
	.page-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #f5f7fa;
	}

	.fixed-header {
		background-color: #ffffff;
		z-index: 10;
		flex-shrink: 0;
	}

	.scroll-content {
		flex: 1;
		height: 0;
		overflow: hidden;
		padding: 24rpx;
		box-sizing: border-box;
	}

	/* 网格布局 */
	.section-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 24rpx;

		.section-item {
			background-color: #fff;
			border-radius: 24rpx;
			padding: 24rpx;
			display: flex;
			align-items: center;
			gap: 24rpx;
			/* 去除阴影，保持扁平 */

			&:active {
				background-color: #F9FAFB;
			}

			.section-icon-bg {
				width: 80rpx;
				height: 80rpx;
				border-radius: 20rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 36rpx;
				flex-shrink: 0;
			}

			.section-info {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				overflow: hidden;

				.section-title {
					font-size: 28rpx;
					font-weight: 600;
					color: #1F2937;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				/* 预留副标题样式 */
				/* .section-desc {
					font-size: 22rpx;
					color: #9CA3AF;
					margin-top: 4rpx;
				} */
			}
		}
	}
</style>