<template>
	<div class="language-tabs">
		<view @click="emits('changeTab', index)" :key="item" v-for="(item,index) in tabList"
			:class="{active:current==index,inactive:current!=index}" class="search-tab">
			{{item}}
		</view>
	</div>
</template>

<script setup>
	import {
		ref,
		defineProps,
		onMounted
	} from "vue";
	const emits = defineEmits(["changeTab"]);
	const props = defineProps({
		tabList: {
			default: [],
			type: Array
		},
		current: {
			default: 0,
			type: Number
		}
	})
</script>

<style lang="scss">
	.language-tabs {
		display: flex;
		align-items: center;
	}

	.search-tab {
		padding: 6px 12px;
		border-radius: 16px;
		font-size: 14px;
		margin-right: 8px;
		border: none;
		cursor: pointer;
	}

	.search-tab.active {
		background-color: #07C160;
		color: white;
	}

	.search-tab.inactive {
		background-color: #f0f0f0;
		color: #757575;
	}
</style>