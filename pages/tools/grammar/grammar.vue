<template>
	<view>
		<Navbar>
			<template #left>
				<wd-popover mode="menu" :content="menu" @menuclick="changeSearchType">
					<view class="search-type">
						<text>{{ current }}语法</text>
						<wd-icon custom-class="icon-arrow" name="fill-arrow-down"></wd-icon>
					</view>
				</wd-popover>
			</template>
		</Navbar>
		<SearchInput @confirm="search" @change="inputChange">
		</SearchInput>
		<view class="list">
			<view class="item" @click="goPage('/pages/tools/grammardetail/grammardetail',{id:item.id})" :key="item.id"
				v-for="item in grammars">
				<wd-text style="flex: 1;" size="16px" :lines="1" color="#000" :text="item.grammar"></wd-text>
				<wd-tag :color="tagColor.get(item.level).color" :bg-color="tagColor.get(item.level).bgcolor" custom-class="space">{{item.level}}</wd-tag>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		watch,
		computed
	} from 'vue'
	import $http from "@/api/index.js"
	import Navbar from '@/components/navbar/navbar.vue';
	import SearchInput from '@/components/searchinput/searchinput.vue'
	import {
		goPage,tagColor
	} from "@/utils/common.js"
	const current = ref('N1')
	const changeSearchType = (e) => {
		current.value = e.item.content
	}
	const menu = ref([{
			content: 'N1'
		},
		{
			content: 'N2'
		},
		{
			content: 'N3'
		},
		{
			content: 'N4'
		},
		{
			content: 'N5'
		}
	])
	const List = ref([])
	const value = ref('')
	const inputChange = (e) => {
		value.value = e
	}
	const grammars = computed(() => {
		if (value.value == "" || value.value.length == 0) {
			return List.value.filter(item => item.level == current.value)
		} else {
			return List.value.filter(item => item.grammar.indexOf(value.value) >= 0)
		}
	})
	const getList = async () => {
		const res = await $http.common.getGrammarList()
		List.value = res.data
	}

	onMounted(() => {
		getList()
	})
</script>

<style scoped lang="scss">
	:deep(.search) {
		flex: 1;
		background-color: #fff;
		padding: 7px 10px;
		box-sizing: border-box;
		border-radius: 38px;
		margin: 0 15px;
	}

	:deep(.space) {
		margin-left: 10px;
		padding: 2px 8px;
		border-radius: 4px;
	}

	.list {
		padding: 0 15px 15px 15px;
		margin-top: 15px;
		display: flex;
		flex-direction: column;
		gap: 15px;

		.item {
			border-radius: 8px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 60px;
			background-color: white;
			padding: 0 15px;
			box-sizing: border-box;
		}
	}
</style>