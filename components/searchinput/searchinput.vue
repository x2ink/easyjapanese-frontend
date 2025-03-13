<template>
	<view class="root">
		<slot name="prefix"></slot>
		<wd-input prefix-icon="search" custom-class="search" confirm-type="search" no-border type="text"
			:placeholder="placeholder" @input="onChange" @confirm="emits('confirm')" />
	</view>
</template>

<script setup>
	import {
		ref,
	} from 'vue'
	const props = defineProps({
		placeholder: {
			type: String,
			default: "请输入单词或假名"
		}
	})
	const emits = defineEmits(['confirm'])
	const onChange = (event) => {
		emits('change', event.value);
	};
</script>

<style scoped lang="scss">
	.root {
		display: flex;
		align-items: center;
	}

	:deep(.wd-input__icon) {
		background: transparent !important;
	}
</style>