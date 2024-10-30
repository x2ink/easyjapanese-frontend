<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	page {
		background: linear-gradient(to bottom, #F0F3FC, #FFFFFF);
		background-attachment: fixed;
		/* 固定背景，使其不会随着滚动而移动 */
	}
</style>