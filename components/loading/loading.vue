<template>
	<view class="loading">
		<wd-loading size="50px" />
		<text>努力加载中</text>
	</view>
</template>

<script>
</script>

<style scoped lang="scss">
	.loading {
		height: 100vh;
		flex-direction: column;
		display: flex;
		align-items: center;
		margin-top: 100px;

		text {
			font-size: 14px;
			margin-top: 10px;
			color: $uni-text-color-grey;
		}
	}
</style>