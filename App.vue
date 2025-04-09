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
	@import url("./static/css/all.css");

	button::after {

		border: none;

	}

	button {

		background-color: transparent;

		padding-left: 0;

		padding-right: 0;

		line-height: inherit;

	}

	button {

		border-radius: 0;

	}


	page {
		background: #f8f9fa;
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