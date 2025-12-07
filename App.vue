<script>
	export default {
		onShareAppMessage() {
			return {
				title: "邀新打榜赢全年护肤大礼包",
				path: '/pages/index/index/index'
			}
		},
		methods: {
			globalShare() {
				uni.onAppRoute((res) => {
					
					const pages = getCurrentPages();
					
					const view = pages[pages.length - 1];
					if (view) {
						
						uni.showShareMenu({
							withShareTicket: true,
							menus: ["shareAppMessage", "shareTimeline"]
						});
						let data = {
							title: "邀新打榜赢全年护肤大礼包",
							path: "pages/index/index/index",
						};
						view.onShareTimeline = () => {
							return data;
						}
						view.onShareAppMessage = () => {
							return data;
						};
					}
				});
			}
		},
		onLaunch: function() {
			
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import url("./static/css/all.css");

	button::after {
		border: none;
	}

	button:active {
		transform: scale(0.98);
	}

	button {
		background-color: transparent;
		padding-left: 0;
		padding-right: 0;
		line-height: inherit;
		border-radius: 0;
		margin: 0;
	}

	.btn-primary {
		gap: 4px;
		background: #07C160;
		color: white;
		border-radius: 8px;
		padding: 0 16px;
		font-size: 14px;
		height: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.btn-info {
		gap: 4px;
		background: #f0f0f0;
		border-radius: 8px;
		padding: 0 16px;
		font-size: 14px;
		height: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	page {
		background: #f8f9fa;
		background-attachment: fixed;
	}

	.jpfont {
		
	}

	::-webkit-scrollbar {
		display: none !important;
	}

	
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