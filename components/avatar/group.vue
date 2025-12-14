<template>
	<view class="avatar-group-container">
		<view v-for="(url, index) in visibleAvatarUrls" :key="index" class="avatar-item"
			:style="[
				avatarStyle, 
				{
					zIndex: max - index, 
					marginRight: index < visibleAvatarUrls.length - 1 ? `-${gapSize}rpx` : '0'
				}
			]"
		>
			<Avatar :src="url" :size="size" :radius="true" class="avatar-inner" />
		</view>

		<view v-if="hiddenCount > 0" class="avatar-item overflow-count" 
			:style="[
				avatarStyle, 
				{
					zIndex: 0,
					marginRight: '0' 
				}
			]"
		>
			<text class="overflow-text">{{ `+${hiddenCount}` }}</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from "vue"
	import Avatar from "@/components/avatar/avatar.vue"

	const props = defineProps({
		urls: {
			type: Array,
			default: () => []
		},
		size: {
			type: [Number, String],
			default: 80
		},
		gap: {
			type: [Number, String],
			default: 20
		},
		max: {
			type: [Number, String],
			default: 5
		}
	})

	const maxCount = computed(() => Number(props.max))
	const avatarSize = computed(() => Number(props.size))
	const gapSize = computed(() => Number(props.gap))

	const visibleAvatarUrls = computed(() => {
		if (props.urls.length <= maxCount.value) {
			return props.urls
		}
		return props.urls.slice(0, maxCount.value - 1)
	})
	
	const hiddenCount = computed(() => {
		return props.urls.length - visibleAvatarUrls.value.length
	})
	
	const avatarStyle = computed(() => ({
		width: `${avatarSize.value}rpx`,
		height: `${avatarSize.value}rpx`,
		borderRadius: '50%',
	}))
</script>

<style lang="scss" scoped>
	.avatar-group-container {
		display: flex;
		flex-direction: row;
		align-items: center; 
	}

	.avatar-item {
		display: block;
		overflow: hidden;
		box-sizing: border-box;
	
		.avatar-inner {
			display: block;
		}
	}

	.overflow-count {
		background-color: #909399;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.overflow-text {
		color: #FFFFFF;
		font-size: 20rpx;
	}
</style>