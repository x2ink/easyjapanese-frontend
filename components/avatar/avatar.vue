<template>
	<view v-if="!isLoadedSuccess" :style="placeholderStyle" class="placeholder-box _GCENTER">
		<text>默认</text>
	</view>
	<image v-show="isLoadedSuccess" :src="props.src" :class="{radius: props.radius}"
		:style="{width: props.size + 'rpx', height: props.size + 'rpx'}" @error="handleImageError"
		@load="handleImageLoad" mode="aspectFill"></image>
</template>

<script setup>
	import {
		ref,
		computed
	} from "vue"
	const props = defineProps({
		src: {
			type: String,
			default: ""
		},
		size: {
			type: [Number, String],
			default: 80
		},
		radius: {
			default: true,
			type: Boolean
		}
	})
	const isLoadedSuccess = ref(false)
	const handleImageLoad = () => {
		isLoadedSuccess.value = true
	}

	const handleImageError = (e) => {
		console.error("图片加载失败:", e.detail.errMsg)
		isLoadedSuccess.value = false
	}
	const placeholderStyle = computed(() => ({
		width: props.size + 'rpx',
		height: props.size + 'rpx',
		borderRadius: props.radius ? '50%' : '0', // 应用圆角
	}))
</script>

<style lang="scss" scoped>
	.radius {
		border-radius: 50%;
	}

	.placeholder-box {
		font-size: 24rpx;
		color: #07C160;
		background-color: #f0f0f0;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;

		text {
			width: 50rpx;
			white-space: normal;
			flex-shrink: 0;
			text-align: center;
		}
	}
</style>