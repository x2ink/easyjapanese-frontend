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
/* 	@font-face {
		font-family: 'jp';
		src: url('~http://jp.x2.ink/images/font/jp.ttf');
	} */

	page {
		background: #F3F3F5;
		background-attachment: fixed;
	}

	.jpfont {
		/* font-family: 'jp'; */
	}

	::-webkit-scrollbar {
		display: none !important;
	}

	/*每个页面公共css */
	._GCENTER {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	._PCENTERY {
		position: relative;
		top: 50%;
		transform: translateY(-50%);
	}

	._PCENTERX {
		position: relative;
		left: 50%;
		transform: translateX(-50%);
	}

	._BACKGROUND {
		background-position: center;
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}
</style>