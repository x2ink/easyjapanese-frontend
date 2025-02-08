<template>
	<view style="min-height:100vh ;background-color: #f5f5f5;">
		<NavBar title="语法学习" style="background-color: white;">
			<template #bottom>
				<view style="background-color: white;padding:0 10px 10px 10px;">
					<wd-segmented customClass="segmented" :options="section" v-model:value="current"></wd-segmented>
				</view>
			</template>
			<template #right>
				<wd-search custom-class="search" v-model="value" focu maxlength="10" hide-cancel />
			</template>
		</NavBar>
		<view class="list">
			<view class="item" @click="goPage('grammardetail','?id='+item.id)" :key="item.id" v-for="item in grammars">
				<text>{{item.grammar}}</text>
				<wd-tag custom-class="space" v-if="item.level=='N1'">{{item.level}}</wd-tag>
				<wd-tag custom-class="space" v-else-if="item.level=='N2'" type="primary">{{item.level}}</wd-tag>
				<wd-tag custom-class="space" v-else-if="item.level=='N3'" type="danger">{{item.level}}</wd-tag>
				<wd-tag custom-class="space" v-else-if="item.level=='N4'" type="warning">{{item.level}}</wd-tag>
				<wd-tag custom-class="space" v-else-if="item.level=='N5'" type="success">{{item.level}}</wd-tag>
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
	const section = ref(['N1', 'N2', 'N3', 'N4', 'N5'])
	const current = ref('N1')
	const List = ref([])
	const value = ref('')
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
	:deep(.space) {
		margin-left: 10px;

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