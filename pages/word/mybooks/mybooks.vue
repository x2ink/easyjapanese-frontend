<template>
	<view>
		<Navbar title="单词本">
		</Navbar>
		<BookList @add="addbook.show = true" ref="booklist"></BookList>
		<AddBook @success="booklist.getList()" ref="addbook"></AddBook>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import Navbar from '@/components/navbar/navbar.vue';
	import BookList from '@/components/booklist/booklist.vue';
	import AddBook from '@/components/addbook/addbook.vue'
	const addbook = ref(null)
	const booklist = ref(null)
</script>