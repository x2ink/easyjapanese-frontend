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
	<view class="wordlist">
		<view class="worditem" v-for="_ in 10">
			<view class="head">
				<p>这是单词/piny</p>
				<wd-icon name="sound" size="22px"></wd-icon>
			</view>
			<wd-text size="14px" lines="2" class="body" color="#999" text="【名词】这是名称"></wd-text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
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
	const changeSearchType = (e) => {
		console.log(e);
	}
</script>

<style scoped lang="scss">
	.wordlist {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 10px;

		.worditem {
			background-color: white;
			padding: 10px;
			border-radius: $uni-border-radius-base;

			.body {
				margin-top: 5px;
			}

			.head {
				display: flex;
				align-items: center;
				justify-content: space-between;

				p {
					font-weight: bold;
					font-size: 17px;
				}
			}
		}
	}

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