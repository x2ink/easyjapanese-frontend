<template>
	<view>
		<Navbar title="关于我们"></Navbar>
		<view style="text-align: center;margin-top: 20px;">
			<image src="http://jp.x2.ink/images/logo.png" style="width: 70px;height: 70px;" />
			<h4 style="margin-top: 5px;">轻松日语</h4>
			<p style="color: #666666;margin-top: 5px;font-size: 13px;">v.{{version}}</p>
		</view>
		<view style="margin: 15px;border-radius: 8px;padding:10px 20px;background-color: white;font-size: 14px;">
			<view
				@click="goPage('/otherpages/browse/browse',{src:'https://www.yuque.com/xiaoerwangluo/pteeim/ukw6hnx82vfrgg4g'})"
				style="display: flex;justify-content: space-between;padding: 10px 0px;">
				<p>更新日志</p>
				<wd-icon name="arrow-right" size="18px" color="#666666"></wd-icon>
			</view>
			<view style="height: 1px;background-color: #f6f6f6;">
			</view>
			<view style="display: flex;justify-content: space-between;padding: 10px 0px;">
				<p>开发团队</p>
				<p style="color: #666666;">小二网络科技工作室</p>
			</view>
			<view style="height: 1px;background-color: #f6f6f6;">
			</view>
			<view style="display: flex;justify-content: space-between;padding: 10px 0px;">
				<p>微信公众号</p>
				<p style="color: #666666;display: flex;align-items: center;"><uni-icons type="weixin" size="25"
						color="#43a141" style="margin-right: 3px;"></uni-icons>小二网络优选</p>
			</view>
			<view style="height: 1px;background-color: #f6f6f6;">
			</view>
			<view style="display: flex;justify-content: space-between;padding: 10px 0px;">
				<p>官网</p>
				<p style="color: #666666;">www.x2.ink</p>
			</view>
		</view>
		<view style="position: fixed;bottom:env(safe-area-inset-bottom);text-align: center;width: 100%;"
			@click="goPage('/otherpages/browse/browse',{src:'https://www.yuque.com/xiaoerwangluo/pteeim/ht003yxzz0egvmke'})">
			<p style="text-decoration:underline;color: #3c9cff;">服务条款 | 隐私政策</p>
			<p style="color: #666666;font-size: 13px;margin-top: 5px;">Copyright © 2023-2025 小二网络.All Rights Reserved
				<br>
				皖ICP备2024032367号-2A
			</p>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import Navbar from '@/components/navbar/navbar.vue';
	const version = uni.getSystemInfoSync().appVersion
	import {
		goPage
	} from "@/utils/common.js"
</script>

<style scoped lang="scss">

</style>