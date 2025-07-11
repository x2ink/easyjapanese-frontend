<template>
	<view>
		<view class="head">
			<NavbarDefault border title="关于我们"></NavbarDefault>
		</view>
		<!-- 主要内容 -->
		<div class="main-content">
			<!-- 应用信息卡片 -->
			<div class="app-card">
				<image src="http://jp.x2.ink/images/logo.png" mode="aspectFit" class="app-logo"></image>
				<div class="app-name">轻松日语</div>
				<div class="app-version">版本 {{version}}</div>
				<div class="app-desc">
					专注于日语学习的背单词工具，帮助您高效掌握日语词汇，从N5到N1轻松进阶。
				</div>
			</div>

			<!-- 官方网站 -->
			<div class="info-item">
				<div class="info-title">
					<span>官方网站</span>
				</div>
				<div class="info-content">
					<a href="https://www.x2.ink" class="info-link">www.x2.ink</a>
				</div>
			</div>

			<!-- 社交账号 -->
			<div class="info-item">
				<div class="info-title">
					<span>关注公众号</span>
				</div>
				<div class="info-content">
					获取最新学习资源和活动信息
				</div>
			<!-- 	<div class="social-icons">
					<a href="#" class="social-icon"><i class="fab fa-weixin"></i></a>
					<a href="#" class="social-icon"><i class="fab fa-qq"></i></a>
					<a href="#" class="social-icon"><i class="fab fa-tiktok"></i></a>
					<a href="#" class="social-icon"><i class="fab fa-bilibili"></i></a>
				</div> -->
			</div>

			<!-- 法律条款 -->
			<div class="info-item"
				@click="goPage('/pages/other/browse/browse',{src:'https://www.yuque.com/xiaoerwangluo/pteeim/ht003yxzz0egvmke'})">
				<div class="info-title">
					<span>服务条款</span>
					<i class="fas fa-chevron-right arrow-icon"></i>
				</div>
			</div>
			<!-- 更新日志 -->
			<div class="info-item"
				@click="goPage('/pages/other/browse/browse',{src:'https://www.yuque.com/xiaoerwangluo/pteeim/ukw6hnx82vfrgg4g'})">
				<div class="info-title">
					<span>更新日志</span>
					<i class="fas fa-chevron-right arrow-icon"></i>
				</div>
			</div>

			<!-- 备案信息 -->
			<div class="info-item">
				<div class="info-title">
					<span>备案信息</span>
				</div>
				<div class="info-content">
					京ICP备2023000000号-1
				</div>
			</div>
		</div>

		<!-- 底部版权信息 -->
		<div class="footer-info">
			Copyright © 2023-2025 小二网络.All Rights Reserved
		</div>
	</view>
</template>

<script setup>
	import {
		ref,
	} from 'vue'
	import {
		onLoad,
	} from "@dcloudio/uni-app"
	import {
		goPage,
	} from "@/utils/common.js"
	import NavbarDefault from "@/components/navbar/default"
	import $http from "@/api/index.js"
	import {
		useToast
	} from '@/uni_modules/wot-design-uni'
	const toast = useToast()
	const version = uni.getSystemInfoSync().appVersion
</script>
<style>
	page {
		background-color: white;
	}
</style>
<style lang="scss" scoped>
	.head {
		position: sticky;
		top: 0;
		z-index: 9;
	}

	/* 主要内容区 */
	.main-content {
		flex: 1;
		overflow-y: auto;
		padding: 16px;
	}

	/* 应用信息卡片 */
	.app-card {
		padding: 24px 16px;
		margin-bottom: 16px;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.app-logo {
		width: 80px;
		height: 80px;
		border-radius: 16px;
		margin-bottom: 16px;
	}

	.app-name {
		font-size: 18px;
		font-weight: 600;
		color: #212121;
		margin-bottom: 4px;
	}

	.app-version {
		font-size: 14px;
		color: #757575;
		margin-bottom: 16px;
	}

	.app-desc {
		font-size: 14px;
		color: #424242;
		line-height: 1.5;
		max-width: 80%;
	}

	/* 信息列表项 */
	.info-item {
		padding: 16px;
		border-bottom: 1px solid #eee;
	}

	.info-title {
		font-size: 15px;
		font-weight: 500;
		color: #212121;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.info-content {
		font-size: 14px;
		color: #757575;
		line-height: 1.5;
	}

	.info-link {
		color: #07C160;
		text-decoration: none;
	}

	/* 社交账号 */
	.social-icons {
		display: flex;
		justify-content: center;
		margin-top: 12px;
	}

	.social-icon {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background-color: #f5f5f5;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 8px;
		color: #07C160;
		font-size: 16px;
	}

	/* 底部信息 */
	.footer-info {
		text-align: center;
		padding: 16px;
		padding-bottom: calc(env(safe-area-inset-bottom) + 16px);
		font-size: 12px;
		color: #9E9E9E;
		line-height: 1.5;
	}

	/* 箭头图标 */
	.arrow-icon {
		color: #9E9E9E;
		font-size: 12px;
	}
</style>