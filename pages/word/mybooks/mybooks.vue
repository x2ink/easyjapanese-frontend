<template>
	<view>
		<Navbar title="单词本">
		</Navbar>
		<BookList></BookList>
	</view>
</template>

<script setup>
	import Navbar from '@/components/navbar/navbar.vue';
	import BookList from '@/components/booklist/booklist.vue';
</script>
