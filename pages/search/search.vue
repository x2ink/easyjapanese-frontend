<template>
	<Navbar>
		<template v-slot:center>
			<wd-search focus placeholder="请输入单词或语法" cancel-txt="搜索" custom-class="search" v-model="value">
				<template #prefix>
					<wd-popover mode="menu" :content="menu" @menuclick="changeSearchType">
						<view class="search-type">
							<text>{{ searchType }}</text>
							<wd-icon custom-class="icon-arrow" name="fill-arrow-down"></wd-icon>
						</view>
					</wd-popover>
				</template>
			</wd-search>
		</template>
	</Navbar>
	<view class="title">
		<p>搜索历史</p>
		<wd-icon name="clear" size="20px" color="#999" />
	</view>
	<!-- 历史记录 -->
	<view class="history">
		<span class="item">
			这是历史
		</span>
		<span class="more">
			<wd-icon size="18px" name="chevron-down" color="#000" />
		</span>
	</view>
	<view>
		<wd-status-tip image="search" tip="没有搜索到结果" />
	</view>
	<!-- 列表 -->
	<WordList></WordList>
	<!--  -->
	<wd-action-sheet :z-index="4" cancel-text="取消" v-model="activeShow" :actions="actions" />
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import WordList from "@/components/wordlist.vue"
	import Navbar from "@/components/navbar.vue"
	const searchType = ref('全部')
	const value = ref('')
	const menu = ref([{
			content: '全部'
		},
		{
			content: '单词'
		},
		{
			content: '语法'
		}
	])
	const activeShow = ref(false)
	const actions = ref([{
			name: '选项1'
		},
		{
			name: '选项2'
		},
		{
			name: '选项3'
		}
	])
	const changeSearchType = (e) => {
		console.log(e);
	}
</script>

<style scoped lang="scss">
	.title {
		padding: 10px 15px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.history {
		padding: 0 15px;
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	:deep(.wd-search__cover) {
		background-color: #EFEFEF;
	}

	:deep(.wd-search__search-left-icon) {
		color: var(--wot-search-icon-color, var(--wot-color-icon, #d9d9d9)) !important;
		z-index: 9 !important;
	}

	:deep(.wd-search__input) {
		background-color: #EFEFEF;
		border-radius: var(--wot-search-input-radius, 15px);
	}

	.history {
		span {
			background-color: #EFEFEF;
		}

		.item {
			font-size: $uni-font-size-sm;
			line-height: 28px;
			padding: 0 15px;
			border-radius: 28px;
		}

		.more {
			border-radius: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 28px;
			width: 28px;
		}
	}

	.search {
		background-color: transparent !important;
	}
</style>