<template>
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

<script>
</script>

<style lang="scss" scoped>
	.wordlist {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 0 10px 10px 10px;

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
</style>