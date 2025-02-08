<template>
	<view class="wrap">
		<NavBar color="#ffffff">
			<template #bottom>
				<view class="intro">
					<view class="icon">
						<image src="/static/yfxx.png" mode="aspectFill"></image>
						<view class="mask _GCENTER">
							<wd-icon color="#ffffff" name="play-circle-stroke" size="35px"></wd-icon>
						</view>
					</view>
					<view class="name">
						<text>日语电台</text>
						<text>收听最受欢迎的日本广播</text>
					</view>
				</view>
			</template>
		</NavBar>
		<image src="/static/xxdt.png" mode="widthFix" class="bg"></image>
		<scroll-view scroll-y="true" class="content">
			<view>
				<view class="play">
					<view class="btn _GCENTER">
						<wd-icon name="play" size="30px" color="#ffffff"></wd-icon>
					</view>
					<text>全部播放(10)</text>
				</view>
				<view class="list">
					<view class="item" v-for="_ in 10">
						<view class="head">
							<text>1.</text>
							<wd-text lines="1" color="#00000"
								text="芦叶满汀洲，寒沙带浅流。二十年重过南楼。柳下系船犹未稳，能几日，又中秋。黄鹤断矶头，故人曾到否？旧江山浑是新愁。欲买桂花同载酒，终不似，少年游。"></wd-text>
						</view>
						<view class="body">
							<view class="tool">
								<wd-icon color="#999" name="play-circle-stroke" size="18px"></wd-icon>
								<text>1558</text>
							</view>
							<view class="tool">
								<wd-icon color="#999" name="time" size="18px"></wd-icon>
								<text>1558</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="audio _GCENTER">
			<sy-audio style="width: 100%;background-color: white;" isCountDown ref="audio" src='' audioCover=''
				subheading='' audioTitle=''></sy-audio>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import NavBar from '@/components/navbar.vue'
</script>

<style scoped lang="scss">
	.audio {
		height: 80px;
		position: fixed;
		left: 15px;
		right: 15px;
		bottom: 0;
		z-index: 9;
	}

	.intro {
		padding: 10px 20px;
		display: flex;
		align-items: center;
		gap: 15px;

		.name {
			display: flex;
			flex-direction: column;
			gap: 10px;

			text {
				color: white;

				&:nth-of-type(1) {
					font-size: 18px;
					font-weight: bold;
				}

				&:nth-of-type(2) {
					font-size: 14px;
				}
			}
		}

		.icon {
			width: 100px;
			height: 100px;
			position: relative;
			border-radius: 8px;
			overflow: hidden;

			image {
				width: 100px;
				height: 100px;
			}

			.mask {
				top: 0;
				width: 100px;
				height: 100px;
				position: absolute;
				background-color: rgba(0, 0, 0, 0.5);
			}
		}
	}



	.wrap {
		min-height: 100vh;
		background-color: #f5f5f5;
		position: relative;
	}

	.bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		filter: blur(5px) brightness(0.8) contrast(1.2);
		right: 0;
	}

	.content {
		padding: 15px;
		box-sizing: border-box;
		border-radius: 20px 20px 0 0;
		background-color: white;
		height: 76vh;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;

		.list {
			margin-top: 10px;
			padding-bottom: 80px;

			.item {
				padding: 15px 0;
				border-bottom: 1px #f5f5f5 solid;

				.body {
					margin-top: 10px;
					display: flex;
					align-items: center;
					gap: 30px;

					.tool {
						display: flex;
						align-items: center;
						gap: 5px;

						text {
							font-size: 12px;
							color: #999;
						}
					}
				}

				.head {
					display: flex;
					align-items: center;
					gap: 10px;
				}
			}
		}

		.play {
			display: flex;
			align-items: center;
			gap: 10px;

			.btn {
				width: 35px;
				height: 35px;
				border-radius: 100%;
				background-color: #5880F2;
			}
		}
	}
</style>