<template>
	<NavBar title="开始学习" style="background-color: #F6F6F6;"></NavBar>
	<!-- 单词选择意思 -->
	<!-- <WordsSelectMeaning></WordsSelectMeaning> -->
	<!-- 意思选择单词 -->
	<!-- <MeaningSelectWords></MeaningSelectWords> -->
	<!-- 意思想单词 -->
	<MeaningThinkWords></MeaningThinkWords>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import NavBar from '@/components/navbar.vue'
	import WordList from "@/components/wordlist.vue"
	import WordsSelectMeaning from "@/components/learnword/wordsSelectMeaning.vue"
	import MeaningSelectWords from "@/components/learnword/meaningSelectWords.vue"
	import MeaningThinkWords from "@/components/learnword/meaningThinkWords.vue"
</script>

<style lang="scss">

</style>