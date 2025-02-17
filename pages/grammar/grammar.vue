<template>
	<view>
		<NavBar title="语法学习" style="background-color:#F3F3F5;">
			<template #bottom>
				<wd-tabs slidable custom-class="tabs" v-model="current">
					<block v-for="(item,index) in tabList" :key="item">
						<wd-tab :title="item.name">
						</wd-tab>
					</block>
				</wd-tabs>
			</template>
			<template #right>
				<SearchInput @change="inputChange"></SearchInput>
			</template>
		</NavBar>
		<view class="list">
			<view class="item" @click="goPage('grammardetail','?id='+item.id)" :key="item.id" v-for="item in grammars">
				<wd-text style="flex: 1;" size="14px" :lines="1" color="#000" :text="item.grammar"></wd-text>
				<wd-tag custom-class="space" color="#0083ff" bg-color="#d0e8ff"
					v-if="item.level=='N1'">{{item.level}}</wd-tag>
				<wd-tag custom-class="space" color="#57D09B" bg-color="#D0F4E5" v-else-if="item.level=='N2'" type="primary">{{item.level}}</wd-tag>
				<wd-tag custom-class="space" color="#f5222d" bg-color="#FAC8C8" v-else-if="item.level=='N3'" type="danger">{{item.level}}</wd-tag>
				<wd-tag custom-class="space" color="#E78938" bg-color="#F5D6B9" v-else-if="item.level=='N4'" type="warning">{{item.level}}</wd-tag>
				<wd-tag custom-class="space" color="#13c2c2" bg-color="#A6E6E6" v-else-if="item.level=='N5'" type="success">{{item.level}}</wd-tag>
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
	import NavBar from '@/components/navbar.vue'
	import SearchInput from '@/components/searchinput.vue'
	const tabList = ref([{
		name: 'N1'
	}, {
		name: 'N2'
	}, {
		name: 'N3'
	}, {
		name: 'N4'
	}, {
		name: 'N5'
	}])
	const current = ref(0)
	const List = ref([])
	const value = ref('')
	const inputChange = (e) => {
		value.value = e
	}
	const goPage = (path, params) => {
		if (params) {
			uni.navigateTo({
				url: `/pages/${path}/${path}${params}`
			})
		} else {
			uni.navigateTo({
				url: `/pages/${path}/${path}`
			})
		}
	}
	const grammars = computed(() => {
		if (value.value == "" || value.value.length == 0) {
			return List.value.filter(item => item.level == tabList.value[current.value].name)
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
	:deep(.space) {
		margin-left: 10px;
		padding: 2px 8px;
		border-radius: 4px;
	}

	:deep(.wd-tabs) {
		background-color: transparent;
	}

	:deep(.wd-tabs__nav) {
		background-color: transparent;
	}

	.list {
		padding: 0 10px;
		margin-top: 10px;
		display: flex;
		flex-direction: column;
		gap: 10px;

		.item {
			border-radius: 8px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 50px;
			background-color: white;
			padding: 0 10px;
			box-sizing: border-box;
		}
	}

	:deep(.search) {
		width: 200px;
		padding-right: 0 !important;
	}
</style>