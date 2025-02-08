<template>
	<view>
		<wd-input prefix-icon="search" custom-class="search" confirm-type="search" no-border type="text" v-model="value"
			placeholder="请输入单词或假名" @input="onChange" @confirm="emits('confirm')" />
	</view>
</template>

<script setup>
	import {
		ref,
	} from 'vue'
	const emits = defineEmits(['confirm'])
	const onChange = (event) => {
		emits('change', event.value);
	};
</script>

<style scoped lang="scss">
	.search {
		background-color: #f5f5f5;
		padding: 5px 10px;
		margin-left: 5px;
		box-sizing: border-box;
		border-radius: 34px;
	}

	:deep(.wd-input__icon) {
		background: transparent !important;
	}
</style>