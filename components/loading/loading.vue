<template>
	<view style="height: 100vh;width: 100vw;background-color: white;">
		<view style="width: 100vw;height: 90vh;" class="_GCENTER">
			<view class="loader-110">Loading</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "loading",
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	@keyframes animloader110 {
		0% {
			height: 100%;
		}

		100% {
			height: 0%;
		}
	}

	.loader-110 {
		position: relative;
		font-size: 48px;
		font-family: Arial, Helvetica, sans-serif;
		font-weight: bold;
		color: #90cf5b;
		letter-spacing: 2px;

		&::after {
			content: "Loading";
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			color: #FFF;
			text-shadow: 0 0 2px #90cf5b, 0 0 1px #90cf5b, 0 0 1px #90cf5b;
			overflow: hidden;
			-webkit-animation: animloader110 2s linear infinite;
			animation: animloader110 2s linear infinite;
		}
	}
</style>