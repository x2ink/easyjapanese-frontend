import {
	defineStore
} from 'pinia'
export const localwordsModule = defineStore('localwords', {
	unistorage: true,
	state: () => {
		return {
			time: 0,
			writeList: [],
			soundList: [],
		}
	},
	actions: {
		pushWrite(word) {
			this.writeList.push(word)
		},
		pushSound(word) {
			this.soundList.push(word)
		},
		setTime(time) {
			this.time = time
		},
		clear() {
			this.time = 0;
			this.writeList = [];
			this.soundList = [];
		}
	}
})