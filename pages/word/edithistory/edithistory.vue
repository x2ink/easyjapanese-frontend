<template>
	<view>
		<Navbar title="编辑历史">
		</Navbar>
		<view class="readlist">
			<view class="userread" v-for="(item,index) in List" :key="item.id">
				<view class="right">
					<view class="userinfo">
						<uv-avatar size="40" :src="item.user.avatar"></uv-avatar>
						<view class="text">
							<text>{{item.user.nickname}}</text>
							<text>{{item.comment}}</text>
						</view>
					</view>
				</view>
				<view class="left _GCENTER">
					<text>{{dayjs().to(dayjs(item.time))}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import Navbar from '@/components/navbar/navbar.vue';
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import dayjs from 'dayjs'
	import relativeTime from 'dayjs/plugin/relativeTime'
	import 'dayjs/locale/zh'
	dayjs.locale('zh')
	dayjs.extend(relativeTime)
	import $http from "@/api/index.js"
	const List = ref([])
	const getList = async (id) => {
		const res = await $http.word.getEditWord(id)
		List.value = res.data
	}
	onLoad((op) => {
		getList(op.id)
	})
</script>

<style scoped lang="scss">
	.readlist {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin: 10px;
		padding-bottom: calc(env(safe-area-inset-bottom) + 80px);

		.userread {
			background-color: white;
			border-radius: 8px;
			display: flex;
			padding: 15px;
			align-items: center;
			justify-content: space-between;

			.left {
				color: #999;
				font-size: 14px;
			}

			.right {
				display: flex;
				align-items: center;
				gap: 10px;

			
				.userinfo {
					display: flex;
					align-items: center;
					gap: 10px;

					.text {
						display: flex;
						flex-direction: column;

						text {
							&:nth-of-type(1) {
								font-size: 14px;
							}

							&:nth-of-type(2) {
								font-size: 12px;
								color: #999;
								margin-top: 3px;
							}
						}
					}

				}
			}
		}
	}
</style>