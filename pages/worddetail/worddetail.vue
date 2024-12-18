<template>
	<NavBar title="" style="background-color: #F6F6F6;">
		<template #right>
			<wd-icon @click="moreShow=true" name="ellipsis" size="30px"></wd-icon>
		</template>
	</NavBar>
	<view class="wordinfo">
		<p class="word jpfont">負かる</p>
		<view class="hira jpfont">
			<span>まかる</span>|
			<span>マカル</span>|
			<span>makaru</span>|
			<span>動詞</span>
		</view>
		<view class="tools">
			<view>
				<wd-icon name="sound" size="20" />
				<text>发音</text>
			</view>
			<view>
				<wd-icon name="service" size="20" />
				<text>跟读</text>
			</view>
			<view>
				<wd-icon name="edit" size="20" />
				<text>手写</text>
			</view>
			<view>
				<wd-icon name="tips" size="20" />
				<text>变形</text>
			</view>
		</view>
		<wd-divider style="padding: 0;">详细解释</wd-divider>
		<view class="meanings">
			<view v-for="_ in 2">
				<view class="meaningtext">
					1.超过规定时间
				</view>
				<view class="meaning">
					<wd-tag type="primary">中文</wd-tag>
					<view class="text">
						超过规定时间;<br>在某事进行过程中到了规定的时间;
					</view>
				</view>
				<view class="meaning">
					<wd-tag type="warning">日本語</wd-tag>
					<view class="text jpfont">
						時間切れ[ジカンギレ];<br>事の途中で予定した時間がなくなってしまうこと;
					</view>
				</view>
				<view class="meaning">
					<wd-tag type="success">English</wd-tag>
					<view class="text">
						Exceeding the specified time;<br>
						During the process of something, the designated time has been reached;
					</view>
				</view>
			</view>
		</view>
		<wd-divider style="padding: 0;">相关例句</wd-divider>
		<view class="examples">
			<view class="example" v-for="_ in 5">
				<view class="ja jpfont">
					<view class="worditem" v-for="item in worditem">
						<view class="top">{{item.top}}</view>
						<view :class="{underline:item.top}" class="body">{{item.body}}</view>
					</view>
				</view>
				<view class="ch">
					我们也差不多到时间了。
				</view>
				<view class="operate">
					<wd-icon name="sound" size="20" color="#909699" />
					<wd-icon name="file-copy" size="20" color="#909699" />
				</view>
			</view>
		</view>
		<!-- 责任声明 -->
		<view class="statement _GCENTER">
			本APP词典数据源自日本公开网络<br>若有侵权请联系删除。
		</view>
	</view>
	<wd-action-sheet :safe-area-inset-bottom="false" cancel-text="取消" v-model="moreShow" :actions="actions"
		@close="moreShow=false" @select="select" />
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import NavBar from '@/components/navbar.vue'
	const moreShow = ref(false)
	const actions = ref([{
			name: '单词纠错'
		},
		{
			name: '加入单词本'
		}
	])
	const worditem = ref([{
		top: "われわれ",
		body: "我々"
	}, {
		top: "",
		body: "はもうそろそろ"
	}, {
		top: "じかんぎれ",
		body: "時間切れ"
	}, {
		top: "",
		body: "だ。"
	}])
</script>

<style lang="scss" scoped>
	.statement {
		height: 60px;
		text-align: center;
		font-size: $uni-font-size-sm;
		color: $uni-text-color-grey;
		padding: 40px 0;
	}

	.examples {
		display: flex;
		flex-direction: column;
		gap: 10px;

		.example {
			background-color: white;
			border-radius: $uni-border-radius-base;
			padding: 10px;

			.operate {
				display: flex;
				gap: 5px;
				margin-top: 10px;
				justify-content: flex-end;
			}

			.ch {
				font-size: $uni-font-size-base;
				color: $uni-text-color-grey;
				background-color: $uni-bg-color-grey;
				border-radius: $uni-border-radius-base;
				padding: 5px 10px;
				margin-top: 10px;
			}

			.ja {
				display: flex;
				flex-wrap: wrap;

				.worditem {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					.top {
						font-size: 12px;
						height: 12px;
					}

					.body {}

					.underline {
						text-decoration: underline;
					}
				}
			}
		}
	}

	.wordinfo {
		padding: 0 15px;

		.tools {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: 10px;

			>view {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				height: 60px;
				background-color: white;
				border-radius: $uni-border-radius-base;
				margin: 10px 0;

				text {
					font-size: $uni-font-size-sm;
				}
			}
		}

		.meanings {
			margin-top: 10px;
			display: flex;
			flex-direction: column;
			gap: 3px;
			background-color: white;
			border-radius: $uni-border-radius-base;
			padding: 10px;

			.meaningtext {
				font-size: $uni-font-size-lg;
				font-weight: bold;
			}

			.meaning {
				.text {
					font-size: $uni-font-size-base;
				}
			}
		}

		.word {
			font-size: 30px;
			text-align: center;
			font-weight: bold;
		}

		.hira {
			display: flex;
			justify-content: center;
			gap: 5px;
			color: $uni-text-color-grey;
		}
	}
</style>