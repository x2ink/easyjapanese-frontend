<template>
	<wd-popup v-model="show" closable custom-style="border-radius:8px;" @close="handleClose">
		<view class="popup">
			<p class="title">修改计划</p>
			<view class="daystudy">
				<p>每日学习：{{dayStudy}}</p>
				<wd-input-number v-model="dayStudy" @change="handleChange" without-input />
			</view>
			<wd-radio-group v-model="studyMode" checked-color="#fa4350">
				<wd-radio value="1">不背模式</wd-radio>
				<wd-radio value="2">刷词模式</wd-radio>
			</wd-radio-group>
			<wd-button style="width: 100%;margin-top: 15px;">保存修改</wd-button>
		</view>
	</wd-popup>
</template>

<script setup>
	import {
		ref
	} from "vue"
	const show = ref(false)
	const dayStudy = ref(10)
	const studyMode = ref("1")
	defineExpose({
		show
	})
	const handleChange = (e) => {
		console.log(e);
	}
</script>

<style lang="scss" scoped>
	.popup {
		width: 240px;
		padding: 15px;

		.title {
			text-align: center;
		}

		.daystudy {
			height: 50px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: $uni-font-size-base;
		}
	}
</style>