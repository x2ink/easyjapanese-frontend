<template>
	<view>
		<view class="search">
			<wd-icon name="search" size="22px" color="#979797"></wd-icon>
			<input placeholder="搜索" />
		</view>
		<view class="day">
			你已经坚持了<span>99天</span><span>加油！！！</span>
		</view>
		<view class="recite">
			<view>
				<p>大学日语四级</p>
				<view>
					<p>
						修改计划
					</p>
					<wd-icon name="arrow-right" size="22px"></wd-icon>
				</view>
			</view>
			<view>
				<view>
					<p>等待复习</p>
					<p>100</p>
				</view>
				<view>
					<p>等待复习</p>
					<p>100</p>
				</view>
			</view>
			<wd-progress :percentage="30" hide-text />
			<view>
				<p><span>50</span>/<span>100</span></p>
				<wd-button plain size="small">词汇列表</wd-button>
			</view>
			<view>
				<wd-button type="info">记忆复习</wd-button>
				<wd-button>开始学习</wd-button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	const searchVal = ref('')
	const search = (e) => {
		console.log(e);
	}
</script>

<style lang="scss">
	:deep(.wd-progress__outer) {
		height: 10px !important;
		border-radius: 10px !important;
		overflow: hidden;
	}

	.search {
		height: 45px;
		background: white;
		margin: 15px;
		padding: 10px;
		font-size: $uni-font-size-lg;
		box-sizing: border-box;
		border-radius: 45px;
		display: flex;
		align-items: center;

		input {
			margin-left: 10px;
		}
	}

	.recite {
		padding: 10px;
		border-radius: $uni-border-radius-base;
		background-color: white;
		margin: 15px;
		box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
	}
</style>